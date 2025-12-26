// THROTTLING PATTERN - Enhanced Implementation
// Throttling ensures a function is called at most once in a specified time period

console.log("=== THROTTLING PATTERN - ENHANCED EXAMPLES ===\n");

// ============= UTILITY FUNCTIONS =============

// Enhanced throttle function with additional features
function throttle(func, delay, options = {}) {
  let lastCall = 0;
  let timeoutId = null;
  let callCount = 0;
  const { leading = true, trailing = true } = options;

  const throttledFunction = function (...args) {
    const context = this;
    const now = Date.now();
    callCount++;

    // First call handling
    if (lastCall === 0 && !leading) {
      lastCall = now;
    }

    const remaining = delay - (now - lastCall);

    if (remaining <= 0 || remaining > delay) {
      // Execute immediately
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      lastCall = now;
      func.apply(context, args);
    } else if (!timeoutId && trailing) {
      // Schedule trailing execution
      timeoutId = setTimeout(() => {
        lastCall = leading === false ? 0 : Date.now();
        timeoutId = null;
        func.apply(context, args);
      }, remaining);
    }
  };

  // Add utility methods
  throttledFunction.cancel = function () {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    lastCall = 0;
  };

  throttledFunction.flush = function () {
    if (timeoutId) {
      clearTimeout(timeoutId);
      lastCall = Date.now();
      timeoutId = null;
      func.apply(this, arguments);
    }
  };

  throttledFunction.getCallCount = function () {
    return callCount;
  };

  return throttledFunction;
}

// Simple throttle for basic use cases
function simpleThrottle(func, delay) {
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
  const colors = {
    info: "#00ff41",
    success: "#00ff00",
    warning: "#ffff00",
    error: "#ff4444",
  };

  const logMessage = `[${timestamp}] ${message}\n`;

  if (logElement) {
    const coloredMessage = `<span style="color: ${colors[type]}">${logMessage}</span>`;
    logElement.innerHTML += coloredMessage;
    logElement.scrollTop = logElement.scrollHeight;
  }

  console.log(`%c${logMessage}`, `color: ${colors[type]}`);
}

// ============= COUNTER UTILITIES =============

function updateCounter(elementId, value) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = value;
  }
}

function clearAllCounters() {
  const counters = [
    "normalScrollCount",
    "throttledScrollCount",
    "scrollPosition",
    "normalClickCount",
    "throttledClickCount",
    "apiCallCount",
    "mouseEventCount",
    "throttledMouseCount",
    "progressUpdates",
  ];

  counters.forEach((id) => updateCounter(id, 0));

  // Reset progress bar
  const progressFill = document.getElementById("progressFill");
  if (progressFill) {
    progressFill.style.width = "0%";
  }
  updateCounter("progressPercent", "0%");

  logActivity("🧹 All counters cleared", "warning");
}

// ============= SCROLL FUNCTIONALITY =============

let normalScrollCount = 0;
let throttledScrollCount = 0;

// Normal scroll handler
function handleNormalScroll(event) {
  normalScrollCount++;
  updateCounter("normalScrollCount", normalScrollCount);

  const scrollTop = event.target.scrollTop;
  updateCounter("scrollPosition", Math.round(scrollTop));
}

// Throttled scroll handler
const handleThrottledScroll = throttle((event) => {
  throttledScrollCount++;
  updateCounter("throttledScrollCount", throttledScrollCount);
  logActivity(
    `📜 Throttled scroll event: position ${Math.round(event.target.scrollTop)}`,
    "info"
  );
}, 100);

// ============= BUTTON CLICK FUNCTIONALITY =============

let normalClickCount = 0;
let throttledClickCount = 0;
let apiCallCount = 0;

// Normal button handler
function handleNormalClick() {
  normalClickCount++;
  updateCounter("normalClickCount", normalClickCount);
  logActivity(`🖱️ Normal button clicked (${normalClickCount} times)`, "info");
}

// Throttled button handler
const handleThrottledClick = throttle(() => {
  throttledClickCount++;
  updateCounter("throttledClickCount", throttledClickCount);
  logActivity(
    `⚡ Throttled button clicked (${throttledClickCount} times)`,
    "success"
  );
}, 500);

