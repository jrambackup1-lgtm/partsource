#!/usr/bin/env python3
"""Deterministically score the frozen fastener truth/composition corpus.

Two validation-only systems are measured:
1. candidate_contract_v1: the explicit safe composition contract frozen with v1.
2. current_artifact_baseline: a local emulation of the checked-in importer and
   latest SQL search semantics (including LIMIT 1), using the permitted packet.

No network, database write, production code, or public artifact is involved.
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any, Callable

ROOT = Path(__file__).resolve().parents[2]
DEFAULT_CORPUS = ROOT / "research" / "fixtures" / "fastener-truth-composition-benchmark-v1.0.0.json"
DEFAULT_RESULTS = ROOT / "research" / "fixtures" / "fastener-truth-composition-benchmark-v1.0.0.results.json"
NAMESPACE = "permitted-reference-clue"
RELEASE_ID = "candidate-fastener-poc-r0"

DATA_FILES = (
    ("socket", ROOT / "data" / "socket-head-cap-screws.csv"),
    ("hex", ROOT / "data" / "hex-head-screws.csv"),
    ("rounded", ROOT / "data" / "rounded-head-screws.csv"),
)


def clean(value: str | None) -> str | None:
    trimmed = (value or "").strip()
    return trimmed if trimmed and trimmed != "-" else None


def target_key(reference: str) -> str:
    digest = hashlib.sha256(f"{NAMESPACE}\0{reference}".encode("utf-8")).hexdigest()[:20]
    return f"candidate-cfg-{digest}"


def load_current_records() -> list[dict[str, Any]]:
    records: list[dict[str, Any]] = []
    family_type = {"socket": "Socket Head Cap Screw", "hex": "Hex Head Screw", "rounded": "Rounded Head Screw"}
    for family, path in DATA_FILES:
        with path.open("r", encoding="utf-8-sig", newline="") as handle:
            for raw in csv.DictReader(handle):
                sku = clean(raw.get("sku"))
                if not sku:
                    raise RuntimeError("Permitted packet row is missing the importer-required source key")
                head_parts = [
                    clean(raw.get("socket_head_profile")),
                    clean(raw.get("rounded_head_profile")),
                    clean(raw.get("rounded_head_style")),
                    clean(raw.get("head_type")),
                ]
                head = " ".join(part for part in head_parts if part)
                if not head:
                    head = {"socket": "Socket", "hex": "Hex", "rounded": "Rounded"}[family]
                strength = (
                    clean(raw.get("fastener_strength_grade_class"))
                    or clean(raw.get("tensile_strength"))
                    or clean(raw.get("hardness"))
                )
                records.append({
                    "family": family,
                    "type": family_type[family],
                    "reference_number": clean(raw.get("mcmaster_pn")),
                    "source_sku": sku,
                    "title": clean(raw.get("title")),
                    "thread": clean(raw.get("thread_size")),
                    "pitch": clean(raw.get("thread_pitch")),
                    "length": clean(raw.get("length")),
                    "head": head,
                    "material": clean(raw.get("material")),
                    "finish": clean(raw.get("finish")),
                    "drive": clean(raw.get("drive_style")),
                    "strength": strength,
                    "standard": clean(raw.get("specifications_met")),
                    "verification": "demo-only",
                    "synthetic": True,
                })
    return records


def outcome(
    response_state: str,
    identity_cardinality: str,
    selection_state: str,
    reason_codes: list[str],
    target: str | None = None,
) -> dict[str, Any]:
    value: dict[str, Any] = {
        "response_state": response_state,
        "identity_cardinality": identity_cardinality,
        "selection_state": selection_state,
        "reason_codes": sorted(reason_codes),
    }
    if target is not None:
        value["target_key"] = target
    return value


def conflict_reason(constraints: dict[str, Any]) -> str | None:
    thread_values = constraints.get("thread_designation", [])
    systems = constraints.get("measurement_system", [])
    if systems and thread_values and any("/" in str(value) or "-" in str(value) for value in thread_values):
        if "metric" in systems:
            return "measurement_system_conflict"
    if len(thread_values) > 1:
        return "conflicting_thread_diameter"
    if len(constraints.get("pitch", [])) > 1:
        return "conflicting_pitch"
    lengths = constraints.get("length", [])
    if len(lengths) > 1:
        units = {str(value.get("unit")) for value in lengths if isinstance(value, dict) and value.get("unit")}
        return "conflicting_exact_length" if len(units) > 1 else "conflicting_length"
    for field, code in (
        ("family", "conflicting_family"),
        ("drive", "conflicting_drive"),
        ("material", "conflicting_material"),
        ("finish", "conflicting_finish"),
    ):
        if len(constraints.get(field, [])) > 1:
            return code
    return None


def candidate_contract(case: dict[str, Any]) -> dict[str, Any]:
    request = case["input"]
    if request.get("injected_service_failure"):
        return outcome("service_unavailable", "not_evaluated", "abstain", ["service_failure"])

    if request.get("requested_family"):
        return outcome("unsupported_family", "zero", "abstain", ["unsupported_family"])

    constraints = request.get("constraints") or {}
    conflict = conflict_reason(constraints)
    if conflict:
        return outcome("conflict", "zero", "abstain", [conflict])

    identifier = request.get("identifier")
    if identifier is not None:
        value = str(identifier["value"])
        namespace = identifier.get("namespace")
        requested_release = request.get("release_id")

        if case.get("source_observation"):
            observation = case["source_observation"]
            if namespace != NAMESPACE:
                return outcome("ambiguous_identifier", "not_evaluated", "abstain", ["namespace_required"])
            reasons = ["candidate_record_unreviewed"]
            if observation.get("observed_missing_import_fields"):
                reasons.append("missing_critical_facts")
            return outcome("exact_mapping", "one", "abstain", reasons, observation["target_key"])

        mappings = list((case.get("contract_fixture") or {}).get("mappings", []))
        value_matches = [mapping for mapping in mappings if str(mapping.get("value")) == value]
        matches = [mapping for mapping in value_matches if namespace is None or mapping.get("namespace") == namespace]
        if namespace is None and len(matches) > 1:
            return outcome("ambiguous_identifier", "many", "abstain", ["namespace_required"])
        if len(matches) > 1:
            return outcome("ambiguous_identifier", "many", "abstain", ["identifier_collision"])
        release_matches = [mapping for mapping in matches if mapping.get("release_id") == requested_release]
        if not release_matches and matches:
            return outcome("not_in_release", "zero", "abstain", ["release_mismatch"])
        if len(release_matches) != 1:
            return outcome("ambiguous_identifier", "not_evaluated", "abstain", ["namespace_required"])
        mapping = release_matches[0]
        state = mapping.get("state")
        if state == "withdrawn":
            return outcome("withdrawn", "zero", "abstain", ["mapping_withdrawn"])
        if state == "unavailable":
            return outcome("unavailable", "zero", "abstain", ["mapping_unavailable"])
        return outcome("exact_mapping", "one", "abstain", ["candidate_record_unreviewed"], mapping.get("target_key"))

    intent = request.get("intent")
    if intent == "broad_family_discovery":
        if request.get("family_boundary_status") == "unreviewed":
            return outcome("clarification_required", "not_evaluated", "abstain", ["family_boundary_review_pending"])
        return outcome("family_candidates", "many", "candidate_set", ["family_not_configuration"])
    if intent == "partial_requirement":
        return outcome("clarification_required", "not_evaluated", "abstain", ["insufficient_constraints"])
    if intent == "constrained_discovery":
        return outcome(
            "constrained_candidates",
            "many",
            "candidate_set",
            ["candidate_contract_only", "mechanical_family_review_pending"],
        )
    return outcome("clarification_required", "not_evaluated", "abstain", ["insufficient_constraints"])


def sql_like_current_search(query: str, records: list[dict[str, Any]]) -> tuple[list[dict[str, Any]], bool]:
    normalized = query.strip().lower()
    exact_references = [record for record in records if str(record.get("reference_number") or "").lower() == normalized]
    if exact_references:
        return exact_references[:1], True
    exact_source_keys = [record for record in records if str(record.get("source_sku") or "").lower() == normalized]
    if exact_source_keys:
        return exact_source_keys[:1], True

    generic = {"screw", "screws", "bolt", "bolts", "fastener", "fasteners"}
    tokens = [token for token in normalized.split() if token not in generic]
    found: list[dict[str, Any]] = []
    for record in records:
        haystack = " ".join(
            str(record.get(field) or "")
            for field in (
                "reference_number", "source_sku", "title", "family", "type", "thread", "pitch",
                "length", "head", "material", "finish", "drive", "strength", "standard",
            )
        ).lower()
        if normalized in haystack or not tokens or all(token in haystack for token in tokens):
            found.append(record)
            if len(found) == 25:
                break
    return found, False


def current_artifact(case: dict[str, Any], base_records: list[dict[str, Any]]) -> dict[str, Any]:
    request = case["input"]
    if request.get("injected_service_failure"):
        # Current Edge/hook path now fails closed and clears result state, although
        # it does not provide the richer release/request DTO proposed by the contract.
        return outcome("service_unavailable", "not_evaluated", "abstain", ["service_failure"])

    overlay = []
    for index, row in enumerate((case.get("contract_fixture") or {}).get("legacy_rows", []), 1):
        overlay.append({
            "family": "socket",
            "type": "Socket Head Cap Screw",
            "reference_number": row.get("reference_number"),
            "source_sku": f"synthetic-private-{index}",
            "title": "Synthetic legacy state fixture",
            "thread": "M4",
            "pitch": "0.7 mm",
            "length": "12 mm",
            "head": "Socket",
            "material": "Synthetic",
            "finish": None,
            "drive": "Hex",
            "strength": None,
            "standard": None,
            "verification": "demo-only",
            "synthetic": True,
        })
    records = overlay + base_records
    rows, exact = sql_like_current_search(str(request.get("query") or ""), records)
    if exact and rows:
        reference = str(rows[0].get("reference_number") or "")
        target = target_key(reference) if case.get("source_observation") else "legacy-limit-one-target"
        return outcome("exact_mapping", "one", "unique", ["legacy_limit_one"], target)
    if rows:
        cardinality = "one" if len(rows) == 1 else "many"
        selection = "unique" if len(rows) == 1 else "candidate_set"
        return outcome("row_results", cardinality, selection, ["row_first_lexical_search"])
    return outcome("no_match", "zero", "abstain", ["no_rows"])


def validate_source_observations(corpus: dict[str, Any], records: list[dict[str, Any]]) -> dict[str, int]:
    by_reference: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for record in records:
        if record.get("reference_number"):
            by_reference[str(record["reference_number"])].append(record)

    checked = 0
    exact_unique = 0
    missingness_checked = 0
    composition_checked = 0
    for case in corpus["cases"]:
        observation = case.get("source_observation")
        if not observation:
            continue
        checked += 1
        reference = str(observation["reference"])
        matches = by_reference.get(reference, [])
        if len(matches) != 1:
            raise RuntimeError(f"Source observation {case['id']} no longer has exactly one imported reference match")
        exact_unique += 1
        if observation["target_key"] != target_key(reference):
            raise RuntimeError(f"Source observation {case['id']} target digest mismatch")
        record = matches[0]
        actual_missing = sorted(
            field
            for field in ("pitch", "finish", "drive", "standard", "strength")
            if not record.get(field)
        )
        if actual_missing != observation["observed_missing_import_fields"]:
            raise RuntimeError(f"Source observation {case['id']} missingness changed")
        missingness_checked += 1
        if case["case_class"] == "constrained_metric_input":
            constraints = case["input"]["constraints"]
            if str(record["thread"]) not in constraints["thread_designation"]:
                raise RuntimeError(f"Source composition {case['id']} thread mismatch")
            supplied_pitch = str(constraints["pitch"][0]["value"])
            if supplied_pitch not in str(record["pitch"]):
                raise RuntimeError(f"Source composition {case['id']} pitch mismatch")
            if str(record["length"]) != str(constraints["length"][0]["supplied"]):
                raise RuntimeError(f"Source composition {case['id']} length mismatch")
            composition_checked += 1
    return {
        "source_backed_cases_checked": checked,
        "unique_reference_observations_checked": exact_unique,
        "missingness_observations_checked": missingness_checked,
        "metric_compositions_checked": composition_checked,
    }


def case_passes(expected_value: dict[str, Any], actual: dict[str, Any]) -> tuple[bool, list[str]]:
    differences: list[str] = []
    for field in ("response_state", "identity_cardinality", "selection_state"):
        if actual.get(field) != expected_value.get(field):
            differences.append(field)
    if "target_key" in expected_value and actual.get("target_key") != expected_value.get("target_key"):
        differences.append("target_key")
    expected_reasons = set(expected_value.get("reason_codes", []))
    actual_reasons = set(actual.get("reason_codes", []))
    if not expected_reasons.issubset(actual_reasons):
        differences.append("reason_codes")
    return not differences, differences


def score_system(
    name: str,
    corpus: dict[str, Any],
    evaluator: Callable[[dict[str, Any]], dict[str, Any]],
) -> dict[str, Any]:
    per_class: dict[str, Counter[str]] = defaultdict(Counter)
    failures: list[dict[str, Any]] = []
    pass_count = 0
    actual_abstentions = 0
    false_unique_cases = 0
    false_unique_identity = 0
    false_unique_selection = 0

    for case in corpus["cases"]:
        expected_value = case["expected"]
        actual = evaluator(case)
        passed, differences = case_passes(expected_value, actual)
        pass_count += int(passed)
        actual_abstentions += int(actual.get("selection_state") == "abstain")
        identity_false = actual.get("identity_cardinality") == "one" and expected_value.get("identity_cardinality") != "one"
        selection_false = actual.get("selection_state") == "unique" and expected_value.get("selection_state") != "unique"
        false_unique_identity += int(identity_false)
        false_unique_selection += int(selection_false)
        false_unique_cases += int(identity_false or selection_false)

        bucket = per_class[case["case_class"]]
        bucket["total"] += 1
        bucket["pass"] += int(passed)
        bucket["fail"] += int(not passed)
        bucket["actual_abstentions"] += int(actual.get("selection_state") == "abstain")
        bucket["false_unique_cases"] += int(identity_false or selection_false)
        if not passed:
            failures.append({
                "id": case["id"],
                "case_class": case["case_class"],
                "differences": differences,
                "actual": actual,
            })

    total = len(corpus["cases"])
    return {
        "system": name,
        "total": total,
        "pass": pass_count,
        "fail": total - pass_count,
        "actual_abstentions": actual_abstentions,
        "false_unique_matches": false_unique_cases,
        "false_unique_identity": false_unique_identity,
        "false_unique_selection": false_unique_selection,
        "by_case_class": {key: dict(value) for key, value in sorted(per_class.items())},
        "failures": failures,
    }


def validate_schema(corpus: dict[str, Any]) -> None:
    if corpus.get("schema_version") != "fastener-truth-benchmark-schema-v1":
        raise RuntimeError("Unexpected corpus schema")
    if corpus.get("corpus_version") != "1.0.0":
        raise RuntimeError("Unexpected corpus version")
    cases = corpus.get("cases")
    if not isinstance(cases, list) or len(cases) != 120:
        raise RuntimeError("Frozen v1 corpus must contain exactly 120 cases")
    if len({case.get("id") for case in cases}) != len(cases):
        raise RuntimeError("Case IDs are not unique")
    required_classes = set(corpus["classification_schema"]["case_class"])
    present_classes = {case["case_class"] for case in cases}
    if required_classes != present_classes:
        raise RuntimeError(f"Case-class coverage mismatch: {sorted(required_classes ^ present_classes)}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--corpus", type=Path, default=DEFAULT_CORPUS)
    parser.add_argument("--output", type=Path, default=DEFAULT_RESULTS)
    parser.add_argument("--stdout", action="store_true", help="Print full result JSON instead of the compact summary")
    args = parser.parse_args()

    corpus_bytes = args.corpus.read_bytes()
    corpus_hash = hashlib.sha256(corpus_bytes).hexdigest()
    corpus = json.loads(corpus_bytes)
    validate_schema(corpus)
    current_records = load_current_records()
    source_checks = validate_source_observations(corpus, current_records)

    candidate_score = score_system("candidate_contract_v1", corpus, candidate_contract)
    current_score = score_system(
        "current_artifact_baseline",
        corpus,
        lambda case: current_artifact(case, current_records),
    )

    case_classes = Counter(case["case_class"] for case in corpus["cases"])
    evidence_bases = Counter(case["evidence_basis"] for case in corpus["cases"])
    expected_abstentions = sum(case["expected"]["selection_state"] == "abstain" for case in corpus["cases"])
    expected_candidate_sets = sum(case["expected"]["selection_state"] == "candidate_set" for case in corpus["cases"])
    expected_unique = sum(case["expected"]["selection_state"] == "unique" for case in corpus["cases"])
    unresolved = [case["id"] for case in corpus["cases"] if case["expected"]["answer_key_status"] == "unresolved_domain_review"]

    result = {
        "result_schema_version": "fastener-truth-benchmark-results-v1",
        "corpus": str(args.corpus.relative_to(ROOT)).replace("\\", "/"),
        "corpus_sha256": corpus_hash,
        "corpus_version": corpus["corpus_version"],
        "total_cases": len(corpus["cases"]),
        "case_class_counts": dict(sorted(case_classes.items())),
        "evidence_basis_counts": dict(sorted(evidence_bases.items())),
        "expected_selection_counts": {
            "abstain": expected_abstentions,
            "candidate_set": expected_candidate_sets,
            "unique": expected_unique,
        },
        "unresolved_answer_key_count": len(unresolved),
        "unresolved_answer_key_case_ids": unresolved,
        "source_validation": source_checks,
        "current_import_record_count": len(current_records),
        "systems": {
            "candidate_contract_v1": candidate_score,
            "current_artifact_baseline": current_score,
        },
        "limitations": [
            "The candidate-contract score validates the frozen deterministic oracle, not production implementation.",
            "Current SQL is emulated locally from checked-in semantics; no live Edge/database latency or deployment state is measured.",
            "There are zero mechanically reviewed unique-selection answer keys because no reviewed immutable release exists.",
            "Unresolved domain cases score only safe abstention/clarification, never a fabricated engineering classification.",
        ],
    }

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(result, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    if args.stdout:
        print(json.dumps(result, indent=2, sort_keys=True))
    else:
        compact = {
            "corpus_sha256": corpus_hash,
            "total_cases": len(corpus["cases"]),
            "expected_selection_counts": result["expected_selection_counts"],
            "unresolved_answer_key_count": len(unresolved),
            "candidate_contract_v1": {key: candidate_score[key] for key in ("pass", "fail", "actual_abstentions", "false_unique_matches")},
            "current_artifact_baseline": {key: current_score[key] for key in ("pass", "fail", "actual_abstentions", "false_unique_matches")},
            "result_artifact": str(args.output.relative_to(ROOT)).replace("\\", "/"),
        }
        print(json.dumps(compact, sort_keys=True))


if __name__ == "__main__":
    main()
