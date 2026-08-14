# Amber Calculator

A retro, LED-inspired calculator built with vanilla HTML, CSS, and JavaScript — no frameworks, no dependencies.

![status](https://img.shields.io/badge/status-complete-brightgreen)

## Features

- All core arithmetic operations: `+`, `−`, `×`, `÷`
- Chained operations (e.g. `5 + 3 + 2 =`)
- Real-time expression + result display
- Clear (`AC`), backspace (`⌫`), and sign toggle (`±`)
- Full keyboard support — digits, operators, `Enter` to evaluate, `Esc` to clear, `Backspace` to delete
- Divide-by-zero handled gracefully (shows `Error` instead of crashing)
- Responsive layout, visible keyboard focus states, and `prefers-reduced-motion` support

## Project structure

```
amber-calculator/
├── index.html   → page markup / layout
├── style.css    → visual design (colors, layout, animations)
├── script.js    → calculator logic and event handling
└── README.md
```

## Run it

No build step needed. Just open `index.html` in a browser, or serve the folder with any static server:

```bash
npx serve .
```

## How the logic works

The calculator keeps a single `state` object:

```js
state = {
  firstOperand: null,   // number already locked in
  operator: null,       // pending +, −, ×, ÷
  secondOperand: null,  // string currently being typed
  justEvaluated: false  // true right after "="
}
```

- Digits/decimal always type into `secondOperand` (kept as a string so `"7."` and leading zeros behave correctly).
- Pressing an operator locks the typed value into `firstOperand`, stores the operator, and clears `secondOperand` — this is what allows chained operations like `5 + 3 + 2 =`.
- `evaluate()` runs the actual math via a `compute(a, op, b)` switch statement.
- `render()` is the single source of truth for the DOM — every action calls it, which is what gives the live, real-time display.

## License

Free to use and modify.