// API call simulation
const handleApiCall = throttle(() => {
  apiCallCount++;
  updateCounter("apiCallCount", apiCallCount);
  logActivity(`🌐 API call made (${apiCallCount} total calls)`, "warning");

  // Simulate API response
  setTimeout(() => {
    logActivity(
      `✅ API call ${apiCallCount} completed successfully`,
      "success"
    );
  }, 200);
}, 1000);

// ============= MOUSE MOVEMENT FUNCTIONALITY =============

let mouseEventCount = 0;
let throttledMouseCount = 0;

// Normal mouse handler
function handleMouseMove(event) {
  mouseEventCount++;
  updateCounter("mouseEventCount", mouseEventCount);
}

// Throttled mouse handler
const handleThrottledMouseMove = throttle((event) => {
  throttledMouseCount++;
  updateCounter("throttledMouseCount", throttledMouseCount);

  const rect = event.currentTarget.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const mouseDot = document.getElementById("mouseDot");
  if (mouseDot) {
    mouseDot.style.left = x - 6 + "px";
    mouseDot.style.top = y - 6 + "px";
  }

  logActivity(
    `🖱️ Mouse position: (${Math.round(x)}, ${Math.round(y)})`,
    "info"
  );
}, 50);

// ============= PROGRESS BAR FUNCTIONALITY =============

let progressValue = 0;
let progressUpdates = 0;
let progressInterval = null;
let isPaused = false;

// Progress update handler
const updateProgress = throttle(() => {
  progressUpdates++;
  updateCounter("progressUpdates", progressUpdates);

  const progressFill = document.getElementById("progressFill");
  if (progressFill) {
    progressFill.style.width = progressValue + "%";
  }
  updateCounter("progressPercent", progressValue + "%");

  logActivity(`📊 Progress updated: ${progressValue}%`, "info");
}, 100);

function startProgress() {
  if (progressInterval) return;

  isPaused = false;
  logActivity("🚀 Upload started", "success");

  progressInterval = setInterval(() => {
    if (!isPaused && progressValue < 100) {
      progressValue += Math.random() * 3; // Random progress increment
      if (progressValue > 100) progressValue = 100;

      updateProgress();

      if (progressValue >= 100) {
        clearInterval(progressInterval);
        progressInterval = null;
        logActivity("✅ Upload completed successfully!", "success");
      }
    }
  }, 50);
}

function pauseProgress() {
  isPaused = !isPaused;
  logActivity(isPaused ? "⏸️ Upload paused" : "▶️ Upload resumed", "warning");
}

function resetProgress() {
  if (progressInterval) {
    clearInterval(progressInterval);
    progressInterval = null;
  }

  progressValue = 0;
  isPaused = false;
  updateProgress();
  logActivity("🔄 Progress reset", "warning");
}

// ============= WINDOW RESIZE FUNCTIONALITY =============

let resizeCount = 0;

const handleWindowResize = throttle(() => {
  resizeCount++;
  logActivity(
    `📐 Window resized: ${window.innerWidth}x${window.innerHeight} (${resizeCount} times)`,
    "info"
  );
}, 250);

// ============= EVENT LISTENERS =============

document.addEventListener("DOMContentLoaded", function () {
  logActivity("🚀 Throttling examples initialized", "success");

  // Scroll area
  const scrollArea = document.getElementById("scrollArea");
  if (scrollArea) {
    scrollArea.addEventListener("scroll", handleNormalScroll);
    scrollArea.addEventListener("scroll", handleThrottledScroll);
  }

  // Button clicks
  const normalBtn = document.getElementById("normalBtn");
  if (normalBtn) {
    normalBtn.addEventListener("click", handleNormalClick);
  }

  const throttledBtn = document.getElementById("throttledBtn");
  if (throttledBtn) {
    throttledBtn.addEventListener("click", handleThrottledClick);
  }

  const apiBtn = document.getElementById("apiBtn");
  if (apiBtn) {
    apiBtn.addEventListener("click", handleApiCall);
  }

  const clearBtn = document.getElementById("clearBtn");
  if (clearBtn) {
    clearBtn.addEventListener("click", clearAllCounters);
  }

  // Mouse tracking
  const mouseTracker = document.getElementById("mouseTracker");
  if (mouseTracker) {
    mouseTracker.addEventListener("mousemove", handleMouseMove);
    mouseTracker.addEventListener("mousemove", handleThrottledMouseMove);
  }

  // Progress bar controls
  const startBtn = document.getElementById("startProgress");
  if (startBtn) {
    startBtn.addEventListener("click", startProgress);
  }

  const pauseBtn = document.getElementById("pauseProgress");
  if (pauseBtn) {
    pauseBtn.addEventListener("click", pauseProgress);
  }

  const resetBtn = document.getElementById("resetProgress");
  if (resetBtn) {
    resetBtn.addEventListener("click", resetProgress);
  }

  // Window resize
  window.addEventListener("resize", handleWindowResize);
});

