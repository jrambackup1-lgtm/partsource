#!/usr/bin/env python3
"""Aggregate-only proxy data-quality audit for the 2026-08-10 validation gate.

Reads the permitted local CSV packet and frozen v1 benchmark. It prints no raw
rows or identifier values and performs no writes.
"""
from __future__ import annotations

import copy
import csv
import hashlib
import importlib.util
import json
import re
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[2]
DATA = {
    "socket": ROOT / "data" / "socket-head-cap-screws.csv",
    "hex": ROOT / "data" / "hex-head-screws.csv",
    "rounded": ROOT / "data" / "rounded-head-screws.csv",
}
CORPUS = ROOT / "research" / "fixtures" / "fastener-truth-composition-benchmark-v1.0.0.json"
SCORER = ROOT / "research" / "validation-tools" / "score_fastener_truth_benchmark_v1.py"
FINISH_IN_MATERIAL = re.compile(r"oxide|plated|coated|passivat", re.I)


def clean(value: str | None) -> str | None:
    value = (value or "").strip()
    return value if value and value != "-" else None


def populated(row: dict[str, Any], field: str) -> bool:
    return clean(row.get(field)) is not None


def load_rows() -> dict[str, list[dict[str, Any]]]:
    result: dict[str, list[dict[str, Any]]] = {}
    for bucket, path in DATA.items():
        with path.open(encoding="utf-8-sig", newline="") as handle:
            result[bucket] = [dict(row) for row in csv.DictReader(handle)]
    return result


def benchmark_family(row: dict[str, Any], bucket: str) -> str | None:
    text = " ".join(
        str(clean(row.get(field)) or "")
        for field in (
            "title", "socket_head_profile", "rounded_head_profile",
            "rounded_head_style", "head_type", "drive_style", "specifications_met",
        )
    ).lower()
    drive = str(clean(row.get("drive_style")) or "").lower()
    if bucket == "socket":
        excluded = ("low profile", "ultra-low", "ultra low", "high profile", "pilot", "torx", "square drive")
        return "socket_head_cap_screws" if not any(term in text for term in excluded) else None
    if "button" in text and "hex" in drive and not any(term in text for term in ("flange", "collar")):
        return "hex_socket_button_head_screws"
    if "pan" in text and any(term in drive for term in ("phillips", "slotted")) and "washer" not in text:
        return "pan_head_machine_screws"
    return None


def metric_composition(row: dict[str, Any]) -> bool:
    thread = clean(row.get("thread_size")) or ""
    return thread.upper().startswith("M") and populated(row, "thread_pitch") and populated(row, "length")


def refined_family(row: dict[str, Any], bucket: str) -> str | None:
    text = " ".join(
        str(clean(row.get(field)) or "")
        for field in ("title", "socket_head_profile", "rounded_head_profile", "rounded_head_style", "head_type", "drive_style", "specifications_met")
    ).lower()
    drive = str(clean(row.get("drive_style")) or "").lower()
    if bucket == "socket" and str(clean(row.get("socket_head_profile")) or "").lower() == "standard" and drive == "hex":
        return "socket_head_cap_screws"
    style = str(clean(row.get("rounded_head_style")) or "").lower()
    if bucket == "rounded" and style == "button" and drive == "hex" and not any(term in text for term in ("flange", "collar")):
        return "hex_socket_button_head_screws"
    if bucket == "rounded" and style == "pan" and drive in ("phillips", "slotted") and "washer" not in text:
        return "pan_head_machine_screws"
    return None


def count_fields(rows: list[dict[str, Any]]) -> dict[str, int]:
    return {
        "thread_size": sum(populated(r, "thread_size") for r in rows),
        "length": sum(populated(r, "length") for r in rows),
        "material": sum(populated(r, "material") for r in rows),
        "strength_any": sum(any(populated(r, f) for f in ("fastener_strength_grade_class", "tensile_strength", "hardness")) for r in rows),
        "strength_multiple": sum(sum(populated(r, f) for f in ("fastener_strength_grade_class", "tensile_strength", "hardness")) > 1 for r in rows),
        "head_dimensions": sum(populated(r, "head_height") and (populated(r, "head_diameter") or populated(r, "head_width")) for r in rows),
        "drive_style_or_size": sum(populated(r, "drive_style") or populated(r, "drive_size") for r in rows),
        "identifier": sum(populated(r, "mcmaster_pn") for r in rows),
        "thread_pitch": sum(populated(r, "thread_pitch") for r in rows),
        "finish": sum(populated(r, "finish") for r in rows),
        "standard": sum(populated(r, "specifications_met") for r in rows),
        "thread_direction": sum(populated(r, "thread_direction") for r in rows),
        "thread_fit": sum(populated(r, "thread_fit") for r in rows),
        "thread_extent": sum(populated(r, "threading") for r in rows),
        "drive_size": sum(populated(r, "drive_size") for r in rows),
        "material_with_finish_term": sum(bool(FINISH_IN_MATERIAL.search(clean(r.get("material")) or "")) for r in rows),
    }


