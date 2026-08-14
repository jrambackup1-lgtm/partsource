#!/usr/bin/env python3
"""Build the frozen v1 fastener truth/composition validation corpus.

Validation/research only. Reads the permitted local technical packet, emits only
public-safe technical observations, and never emits source keys or private lineage.
The output is a candidate-contract benchmark, not a reviewed catalog release.
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
from pathlib import Path
from typing import Any, Iterable

ROOT = Path(__file__).resolve().parents[2]
OUTPUT = ROOT / "research" / "fixtures" / "fastener-truth-composition-benchmark-v1.0.0.json"
RELEASE_ID = "candidate-fastener-poc-r0"
NAMESPACE = "permitted-reference-clue"

SOURCE_FILES = {
    "socket_import_bucket": ROOT / "data" / "socket-head-cap-screws.csv",
    "rounded_import_bucket": ROOT / "data" / "rounded-head-screws.csv",
}


def clean(value: str | None) -> str | None:
    trimmed = (value or "").strip()
    return trimmed if trimmed and trimmed != "-" else None


def load_rows() -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    for import_bucket, path in SOURCE_FILES.items():
        with path.open("r", encoding="utf-8-sig", newline="") as handle:
            for raw in csv.DictReader(handle):
                row = {key: clean(value) for key, value in raw.items()}
                row["_import_bucket"] = import_bucket
                rows.append(row)
    return rows


def family_candidate(row: dict[str, Any]) -> str | None:
    text = " ".join(
        str(row.get(field) or "")
        for field in (
            "title",
            "socket_head_profile",
            "rounded_head_profile",
            "rounded_head_style",
            "head_type",
            "drive_style",
            "specifications_met",
        )
    ).lower()
    drive = str(row.get("drive_style") or "").lower()

    if row["_import_bucket"] == "socket_import_bucket":
        excluded = ("low profile", "ultra-low", "ultra low", "high profile", "pilot", "torx", "square drive")
        if not any(term in text for term in excluded):
            return "socket_head_cap_screws"
        return None

    if "button" in text and "hex" in drive and not any(term in text for term in ("flange", "collar")):
        return "hex_socket_button_head_screws"
    if "pan" in text and any(term in drive for term in ("phillips", "slotted")) and "washer" not in text:
        return "pan_head_machine_screws"
    return None


def has_metric_composition(row: dict[str, Any]) -> bool:
    thread = str(row.get("thread_size") or "")
    return thread.upper().startswith("M") and bool(row.get("thread_pitch")) and bool(row.get("length"))


def target_key(reference: str) -> str:
    digest = hashlib.sha256(f"{NAMESPACE}\0{reference}".encode("utf-8")).hexdigest()[:20]
    return f"candidate-cfg-{digest}"


def evenly_spaced(rows: list[dict[str, Any]], count: int) -> list[dict[str, Any]]:
    if len(rows) < count:
        raise RuntimeError(f"Need {count} rows, found {len(rows)}")
    if count == 1:
        return [rows[len(rows) // 2]]
    return [rows[(index * (len(rows) - 1)) // (count - 1)] for index in range(count)]


def expected(
    response_state: str,
    identity_cardinality: str,
    selection_state: str,
    reason_codes: Iterable[str],
    *,
    target: str | None = None,
    unresolved: bool = False,
    unresolved_note: str | None = None,
) -> dict[str, Any]:
    result: dict[str, Any] = {
        "response_state": response_state,
        "identity_cardinality": identity_cardinality,
        "selection_state": selection_state,
        "reason_codes": sorted(reason_codes),
        "answer_key_status": "unresolved_domain_review" if unresolved else "resolved_contract_or_observation",
    }
    if target:
        result["target_key"] = target
    if unresolved_note:
        result["unresolved_note"] = unresolved_note
    return result


def source_case_common(row: dict[str, Any]) -> dict[str, Any]:
    reference = str(row["mcmaster_pn"])
    missing_fields = sorted(
        field
        for field, is_missing in {
            "pitch": not row.get("thread_pitch"),
            "finish": not row.get("finish"),
            "drive": not row.get("drive_style"),
            "standard": not row.get("specifications_met"),
            "strength": not (
                row.get("fastener_strength_grade_class")
                or row.get("tensile_strength")
                or row.get("hardness")
            ),
        }.items()
        if is_missing
    )
    return {
        "reference": reference,
        "target_key": target_key(reference),
        "candidate_family": family_candidate(row),
        "observed_missing_import_fields": missing_fields,
        "record_review_state": "candidate_unreviewed",
    }


def make_case(
    case_id: str,
    case_class: str,
    evidence_basis: str,
    input_value: dict[str, Any],
    expected_value: dict[str, Any],
    *,
    source_observation: dict[str, Any] | None = None,
    contract_fixture: dict[str, Any] | None = None,
) -> dict[str, Any]:
    case: dict[str, Any] = {
        "id": case_id,
        "case_class": case_class,
        "evidence_basis": evidence_basis,
        "input": input_value,
        "expected": expected_value,
    }
    if source_observation:
        case["source_observation"] = source_observation
    if contract_fixture:
        case["contract_fixture"] = contract_fixture
    return case


def build_cases(rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    unique_by_reference: dict[str, dict[str, Any]] = {}
    duplicate_references: set[str] = set()
    for row in rows:
        reference = row.get("mcmaster_pn")
        if not reference:
            continue
        if reference in unique_by_reference:
            duplicate_references.add(reference)
        else:
            unique_by_reference[str(reference)] = row
    for reference in duplicate_references:
        unique_by_reference.pop(reference, None)

    pools: dict[str, list[dict[str, Any]]] = {
        family: sorted(
            (
                row
                for row in unique_by_reference.values()
                if family_candidate(row) == family and has_metric_composition(row)
            ),
            key=lambda row: str(row["mcmaster_pn"]),
        )
        for family in (
            "socket_head_cap_screws",
            "hex_socket_button_head_screws",
            "pan_head_machine_screws",
        )
    }

    cases: list[dict[str, Any]] = []

    # 24 source-backed, namespace-qualified exact mappings: eight per candidate family.
    exact_rows: list[dict[str, Any]] = []
    for family in pools:
        exact_rows.extend(evenly_spaced(pools[family], 8))
    for index, row in enumerate(exact_rows, 1):
        observation = source_case_common(row)
        cases.append(make_case(
            f"EXACT-{index:03d}",
            "namespaced_exact_id",
            "source_backed_observation",
            {
                "query": observation["reference"],
                "intent": "exact_identifier",
                "identifier": {"namespace": NAMESPACE, "value": observation["reference"]},
                "release_id": RELEASE_ID,
            },
            expected(
                "exact_mapping",
                "one",
                "abstain",
                ["candidate_record_unreviewed"],
                target=observation["target_key"],
            ),
            source_observation=observation,
        ))

    # 12 contract cases for broad family text. Three deliberately preserve an
    # unresolved family-boundary answer instead of fabricating taxonomy truth.
    broad_specs = [
        ("M4 screw", False),
        ("stainless M5 screw, 20 mm long", False),
        ("Allen screw M4", False),
        ("M4 socket head screw", False),
        ("M4 button head screw", False),
        ("M4 Phillips pan head screw", False),
        ("metric machine screw", False),
        ("black oxide socket screw", False),
        ("DIN 912 screw", False),
        ("low-profile socket screw M4", True),
        ("button head screw with flange", True),
        ("pan head screw with captive washer", True),
    ]
    for index, (query, unresolved) in enumerate(broad_specs, 1):
        reason = "family_boundary_review_pending" if unresolved else "family_not_configuration"
        cases.append(make_case(
            f"BROAD-{index:03d}",
            "broad_family_text",
            "contract_synthetic",
            {
                "query": query,
                "intent": "broad_family_discovery",
                "release_id": RELEASE_ID,
                "family_boundary_status": "unreviewed" if unresolved else "reviewed_alias_only",
            },
            expected(
                "clarification_required" if unresolved else "family_candidates",
                "many" if not unresolved else "not_evaluated",
                "abstain" if unresolved else "candidate_set",
                [reason],
                unresolved=unresolved,
                unresolved_note=(
                    "Mechanical review must decide whether this term denotes a separate family, a facet, or an excluded form."
                    if unresolved else None
                ),
            ),
        ))

    # 16 source-composed metric queries. The facts are observed, but the rows
    # and family predicates remain unreviewed, so the safe answer is a candidate
    # set with no unique engineering selection.
    constrained_rows: list[dict[str, Any]] = []
    family_counts = {
        "socket_head_cap_screws": 6,
        "hex_socket_button_head_screws": 5,
        "pan_head_machine_screws": 5,
    }
    exact_refs = {str(row["mcmaster_pn"]) for row in exact_rows}
    for family, count in family_counts.items():
        available = [row for row in pools[family] if str(row["mcmaster_pn"]) not in exact_refs]
        constrained_rows.extend(evenly_spaced(available, count))
    family_phrase = {
        "socket_head_cap_screws": "socket head cap screw",
        "hex_socket_button_head_screws": "hex socket button head screw",
        "pan_head_machine_screws": "pan head machine screw",
    }
    for index, row in enumerate(constrained_rows, 1):
        family = str(family_candidate(row))
        thread = str(row["thread_size"])
        pitch = str(row["thread_pitch"])
        length = str(row["length"])
        material = str(row.get("material") or "")
        query = f"{thread} x {pitch} x {length} {family_phrase[family]}"
        constraints: dict[str, Any] = {
            "thread_designation": [thread],
            "pitch": [{"value": pitch, "unit": "mm"}],
            "length": [{"supplied": length}],
            "family": [family],
        }
        if material:
            query += f", {material}"
            constraints["material_supplied"] = [material]
        observation = source_case_common(row)
        cases.append(make_case(
            f"METRIC-{index:03d}",
            "constrained_metric_input",
            "source_backed_composition",
            {
                "query": query,
                "intent": "constrained_discovery",
                "release_id": RELEASE_ID,
                "constraints": constraints,
            },
            expected(
                "constrained_candidates",
                "many",
                "candidate_set",
                ["candidate_contract_only", "mechanical_family_review_pending"],
            ),
            source_observation=observation,
        ))

    # 10 partial requests that must preserve facts and ask for refinement.
    partial_specs = [
        "M4",
        "stainless screw",
        "20 mm long fastener",
        "black oxide",
        "DIN 912",
        "button head",
        "Phillips drive",
        "socket screw alloy steel",
        "fine thread machine screw",
        "M5 x 16 mm",
    ]
    unresolved_partial = {"fine thread machine screw", "button head", "DIN 912"}
    for index, query in enumerate(partial_specs, 1):
        unresolved = query in unresolved_partial
        cases.append(make_case(
            f"PARTIAL-{index:03d}",
            "partial_input",
            "contract_synthetic",
            {
                "query": query,
                "intent": "partial_requirement",
                "release_id": RELEASE_ID,
                "taxonomy_status": "domain_review_needed" if unresolved else "bounded_parser_supported",
            },
            expected(
                "clarification_required",
                "not_evaluated",
                "abstain",
                ["insufficient_constraints"],
                unresolved=unresolved,
                unresolved_note=(
                    "The safe response is known, but the family/standard interpretation needs domain review."
                    if unresolved else None
                ),
            ),
        ))

    # 10 explicit structured-ledger conflicts. Query prose is preserved, while
    # composition is tested from deterministic typed constraints.
    conflicts = [
        ("M4 and M5 socket head screw", {"thread_designation": ["M4", "M5"]}, "conflicting_thread_diameter"),
        ("M4 x 0.7 and M4 x 0.8", {"pitch": [{"value": "0.7", "unit": "mm"}, {"value": "0.8", "unit": "mm"}]}, "conflicting_pitch"),
        ("M4 x 12 mm and 20 mm long", {"length": [{"value": "12", "unit": "mm"}, {"value": "20", "unit": "mm"}]}, "conflicting_length"),
        ("metric 1/4-20 screw", {"measurement_system": ["metric"], "thread_designation": ["1/4-20"]}, "measurement_system_conflict"),
        ("socket head and pan head screw", {"family": ["socket_head_cap_screws", "pan_head_machine_screws"]}, "conflicting_family"),
        ("Phillips and slotted drive only", {"drive": ["phillips", "slotted"]}, "conflicting_drive"),
        ("stainless and alloy steel base material", {"material": ["stainless_steel", "alloy_steel"]}, "conflicting_material"),
        ("M5 x 0.8 with 1 mm pitch", {"pitch": [{"value": "0.8", "unit": "mm"}, {"value": "1", "unit": "mm"}]}, "conflicting_pitch"),
        ("10 mm and 3/8 in exact length", {"length": [{"value": "10", "unit": "mm"}, {"value": "3/8", "unit": "in"}], "equality_mode": ["exact"]}, "conflicting_exact_length"),
        ("plain finish and zinc plated", {"finish": ["plain", "zinc_plated"]}, "conflicting_finish"),
    ]
    for index, (query, constraints, conflict_code) in enumerate(conflicts, 1):
        cases.append(make_case(
            f"CONFLICT-{index:03d}",
            "explicit_conflict",
            "contract_synthetic",
            {
                "query": query,
                "intent": "constrained_discovery",
                "release_id": RELEASE_ID,
                "constraints": constraints,
            },
            expected("conflict", "zero", "abstain", [conflict_code]),
        ))

    # 10 synthetic namespace/collision contracts. Legacy rows emulate the
    # current LIMIT 1 failure mode without asserting a real source collision.
    for index in range(1, 11):
        value = f"SYN-AMB-{index:03d}"
        same_namespace = index <= 5
        mappings = [
            {"namespace": "synthetic-a", "value": value, "state": "active", "release_id": RELEASE_ID, "target_key": f"syn-a-{index:03d}"},
            {"namespace": "synthetic-a" if same_namespace else "synthetic-b", "value": value, "state": "active", "release_id": RELEASE_ID, "target_key": f"syn-b-{index:03d}"},
        ]
        identifier = {"namespace": "synthetic-a", "value": value} if same_namespace else {"value": value}
        reason = "identifier_collision" if same_namespace else "namespace_required"
        cases.append(make_case(
            f"AMBIG-{index:03d}",
            "ambiguous_identifier",
            "contract_synthetic",
            {"query": value, "intent": "exact_identifier", "identifier": identifier, "release_id": RELEASE_ID},
            expected("ambiguous_identifier", "many", "abstain", [reason]),
            contract_fixture={"mappings": mappings, "legacy_rows": [{"reference_number": value}, {"reference_number": value}]},
        ))

    # 10 source exact mappings with observed critical import gaps.
    missing_candidates = sorted(
        (
            row
            for row in unique_by_reference.values()
            if family_candidate(row)
            and source_case_common(row)["observed_missing_import_fields"]
            and str(row["mcmaster_pn"]) not in exact_refs
        ),
        key=lambda row: str(row["mcmaster_pn"]),
    )
    for index, row in enumerate(evenly_spaced(missing_candidates, 10), 1):
        observation = source_case_common(row)
        cases.append(make_case(
            f"MISSING-{index:03d}",
            "missing_critical_facts",
            "source_backed_observation",
            {
                "query": observation["reference"],
                "intent": "exact_identifier",
                "identifier": {"namespace": NAMESPACE, "value": observation["reference"]},
                "release_id": RELEASE_ID,
            },
            expected(
                "exact_mapping",
                "one",
                "abstain",
                ["missing_critical_facts", "candidate_record_unreviewed"],
                target=observation["target_key"],
            ),
            source_observation=observation,
        ))

    # Six mappings that exist only in another synthetic release.
    for index in range(1, 7):
        value = f"SYN-OTHER-REL-{index:03d}"
        mapping = {"namespace": "synthetic-release", "value": value, "state": "active", "release_id": "candidate-fastener-poc-r1", "target_key": f"other-release-{index:03d}"}
        cases.append(make_case(
            f"OUTREL-{index:03d}",
            "outside_release",
            "contract_synthetic",
            {"query": value, "intent": "exact_identifier", "identifier": {"namespace": "synthetic-release", "value": value}, "release_id": RELEASE_ID},
            expected("not_in_release", "zero", "abstain", ["release_mismatch"]),
            contract_fixture={"mappings": [mapping], "legacy_rows": [{"reference_number": value}]},
        ))

    # Six category/family inputs intentionally outside the bounded screw release.
    unsupported = [
        ("AS568 O-ring", "o_ring"),
        ("6203 bearing", "rolling_element_bearing"),
        ("metric dowel pin", "pin"),
        ("spur gear module 1", "gear"),
        ("Belleville washer", "spring_washer"),
        ("threaded pipe fitting", "pipe_fitting"),
    ]
    for index, (query, family) in enumerate(unsupported, 1):
        cases.append(make_case(
            f"UNSUPPORTED-{index:03d}",
            "unsupported_family",
            "contract_synthetic",
            {"query": query, "intent": "broad_family_discovery", "requested_family": family, "release_id": RELEASE_ID},
            expected("unsupported_family", "zero", "abstain", ["unsupported_family"]),
        ))

    # Four withdrawn and four unavailable mappings. These are synthetic state
    # contracts; no source availability or withdrawal claim is made.
    for state in ("withdrawn", "unavailable"):
        for index in range(1, 5):
            value = f"SYN-{state.upper()}-{index:03d}"
            mapping = {"namespace": "synthetic-lifecycle", "value": value, "state": state, "release_id": RELEASE_ID, "target_key": f"{state}-{index:03d}"}
            cases.append(make_case(
                f"{state.upper()}-{index:03d}",
                state,
                "contract_synthetic",
                {"query": value, "intent": "exact_identifier", "identifier": {"namespace": "synthetic-lifecycle", "value": value}, "release_id": RELEASE_ID},
                expected(state, "zero", "abstain", [f"mapping_{state}"]),
                contract_fixture={"mappings": [mapping], "legacy_rows": [{"reference_number": value}]},
            ))

    # Eight injected service faults. They test fail-closed composition only and
    # do not claim a measured live-service failure rate.
    faults = [
        "edge_timeout",
        "database_timeout",
        "rate_limit_dependency_failure",
        "catalog_release_unavailable",
        "network_failure",
        "invalid_service_json",
        "dto_validation_failure",
        "unknown_server_failure",
    ]
    for index, fault in enumerate(faults, 1):
        cases.append(make_case(
            f"SERVICE-{index:03d}",
            "service_failure",
            "contract_synthetic",
            {"query": "M4 screw", "intent": "broad_family_discovery", "release_id": RELEASE_ID, "injected_service_failure": fault},
            expected("service_unavailable", "not_evaluated", "abstain", ["service_failure"]),
        ))

    if len(cases) != 120:
        raise RuntimeError(f"Expected 120 cases, built {len(cases)}")
    if len({case['id'] for case in cases}) != len(cases):
        raise RuntimeError("Duplicate case IDs")
    return cases


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--output",
        type=Path,
        default=OUTPUT,
        help="Output path; existing files are never overwritten.",
    )
    args = parser.parse_args()
    output_path = args.output if args.output.is_absolute() else ROOT / args.output
    rows = load_rows()
    cases = build_cases(rows)
    document = {
        "schema_version": "fastener-truth-benchmark-schema-v1",
        "corpus_version": "1.0.0",
        "frozen_at": "2026-08-09",
        "title": "Bounded POC fastener truth/composition benchmark",
        "scope": {
            "release_id": RELEASE_ID,
            "status": "candidate_contract_validation_only",
            "production_acceptance": False,
            "mechanical_approval": False,
            "public_claims_allowed": False,
            "supported_candidate_families": [
                "socket_head_cap_screws",
                "hex_socket_button_head_screws",
                "pan_head_machine_screws",
            ],
            "notes": [
                "Source-backed means observed in the permitted local technical packet; it does not mean mechanically reviewed or publishable.",
                "Contract-synthetic cases test state composition only and make no real availability, withdrawal, release, or source claim.",
                "No source key, raw private lineage, supplier offer, equivalence, suitability, or availability fact is included.",
            ],
        },
        "classification_schema": {
            "case_class": [
                "namespaced_exact_id",
                "broad_family_text",
                "constrained_metric_input",
                "partial_input",
                "explicit_conflict",
                "ambiguous_identifier",
                "missing_critical_facts",
                "outside_release",
                "unsupported_family",
                "withdrawn",
                "unavailable",
                "service_failure",
            ],
            "evidence_basis": ["source_backed_observation", "source_backed_composition", "contract_synthetic"],
            "response_state": [
                "exact_mapping",
                "family_candidates",
                "constrained_candidates",
                "clarification_required",
                "conflict",
                "ambiguous_identifier",
                "not_in_release",
                "unsupported_family",
                "withdrawn",
                "unavailable",
                "service_unavailable",
            ],
            "identity_cardinality": ["zero", "one", "many", "not_evaluated"],
            "selection_state": ["unique", "candidate_set", "abstain"],
            "answer_key_status": ["resolved_contract_or_observation", "unresolved_domain_review"],
        },
        "answer_key_policy": {
            "safe_default": "abstain",
            "false_unique_definition": "Actual unique identity or unique selection when the frozen expected axis is not unique.",
            "source_backed_limit": "Observed input/mapping composition only; no row is declared mechanically approved or selectable.",
            "unresolved_items": "Score only the required safe state; do not score an unapproved engineering family/configuration answer.",
        },
        "cases": cases,
    }
    output_path.parent.mkdir(parents=True, exist_ok=True)
    if output_path.exists():
        raise RuntimeError(f"Refusing to overwrite frozen fixture: {output_path}")
    output_path.write_text(json.dumps(document, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    digest = hashlib.sha256(output_path.read_bytes()).hexdigest()
    try:
        artifact = str(output_path.relative_to(ROOT))
    except ValueError:
        artifact = str(output_path)
    print(json.dumps({"artifact": artifact, "cases": len(cases), "sha256": digest}, sort_keys=True))


if __name__ == "__main__":
    main()
