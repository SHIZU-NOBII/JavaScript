// DEBOUNCING PATTERN - Enhanced Implementation
// Debouncing delays function execution until after a specified time has passed since the last call

console.log("=== DEBOUNCING PATTERN - ENHANCED EXAMPLES ===\n");

// ============= UTILITY FUNCTIONS =============

// Enhanced debounce function with additional features
function debounce(func, delay, immediate = false) {
  let timeoutId;
  let lastCallTime;
  let callCount = 0;

  const debouncedFunction = function (...args) {
    const context = this;
    callCount++;
    lastCallTime = Date.now();

    // Clear existing timeout
    clearTimeout(timeoutId);

    // Immediate execution on first call if specified
    if (immediate && !timeoutId) {
      func.apply(context, args);
    }

    // Set new timeout
    timeoutId = setTimeout(() => {
      if (!immediate) {
        func.apply(context, args);
      }
      timeoutId = null;
    }, delay);
  };

  // Add utility methods to the debounced function
  debouncedFunction.cancel = function () {
    clearTimeout(timeoutId);
    timeoutId = null;
  };

  debouncedFunction.flush = function () {
    if (timeoutId) {
      clearTimeout(timeoutId);
      func.apply(this, arguments);
      timeoutId = null;
    }
  };

  debouncedFunction.getCallCount = function () {
    return callCount;
  };

  return debouncedFunction;
}

// Throttle function for comparison
function throttle(func, delay) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func.apply(this, args);
    }
  };
}

// Logging utility
function logActivity(message, type = "info") {
  const timestamp = new Date().toLocaleTimeString();
  const logElement = document.getElementById("activityLog");
  const logMessage = `[${timestamp}] ${message}\n`;

  if (logElement) {
    logElement.textContent += logMessage;
    logElement.scrollTop = logElement.scrollHeight;
  }

  console.log(
    `%c${logMessage}`,
    `color: ${type === "success" ? "green" : type === "error" ? "red" : "blue"}`
  );
}

// ============= SEARCH FUNCTIONALITY =============

let searchCount = 0;
let keystrokeCount = 0;

// Simulate API call
async function performSearch(query) {
  searchCount++;
  updateCounter("searchCount", searchCount);

  logActivity(`🔍 Performing search for: "${query}"`, "info");

  // Simulate API delay
  const resultsElement = document.getElementById("searchResults");
  if (resultsElement) {
    resultsElement.innerHTML = `<div style="color: #666;">Searching for "${query}"...</div>`;
  }

  setTimeout(() => {
    const mockResults = [
      `Result 1 for "${query}"`,
      `Result 2 for "${query}"`,
      `Result 3 for "${query}"`,
    ];

    if (resultsElement) {
      resultsElement.innerHTML = `
        <strong>Search Results for "${query}":</strong><br>
        ${mockResults.map((result) => `• ${result}`).join("<br>")}
      `;
    }

    logActivity(`✅ Search completed for: "${query}"`, "success");
  }, 300);
}

// Debounced search handler
const debouncedSearch = debounce((event) => {
  const query = event.target.value.trim();
  if (query.length > 0) {
    performSearch(query);
  } else {
    const resultsElement = document.getElementById("searchResults");
    if (resultsElement) {
      resultsElement.innerHTML = "Start typing to see search results...";
    }
  }
}, 500);

// ============= BUTTON FUNCTIONALITY =============

let saveOperations = 0;
let buttonClicks = 0;

// Simulate save operation
function saveData() {
  saveOperations++;
  updateCounter("saveCount", saveOperations);
  logActivity(
    `💾 Data saved successfully! (Operation #${saveOperations})`,
    "success"
  );
}

// Debounced save handler
const debouncedSave = debounce(() => {
  saveData();
}, 1000);

// ============= COMPARISON FUNCTIONALITY =============

let normalCallCount = 0;
let debouncedCallCount = 0;

// Normal function (no debouncing)
function normalFunction() {
  normalCallCount++;
  updateCounter("normalCalls", normalCallCount);
  logActivity(`📞 Normal function called (${normalCallCount} times)`, "info");
}

// Debounced function
const comparisonDebouncedFunction = debounce(() => {
  debouncedCallCount++;
  updateCounter("debouncedCalls", debouncedCallCount);
  logActivity(
    `🎯 Debounced function called (${debouncedCallCount} times)`,
    "success"
  );
}, 300);

// ============= UTILITY FUNCTIONS =============

function updateCounter(elementId, value) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = value;
  }
}

function clearActivityLog() {
  const logElement = document.getElementById("activityLog");
  if (logElement) {
    logElement.textContent = "Activity log cleared...\n";
  }
  logActivity("🧹 Activity log cleared", "info");
}

// ============= EVENT LISTENERS =============

document.addEventListener("DOMContentLoaded", function () {
  logActivity("🚀 Debouncing examples initialized", "success");

  // Search input
  const searchInput = document.getElementById("search");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      keystrokeCount++;
      updateCounter("keystrokes", keystrokeCount);
      debouncedSearch(e);
    });
  }

  // Save button
  const saveBtn = document.getElementById("saveBtn");
  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      buttonClicks++;
      updateCounter("clickCount", buttonClicks);
      logActivity(`🖱️ Save button clicked (${buttonClicks} times)`, "info");
      debouncedSave();
    });
  }

  // Normal button
  const normalBtn = document.getElementById("normalBtn");
  if (normalBtn) {
    normalBtn.addEventListener("click", () => {
      logActivity("🖱️ Normal button clicked", "info");
    });
  }

  // Clear log button
  const clearBtn = document.getElementById("clearLog");
  if (clearBtn) {
    clearBtn.addEventListener("click", clearActivityLog);
  }

  // Comparison inputs
  const normalInput = document.getElementById("normalInput");
  if (normalInput) {
    normalInput.addEventListener("input", normalFunction);
  }

  const debouncedInput = document.getElementById("debouncedInput");
  if (debouncedInput) {
    debouncedInput.addEventListener("input", comparisonDebouncedFunction);
  }
});

// ============= ADVANCED DEBOUNCING EXAMPLES =============

// Example 1: Debounce with immediate execution
const immediateDebounce = debounce(
  (text) => {
    logActivity(`⚡ Immediate debounce executed: ${text}`, "success");
  },
  1000,
  true
);

// Example 2: Debounce with cancel functionality
const cancellableDebounce = debounce(() => {
  logActivity("🚫 This should not execute if cancelled", "error");
}, 2000);

// Example 3: Window resize debouncing
const handleResize = debounce(() => {
  logActivity(
    `📐 Window resized to: ${window.innerWidth}x${window.innerHeight}`,
    "info"
  );
}, 250);

window.addEventListener("resize", handleResize);

// ============= CONSOLE EXAMPLES =============

console.log("🎯 Advanced Debouncing Examples:");
console.log("1. Try typing in the search box");
console.log("2. Click the save button multiple times quickly");
console.log("3. Compare normal vs debounced inputs");
console.log("4. Resize the window to see debounced resize handler");

// Demonstrate programmatic usage
setTimeout(() => {
  console.log("\n🔧 Programmatic debounce examples:");

  // Test immediate debounce
  immediateDebounce("First call");
  immediateDebounce("Second call");

  // Test cancellation
  cancellableDebounce();
  setTimeout(() => {
    cancellableDebounce.cancel();
    logActivity("🚫 Debounced function cancelled", "error");
  }, 500);
}, 2000);

// Export for potential module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = { debounce, throttle };
}
