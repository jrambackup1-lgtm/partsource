#!/usr/bin/env python3
"""
Reusable CSV Data Anonymization Script
Usage:
  python anonymize_csv.py --src <path_to_scraped_products.csv> --dst <output_path.csv> [--threshold 80]

Description:
  1. Removes source URLs, listing URLs, and image links (url, listing_url, image).
  2. Drops columns with missingness >= threshold (default: 80%).
  3. Removes 'S-' supplier prefix from title column.
  4. Scrubs any remaining 'skdin' occurrences across all cells.
"""

import os
import sys
import csv
import re
import argparse

def anonymize_csv(src_path, dst_path, empty_threshold_pct=80.0):
    if not os.path.exists(src_path):
        print(f"Error: Source file not found: {src_path}")
        sys.exit(1)

    os.makedirs(os.path.dirname(os.path.abspath(dst_path)), exist_ok=True)

    with open(src_path, mode='r', encoding='utf-8', errors='ignore') as f:
        reader = csv.reader(f)
        header = next(reader, None)
        if not header:
            print("Error: Source CSV is empty.")
            sys.exit(1)
        rows = list(reader)

    total_rows = len(rows)
    cols_to_keep_indices = []
    cols_kept_names = []
    cols_dropped = []

    for idx, col in enumerate(header):
        if col in ('url', 'listing_url', 'image'):
            cols_dropped.append(f"{col} (source URL)")
            continue

        empty_cnt = sum(1 for r in rows if idx >= len(r) or r[idx].strip() in ('', '-'))
        empty_pct = (empty_cnt / total_rows) * 100 if total_rows > 0 else 100

        if empty_pct >= empty_threshold_pct:
            cols_dropped.append(f"{col} ({empty_pct:.1f}% empty)")
        else:
            cols_to_keep_indices.append(idx)
            cols_kept_names.append(col)

    cleaned_rows = []
    for row in rows:
        cleaned_row = []
        for idx in cols_to_keep_indices:
            col_name = header[idx]
            val = row[idx] if idx < len(row) else ''

            if col_name == 'title':
                val = re.sub(r'^S-(?=[0-9A-Z]{5,})', '', val)

            if 'skdin' in val.lower():
                val = re.sub(r'skdin', '', val, flags=re.IGNORECASE)

            cleaned_row.append(val)
        cleaned_rows.append(cleaned_row)

    with open(dst_path, mode='w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(cols_kept_names)
        writer.writerows(cleaned_rows)

    print(f"Anonymization Complete!")
    print(f"  Input:  {src_path} ({total_rows} rows, {len(header)} cols)")
    print(f"  Output: {dst_path} ({len(cleaned_rows)} rows, {len(cols_kept_names)} cols)")
    print(f"  Dropped {len(cols_dropped)} columns.")

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Anonymize scraped CSV data.")
    parser.add_argument('--src', required=True, help="Path to input scraped CSV")
    parser.add_argument('--dst', required=True, help="Path to output cleaned CSV")
    parser.add_argument('--threshold', type=float, default=80.0, help="Column empty threshold percentage (default: 80)")
    args = parser.parse_args()

    anonymize_csv(args.src, args.dst, args.threshold)
