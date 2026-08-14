import type { PocBundle } from './types';
import { validateBundle } from './validator';

export type PocRuntime =
  | { state: 'ready'; bundle: PocBundle }
  | { state: 'catalog_unavailable'; reason: 'invalid_synthetic_bundle' };

export function loadPocBundle(bundle: PocBundle): PocRuntime {
  try {
    return { state: 'ready', bundle: validateBundle(bundle) };
  } catch {
    return { state: 'catalog_unavailable', reason: 'invalid_synthetic_bundle' };
  }
}
