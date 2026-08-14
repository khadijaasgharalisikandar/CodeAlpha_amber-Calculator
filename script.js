// ==========================
// Amber Calculator — logic
// ==========================

const expressionEl = document.getElementById('expression');
const resultEl = document.getElementById('result');

let state = {
  firstOperand: null,   // number locked in before an operator
  operator: null,       // '+', '−', '×', '÷'
  secondOperand: null,  // string currently being typed
  justEvaluated: false  // true right after "=" was pressed
};

function formatNumber(n){
  if (n === null || n === undefined || n === '') return '0';
  if (typeof n === 'string') return n;
  if (!isFinite(n)) return 'Error';
  let s = parseFloat(n.toPrecision(12)).toString();
  if (s.length > 14) {
    s = Number(n).toExponential(6);
  }
  return s;
}

function currentDisplayValue(){
  if (state.secondOperand !== null) return state.secondOperand;
  if (state.firstOperand !== null) return formatNumber(state.firstOperand);
  return '0';
}

function render(){
  resultEl.textContent = currentDisplayValue();

  let expr = '';
  if (state.firstOperand !== null) expr += formatNumber(state.firstOperand);
  if (state.operator) expr += ' ' + state.operator + ' ';
  if (state.operator && state.secondOperand !== null) expr += state.secondOperand;
  expressionEl.textContent = expr || '\u00A0';
}

function inputDigit(d){
  if (state.justEvaluated){
    state = { firstOperand: null, operator: null, secondOperand: null, justEvaluated: false };
  }
  if (state.secondOperand === null) state.secondOperand = '';
  if (state.secondOperand === '0') state.secondOperand = '';
  state.secondOperand += d;
  render();
}

function inputDecimal(){
  if (state.justEvaluated){
    state = { firstOperand: null, operator: null, secondOperand: null, justEvaluated: false };
  }
  if (state.secondOperand === null) state.secondOperand = '0';
  if (!state.secondOperand.includes('.')) state.secondOperand += '.';
  render();
}

function chooseOperator(op){
  if (state.secondOperand === null && state.firstOperand === null) return;

  if (state.operator && state.secondOperand !== null){
    // chain: evaluate what we have so far, keep going
    evaluate(false);
  } else if (state.secondOperand !== null){
    state.firstOperand = parseFloat(state.secondOperand);
  }

  state.operator = op;
  state.secondOperand = null;
  state.justEvaluated = false;
  render();
}

function compute(a, op, b){
  switch(op){
    case '+': return a + b;
    case '−': return a - b;
    case '×': return a * b;
    case '÷': return b === 0 ? NaN : a / b;
    default: return b;
  }
}

function evaluate(finalPress){
  if (state.operator === null || state.secondOperand === null){
    if (finalPress) state.justEvaluated = true;
    return;
  }
  const a = state.firstOperand;
  const b = parseFloat(state.secondOperand);
  const r = compute(a, state.operator, b);
  state.firstOperand = r;
  state.secondOperand = null;
  if (finalPress){
    state.operator = null;
    state.justEvaluated = true;
  }
  render();
}

function clearAll(){
  state = { firstOperand: null, operator: null, secondOperand: null, justEvaluated: false };
  render();
}

function backspace(){
  if (state.justEvaluated) return;
  if (state.secondOperand !== null && state.secondOperand.length > 0){
    state.secondOperand = state.secondOperand.slice(0, -1);
    if (state.secondOperand === '' || state.secondOperand === '-') state.secondOperand = null;
  } else if (state.operator && state.secondOperand === null){
    state.operator = null;
  } else if (state.firstOperand !== null){
    state.firstOperand = null;
  }
  render();
}

function toggleSign(){
  if (state.secondOperand !== null){
    state.secondOperand = state.secondOperand.startsWith('-')
      ? state.secondOperand.slice(1)
      : '-' + state.secondOperand;
  } else if (state.firstOperand !== null){
    state.firstOperand = -state.firstOperand;
  }
  render();
}

// ---- Button wiring ----
document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', () => {
    flash(btn);
    const action = btn.dataset.action;
    if (action === 'num') inputDigit(btn.dataset.num);
    else if (action === 'decimal') inputDecimal();
    else if (action === 'op') chooseOperator(btn.dataset.op);
    else if (action === 'equals') evaluate(true);
    else if (action === 'clear') clearAll();
    else if (action === 'backspace') backspace();
    else if (action === 'sign') toggleSign();
  });
});

function flash(btn){
  btn.classList.add('pressed');
  setTimeout(() => btn.classList.remove('pressed'), 90);
}

function findButton(selectorFn){
  return Array.from(document.querySelectorAll('button')).find(selectorFn);
}

// ---- Keyboard support ----
window.addEventListener('keydown', (e) => {
  const key = e.key;
  if (key >= '0' && key <= '9'){
    inputDigit(key);
    flash(findButton(b => b.dataset.action === 'num' && b.dataset.num === key));
  } else if (key === '.'){
    inputDecimal();
    flash(findButton(b => b.dataset.action === 'decimal'));
  } else if (['+','-','*','/'].includes(key)){
    const map = { '+': '+', '-': '−', '*': '×', '/': '÷' };
    const op = map[key];
    chooseOperator(op);
    flash(findButton(b => b.dataset.action === 'op' && b.dataset.op === op));
  } else if (key === 'Enter' || key === '='){
    e.preventDefault();
    evaluate(true);
    flash(findButton(b => b.dataset.action === 'equals'));
  } else if (key === 'Escape'){
    clearAll();
    flash(findButton(b => b.dataset.action === 'clear'));
  } else if (key === 'Backspace'){
    backspace();
    flash(findButton(b => b.dataset.action === 'backspace'));
  }
});

render();