def duplicate_summary(values: list[str | None]) -> dict[str, int]:
    present = [v for v in values if v is not None]
    exact = Counter(present)
    folded = Counter(v.casefold() for v in present)
    return {
        "nonblank": len(present),
        "missing": len(values) - len(present),
        "distinct_exact": len(exact),
        "duplicate_exact_value_groups": sum(n > 1 for n in exact.values()),
        "rows_in_duplicate_exact_groups": sum(n for n in exact.values() if n > 1),
        "distinct_casefold": len(folded),
        "duplicate_casefold_value_groups": sum(n > 1 for n in folded.values()),
        "rows_in_duplicate_casefold_groups": sum(n for n in folded.values() if n > 1),
    }


def load_scorer():
    spec = importlib.util.spec_from_file_location("proxy_scorer", SCORER)
    assert spec and spec.loader
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def score_mutation(scorer: Any, corpus: dict[str, Any], records: list[dict[str, Any]]) -> dict[str, int]:
    source = scorer.validate_source_observations(corpus, records)
    score = scorer.score_system("mutation", corpus, scorer.candidate_contract)
    return {
        "source_cases_checked": source["source_backed_cases_checked"],
        "pass": score["pass"],
        "fail": score["fail"],
        "false_unique_matches": score["false_unique_matches"],
    }


