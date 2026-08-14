import { compileProxyRequest } from './proxy-poc.mjs';
import { FIXTURE_NAMES, makeFixture } from './fixtures.mjs';

const select = document.querySelector('[data-fixture-select]');
const clueInput = document.querySelector('[data-clue-input]');
const currentState = document.querySelector('[data-current-state]');
const stateTitle = document.querySelector('[data-state-title]');
const stateCode = document.querySelector('[data-state-code]');
const resultRoot = document.querySelector('[data-result]');

let generation = 0;
let currentFixtureName = 'candidate';

function element(tag, attributes = {}, text = null) {
  const node = document.createElement(tag);
  for (const [name, value] of Object.entries(attributes)) node.setAttribute(name, value);
  if (text !== null) node.textContent = text;
  return node;
}

function clearForRequest(requestKey, rawInput) {
  currentState.dataset.requestKey = requestKey;
  currentState.dataset.phase = 'loading';
  currentState.dataset.outcome = 'loading';
  currentState.className = '';
  stateTitle.textContent = 'Processing current clue';
  stateCode.textContent = 'loading';
  resultRoot.replaceChildren(
    element('pre', { 'data-preserved-input': '' }, rawInput),
  );
}

function renderLedger(ledger) {
  const container = element('div', { class: 'ledger', 'data-ledger': '' });
  for (const fact of ledger) {
    const row = element('div', {
      class: 'claim',
      'data-claim': '',
      'data-field': fact.field,
      'data-fact-state': fact.state,
      'data-origin': fact.origin,
      'data-rule-version': fact.ruleVersion,
    });
    row.append(
      element('strong', {}, fact.field),
      element('span', { class: 'muted' }, fact.state),
      element('span', { class: 'muted' }, fact.origin),
      element('span', {}, fact.value ?? 'not supplied'),
    );
    container.append(row);
  }
  return container;
}

function render(result, requestKey) {
  if (currentState.dataset.requestKey !== requestKey) return;

  currentState.dataset.phase = result.kind === 'blocked' ? 'blocked' : 'candidate';
  currentState.dataset.outcome = result.kind;
  currentState.className = result.kind === 'blocked' ? 'blocked' : 'candidate';
  stateTitle.textContent = result.kind === 'blocked' ? 'Blocked' : 'Synthetic candidate review';
  stateCode.textContent = result.kind === 'blocked' ? result.block.code : result.selectionState;

  const preserved = element('pre', { 'data-preserved-input': '' }, result.suppliedRequest.rawInput);
  const ledger = renderLedger(result.ledger);

  if (result.kind === 'blocked') {
    const blockedState = element('section', {
      'data-blocked-state': '',
      'data-block-code': result.block.code,
    });
    blockedState.append(
      element('h2', {}, 'No handoff'),
      element('p', { 'data-block-reason': '' }, result.block.reason),
      element('p', {
        'data-next-review-action': '',
        'data-action-code': result.block.nextAction.code,
      }, result.block.nextAction.label),
    );
    resultRoot.replaceChildren(preserved, blockedState, ledger);
    return;
  }

  const packet = element('section', {
    'data-candidate-state': '',
    'data-selection-state': result.selectionState,
    'data-handoff-state': result.handoffState,
  });
  packet.append(
    element('h2', {}, 'Synthetic observation for review'),
    element('p', { 'data-packet-disclaimer': '' }, result.packet.disclaimer),
    element('p', { 'data-observation-count': '' }, `Observation count: ${result.packet.observationCount}`),
  );
  resultRoot.replaceChildren(preserved, packet, ledger);
}

function begin(name, rawOverride = null) {
  const ticket = ++generation;
  const requestKey = `request-${ticket}`;
  currentFixtureName = name;
  const fixture = makeFixture(name);
  if (rawOverride !== null) fixture.request.rawInput = rawOverride;
  clueInput.value = fixture.request.rawInput;
  clearForRequest(requestKey, fixture.request.rawInput);

  window.setTimeout(() => {
    if (ticket !== generation) return;
    const result = compileProxyRequest(fixture.request, fixture.catalog);
    render(result, requestKey);
  }, fixture.delayMs);
}

for (const name of FIXTURE_NAMES) {
  select.append(element('option', { value: name }, name));
}

select.addEventListener('change', () => {
  const name = select.value;
  history.replaceState({ fixture: name }, '', `#fixture=${encodeURIComponent(name)}`);
  begin(name);
});

clueInput.addEventListener('input', () => {
  begin(currentFixtureName, clueInput.value);
});

window.addEventListener('popstate', () => {
  const name = new URLSearchParams(location.hash.slice(1)).get('fixture');
  if (FIXTURE_NAMES.includes(name)) {
    select.value = name;
    begin(name);
  }
});

const initialName = new URLSearchParams(location.hash.slice(1)).get('fixture');
if (FIXTURE_NAMES.includes(initialName)) {
  select.value = initialName;
  currentFixtureName = initialName;
}
begin(currentFixtureName);
