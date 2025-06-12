// DOM Elements
const display = document.getElementById("display");
const buttons = document.querySelectorAll(".btn");
const clearBtn = document.getElementById("clear");
const equalBtn = document.getElementById("equal");
const backspaceBtn = document.getElementById("backspace");
const historyList = document.getElementById("history");
const toggleHistoryBtn = document.getElementById("toggle-history");
const historySection = document.getElementById("history-section");
const clearHistoryBtn = document.getElementById("clear-history");

// State variables
let currentInput = "";
let history = [];

// Update the calculator display with current input
function updateDisplay() {
  display.textContent = currentInput || "0";
}

// Add a calculation to the history
function addToHistory(expression, result) {
  history.unshift(`${expression} = ${result}`);
  if (history.length > 10) history.pop(); // Keep only last 10 calculations
  renderHistory();
}

// Render the calculation history in the UI
function renderHistory() {
  historyList.innerHTML = "";
  history.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    historyList.appendChild(li);
  });
}

// Safely evaluate mathematical expressions
function safeEval(expr) {
  // Replace ^ with ** for exponentiation
  expr = expr.replace(/\^/g, "**");
  // Replace % with /100 for percentage
  expr = expr.replace(/(\d+(?:\.\d+)?)%/g, "($1/100)");
  try {
    // eslint-disable-next-line no-eval
    let result = eval(expr);
    if (typeof result === "number" && !isNaN(result)) {
      return result;
    } else {
      return "Error";
    }
  } catch {
    return "Error";
  }
}

// Add click event listeners to all calculator buttons
buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const value = btn.getAttribute("data-value");
    if (btn.classList.contains("operator")) {
      // Only add operator if there's input and it doesn't end with an operator
      if (currentInput && !/[+\-*/%^.]$/.test(currentInput)) {
        currentInput += value;
      }
    } else if (btn.classList.contains("equal")) {
      // Calculate result when equals is pressed
      if (currentInput) {
        const result = safeEval(currentInput);
        addToHistory(currentInput, result);
        currentInput = result.toString();
      }
    } else if (btn.classList.contains("clear")) {
      // Clear the current input
      currentInput = "";
    } else if (btn.classList.contains("backspace")) {
      // Remove last character
      currentInput = currentInput.slice(0, -1);
    } else {
      // Add number or decimal point
      currentInput += value;
    }
    updateDisplay();
  });
});

// Add keyboard support for calculator operations
window.addEventListener("keydown", (e) => {
  if ((e.key >= "0" && e.key <= "9") || e.key === ".") {
    // Handle number keys and decimal point
    currentInput += e.key;
  } else if (["+", "-", "*", "/", "%", "^"].includes(e.key)) {
    // Handle operator keys
    if (currentInput && !/[+\-*/%^.]$/.test(currentInput)) {
      currentInput += e.key;
    }
  } else if (e.key === "Enter" || e.key === "=") {
    // Handle equals/enter key
    if (currentInput) {
      const result = safeEval(currentInput);
      addToHistory(currentInput, result);
      currentInput = result.toString();
    }
  } else if (e.key === "Backspace") {
    // Handle backspace key
    currentInput = currentInput.slice(0, -1);
  } else if (e.key.toLowerCase() === "c") {
    // Handle clear key
    currentInput = "";
  }
  updateDisplay();
});

// Toggle history section visibility
toggleHistoryBtn.addEventListener("click", () => {
  if (historySection.style.display === "none") {
    historySection.style.display = "block";
    toggleHistoryBtn.textContent = "Hide History";
  } else {
    historySection.style.display = "none";
    toggleHistoryBtn.textContent = "Show History";
  }
});

// Clear calculation history
clearHistoryBtn.addEventListener("click", () => {
  history = [];
  renderHistory();
});

// Initialize display and history
updateDisplay();
renderHistory();
