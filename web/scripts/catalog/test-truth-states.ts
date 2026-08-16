import assert from 'node:assert/strict';
import {
  buildSyntheticCatalogPackageInput,
  CatalogPackageValidationError,
  parseCatalogPackage,
  type FactState,
} from '../../src/catalog/index';

const fixture = (): any => structuredClone(buildSyntheticCatalogPackageInput());
const firstFinish = (input: any): any => input.configurationRevisions[0].facts.find((fact: any) => fact.factId === 'finish');

const examples: Record<FactState, any> = {
  known: { state: 'known', value: 'passivated' },
  not_supplied: { state: 'not_supplied', reason: 'Synthetic source omitted this value.' },
  unknown: { state: 'unknown', reason: 'Synthetic fixture intentionally leaves truth unresolved.' },
  not_applicable: { state: 'not_applicable', reason: 'Synthetic state-boundary exercise.' },
  conflicting: { state: 'conflicting', values: ['passivated', 'black_oxide'], reason: 'Synthetic sources disagree.' },
};

for (const [state, value] of Object.entries(examples)) {
  const input = fixture();
  firstFinish(input).value = value;
  const parsed = parseCatalogPackage(input);
  const parsedValue = parsed.configurationRevisions[0].facts.find(fact => fact.factId === 'finish')?.value;
  assert.equal(parsedValue?.state, state, `${state} must survive parsing without coercion`);
}

const rejects = (value: any, expected: RegExp): void => {
  const input = fixture();
  firstFinish(input).value = value;
  assert.throws(
    () => parseCatalogPackage(input),
    (error: unknown) => error instanceof CatalogPackageValidationError && expected.test(error.message),
  );
};

rejects({ state: 'known' }, /missing field.*value/);
rejects({ state: 'known', value: null }, /expected finite number/);
rejects({ state: 'unknown', reason: 'unresolved', value: 'passivated' }, /unknown field.*value/);
rejects({ state: 'conflicting', values: ['passivated'], reason: 'only one candidate' }, /at least 2 item/);
rejects({ state: 'conflicting', values: ['passivated', 'passivated'], reason: 'duplicate candidates' }, /must be distinct/);
rejects({ state: 'conflicting', values: ['passivated', 'zinc'], reason: 'unsupported candidate' }, /outside fact definition/);
rejects({ state: 'assumed', reason: 'guessing is forbidden' }, /expected one of/);

console.log('catalog truth-state tests: ok');