// ============= ADVANCED THROTTLING EXAMPLES =============

// Example 1: Throttle with leading and trailing options
const advancedThrottle = throttle(
  (message) => {
    logActivity(`🎯 Advanced throttle: ${message}`, "success");
  },
  1000,
  { leading: true, trailing: true }
);

// Example 2: Network request throttling
const networkThrottle = throttle(async (url) => {
  logActivity(`🌐 Making network request to: ${url}`, "info");
  // Simulate network request
  setTimeout(() => {
    logActivity(`✅ Network request completed: ${url}`, "success");
  }, 500);
}, 2000);

// Example 3: Game loop throttling (60 FPS)
let frameCount = 0;
const gameLoop = throttle(() => {
  frameCount++;
  if (frameCount % 60 === 0) {
    logActivity(`🎮 Game frame: ${frameCount} (60 FPS throttled)`, "info");
  }
}, 1000 / 60); // 60 FPS

// ============= CONSOLE EXAMPLES =============

console.log("🎯 Advanced Throttling Examples:");
console.log("1. Scroll in the scroll area");
console.log("2. Click buttons rapidly");
console.log("3. Move mouse in the tracking area");
console.log("4. Start the progress bar simulation");
console.log("5. Resize the window");

// Demonstrate programmatic usage
setTimeout(() => {
  console.log("\n🔧 Programmatic throttle examples:");

  // Test advanced throttle
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      advancedThrottle(`Call ${i + 1}`);
    }, i * 200);
  }

  // Test network throttle
  setTimeout(() => {
    networkThrottle("/api/data1");
    networkThrottle("/api/data2");
    networkThrottle("/api/data3");
  }, 1000);

  // Start game loop simulation
  setTimeout(() => {
    const gameInterval = setInterval(() => {
      gameLoop();
    }, 10);

    // Stop after 3 seconds
    setTimeout(() => {
      clearInterval(gameInterval);
      logActivity("🎮 Game loop stopped", "warning");
    }, 3000);
  }, 2000);
}, 3000);

// ============= PERFORMANCE COMPARISON =============

// Demonstrate performance benefits
function performanceTest() {
  console.log("\n📊 Performance Comparison Test:");

  let normalCount = 0;
  let throttledCount = 0;

  const normalFunction = () => {
    normalCount++;
  };
  const throttledFunction = throttle(() => {
    throttledCount++;
  }, 100);

  // Simulate rapid events
  const testInterval = setInterval(() => {
    normalFunction();
    throttledFunction();
  }, 10);

  // Stop after 1 second and show results
  setTimeout(() => {
    clearInterval(testInterval);
    console.log(`Normal function calls: ${normalCount}`);
    console.log(`Throttled function calls: ${throttledCount}`);
    console.log(
      `Performance improvement: ${Math.round(
        (1 - throttledCount / normalCount) * 100
      )}%`
    );

    logActivity(
      `📊 Performance test: ${normalCount} vs ${throttledCount} calls (${Math.round(
        (1 - throttledCount / normalCount) * 100
      )}% reduction)`,
      "success"
    );
  }, 1000);
}

// Run performance test after 5 seconds
setTimeout(performanceTest, 5000);

// Export for potential module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = { throttle, simpleThrottle };
}