def main() -> None:
    buckets = load_rows()
    all_rows = [r for rows in buckets.values() for r in rows]
    bucket_counts = {bucket: len(rows) for bucket, rows in buckets.items()}
    field_counts = count_fields(all_rows)
    field_counts_by_bucket = {bucket: count_fields(rows) for bucket, rows in buckets.items()}
    source_missing_tokens = {
        field: {
            "blank_after_trim": sum(not (r.get(field) or "").strip() for r in all_rows),
            "exact_dash_after_trim": sum((r.get(field) or "").strip() == "-" for r in all_rows),
            "canonical_missing": sum(clean(r.get(field)) is None for r in all_rows),
        }
        for field in ("sku", "mcmaster_pn", "thread_size", "length", "material", "finish", "thread_pitch", "specifications_met")
    }

    benchmark_pools: dict[str, list[dict[str, Any]]] = defaultdict(list)
    refined_pools: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for bucket, rows in buckets.items():
        for row in rows:
            family = benchmark_family(row, bucket)
            if family and metric_composition(row):
                benchmark_pools[family].append(row)
            family = refined_family(row, bucket)
            if family:
                refined_pools[family].append(row)

    pool_counts: dict[str, Any] = {}
    for family in ("socket_head_cap_screws", "hex_socket_button_head_screws", "pan_head_machine_screws"):
        metric_rows = benchmark_pools[family]
        refined_rows = refined_pools[family]
        pool_counts[family] = {
            "benchmark_metric_rows": len(metric_rows),
            "refined_all_rows": len(refined_rows),
            "benchmark_metric_finish_missing": sum(not populated(r, "finish") for r in metric_rows),
            "benchmark_metric_standard_missing": sum(not populated(r, "specifications_met") for r in metric_rows),
            "benchmark_metric_material_with_finish_term": sum(bool(FINISH_IN_MATERIAL.search(clean(r.get("material")) or "")) for r in metric_rows),
            "benchmark_metric_strength_multiple": sum(sum(populated(r, f) for f in ("fastener_strength_grade_class", "tensile_strength", "hardness")) > 1 for r in metric_rows),
            "refined_identifier_populated": sum(populated(r, "mcmaster_pn") for r in refined_rows),
            "refined_pitch_populated": sum(populated(r, "thread_pitch") for r in refined_rows),
            "refined_finish_populated": sum(populated(r, "finish") for r in refined_rows),
            "refined_standard_populated": sum(populated(r, "specifications_met") for r in refined_rows),
        }

    socket_rows = buckets["socket"]
    typed_low = [r for r in socket_rows if str(clean(r.get("socket_head_profile")) or "").casefold() == "low"]
    typed_low_admitted = [r for r in typed_low if benchmark_family(r, "socket") == "socket_head_cap_screws"]
    typed_low_metric = [r for r in typed_low_admitted if metric_composition(r)]
    din_low_metric = [r for r in typed_low_metric if "din 7984" in str(clean(r.get("specifications_met")) or "").lower()]

    signature_fields = (
        "thread_size", "thread_pitch", "length", "thread_type", "thread_diameter", "thread_spacing",
        "thread_direction", "thread_fit", "threading", "min_thread_length", "socket_head_profile",
        "head_type", "head_diameter", "head_height", "drive_style", "drive_size", "material", "finish",
        "fastener_strength_grade_class", "tensile_strength", "hardness", "specifications_met",
    )
    socket_signatures = Counter(tuple(clean(row.get(field)) for field in signature_fields) for row in benchmark_pools["socket_head_cap_screws"])
    duplicate_signatures = [count for count in socket_signatures.values() if count > 1]

    references = [clean(r.get("mcmaster_pn")) for r in all_rows]
    skus = [clean(r.get("sku")) for r in all_rows]
    cross_namespace_values = set(v.casefold() for v in references if v) & set(v.casefold() for v in skus if v)

    scorer = load_scorer()
    corpus = json.loads(CORPUS.read_text(encoding="utf-8"))
    records = scorer.load_current_records()
    scorer.validate_schema(corpus)
    base_candidate = scorer.score_system("candidate", corpus, scorer.candidate_contract)
    base_current = scorer.score_system("current", corpus, lambda case: scorer.current_artifact(case, records))

    metric_cases = [c for c in corpus["cases"] if c["case_class"] == "constrained_metric_input"]
    exact_source_cases = [c for c in corpus["cases"] if c.get("source_observation") and c["input"].get("identifier")]
    source_cases = [c for c in corpus["cases"] if c.get("source_observation")]

    mutations: dict[str, Any] = {}
    mutated = copy.deepcopy(corpus)
    for case in mutated["cases"]:
        if case["case_class"] == "constrained_metric_input":
            case["input"]["constraints"]["pitch"][0]["unit"] = "in"
    mutations["pitch_unit_mm_to_in_all_16"] = score_mutation(scorer, mutated, records)

    mutated = copy.deepcopy(corpus)
    for case in mutated["cases"]:
        if case["case_class"] == "constrained_metric_input":
            value = str(case["input"]["constraints"]["pitch"][0]["value"])
            case["input"]["constraints"]["pitch"][0]["value"] = re.sub(r"\s*mm$", "", value, flags=re.I)
    mutations["strip_embedded_mm_from_pitch_value_all_16"] = score_mutation(scorer, mutated, records)

    mutated = copy.deepcopy(corpus)
    for case in mutated["cases"]:
        if case["case_class"] == "constrained_metric_input":
            case["input"]["constraints"]["family"] = ["synthetic_wrong_family"]
    mutations["wrong_single_family_all_16"] = score_mutation(scorer, mutated, records)

    mutated = copy.deepcopy(corpus)
    for case in mutated["cases"]:
        if case.get("source_observation"):
            case["source_observation"]["candidate_family"] = "synthetic_wrong_family"
    mutations["wrong_source_candidate_family_all_50"] = score_mutation(scorer, mutated, records)

    mutated = copy.deepcopy(corpus)
    for case in mutated["cases"]:
        if case.get("source_observation") and case["input"].get("identifier"):
            case["input"]["release_id"] = "synthetic-wrong-release"
    mutations["wrong_release_all_34_source_exact_cases"] = score_mutation(scorer, mutated, records)

    incompatible_unchanged = 0
    for case in metric_cases:
        changed = copy.deepcopy(case)
        changed["input"]["constraints"]["pitch"][0]["value"] = "999"
        incompatible_unchanged += scorer.candidate_contract(changed) == scorer.candidate_contract(case)
    mutations["candidate_state_unchanged_after_pitch_999"] = {
        "unchanged": incompatible_unchanged,
        "tested": len(metric_cases),
    }

    dropped_unchanged = 0
    dropped_unique = 0
    critical = ("thread", "pitch", "length", "head", "material", "finish", "drive", "strength", "standard")
    for case in exact_source_cases:
        reference = case["source_observation"]["reference"]
        changed_records = copy.deepcopy(records)
        for record in changed_records:
            if record.get("reference_number") == reference:
                for field in critical:
                    record[field] = None
        before = scorer.current_artifact(case, records)
        after = scorer.current_artifact(case, changed_records)
        dropped_unchanged += before == after
        dropped_unique += after.get("selection_state") == "unique"
    mutations["current_exact_after_all_technical_fields_dropped"] = {
        "unchanged": dropped_unchanged,
        "still_unique_selection": dropped_unique,
        "tested": len(exact_source_cases),
    }

    sample_record = copy.deepcopy(records[0])
    duplicate_records = [sample_record, copy.deepcopy(sample_record)]
    duplicate_result, duplicate_exact = scorer.sql_like_current_search(str(sample_record["reference_number"]), duplicate_records)
    mutations["current_exact_duplicate_injection"] = {
        "injected_matching_rows": 2,
        "returned_rows": len(duplicate_result),
        "exact_branch": int(duplicate_exact),
    }

    low_normalized_excluded = 0
    for row in typed_low_admitted:
        changed = copy.deepcopy(row)
        for field in ("title", "socket_head_profile"):
            if changed.get(field):
                changed[field] = re.sub(r"low-profile|^low$", "low profile", str(changed[field]), flags=re.I)
        low_normalized_excluded += benchmark_family(changed, "socket") is None
    mutations["hyphen_space_normalization_changes_low_profile_membership"] = {
        "changed_to_excluded": low_normalized_excluded,
        "tested": len(typed_low_admitted),
    }

    source_case_by_reference = {c["source_observation"]["reference"]: c["id"] for c in source_cases}
    affected_case_ids = sorted(source_case_by_reference[clean(r.get("mcmaster_pn"))] for r in typed_low if clean(r.get("mcmaster_pn")) in source_case_by_reference)

    result = {
        "source_artifacts": {
            bucket: {"rows": len(buckets[bucket]), "sha256": hashlib.sha256(path.read_bytes()).hexdigest()}
            for bucket, path in DATA.items()
        },
        "row_counts": {**bucket_counts, "total": len(all_rows)},
        "field_counts_all_rows": field_counts,
        "field_counts_by_bucket": field_counts_by_bucket,
        "source_missing_tokens": source_missing_tokens,
        "identifier_counts": {
            "reference_number": duplicate_summary(references),
            "source_sku_global": duplicate_summary(skus),
            "source_sku_by_bucket": {bucket: duplicate_summary([clean(r.get("sku")) for r in rows]) for bucket, rows in buckets.items()},
            "casefold_values_shared_across_reference_and_source_sku_namespaces": len(cross_namespace_values),
        },
        "family_counts": pool_counts,
        "family_leakage": {
            "socket_typed_low_rows": len(typed_low),
            "socket_typed_low_admitted_all": len(typed_low_admitted),
            "socket_typed_low_admitted_metric": len(typed_low_metric),
            "socket_typed_low_admitted_metric_din_7984": len(din_low_metric),
            "socket_typed_low_admitted_metric_other_or_missing_standard": len(typed_low_metric) - len(din_low_metric),
            "affected_frozen_case_count": len(affected_case_ids),
            "affected_frozen_case_ids": affected_case_ids,
        },
        "socket_metric_duplicate_signature": {
            "groups": len(duplicate_signatures),
            "rows": sum(duplicate_signatures),
            "largest_group": max(duplicate_signatures, default=0),
            "signature_field_count": len(signature_fields),
        },
        "benchmark": {
            "corpus_sha256": hashlib.sha256(CORPUS.read_bytes()).hexdigest(),
            "total_cases": len(corpus["cases"]),
            "source_backed_cases": len(source_cases),
            "metric_cases": len(metric_cases),
            "metric_pitch_value_contains_mm_and_unit_mm": sum(
                str(c["input"]["constraints"]["pitch"][0]["value"]).lower().endswith("mm")
                and c["input"]["constraints"]["pitch"][0]["unit"] == "mm"
                for c in metric_cases
            ),
            "metric_material_supplied_with_finish_term": sum(
                bool(FINISH_IN_MATERIAL.search(" ".join(c["input"]["constraints"].get("material_supplied", []))))
                for c in metric_cases
            ),
            "candidate": {key: base_candidate[key] for key in ("pass", "fail", "actual_abstentions", "false_unique_matches", "false_unique_identity", "false_unique_selection")},
            "current": {key: base_current[key] for key in ("pass", "fail", "actual_abstentions", "false_unique_matches", "false_unique_identity", "false_unique_selection")},
        },
        "metamorphic": mutations,
    }
    print(json.dumps(result, indent=2, sort_keys=True))


if __name__ == "__main__":
    main()
