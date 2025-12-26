// LAZY LOADING WITH INTERSECTION OBSERVER - Enhanced Implementation
// Efficiently loads content only when it becomes visible in the viewport
"use strict";
console.log("=== LAZY LOADING WITH INTERSECTION OBSERVER ===\n");

// ============= CONFIGURATION =============

const CONFIG = {
  imageObserver: {
    root: null,
    rootMargin: "50px",
    threshold: 0.1,
  },
  animationObserver: {
    root: null,
    rootMargin: "0px",
    threshold: 0.2,
  },
  videoObserver: {
    root: null,
    rootMargin: "100px",
    threshold: 0.5,
  },
};

// ============= STATE MANAGEMENT =============

const state = {
  totalImages: 0,
  loadedImages: 0,
  visibleElements: 0,
  dataTransferred: 0,
  observers: {
    image: null,
    animation: null,
    video: null,
  },
};

// ============= UTILITY FUNCTIONS =============

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

function updateStats() {
  document.getElementById("totalImages").textContent = state.totalImages;
  document.getElementById("loadedImages").textContent = state.loadedImages;
  document.getElementById("visibleElements").textContent =
    state.visibleElements;
  document.getElementById("dataTransfer").textContent = `${Math.round(
    state.dataTransferred
  )} KB`;

  // Update progress bar
  const progress =
    state.totalImages > 0 ? (state.loadedImages / state.totalImages) * 100 : 0;
  document.getElementById("loadingProgress").style.width = `${progress}%`;
}

function generateImageUrl(width = 400, height = 300, category = "nature") {
  const categories = [
    "nature",
    "city",
    "technology",
    "food",
    "animals",
    "space",
    "architecture",
  ];
  const randomCategory =
    categories[Math.floor(Math.random() * categories.length)];
  const seed = Math.floor(Math.random() * 1000);
  return `https://picsum.photos/${width}/${height}?random=${seed}&category=${randomCategory}`;
}

function estimateImageSize(width, height) {
  // Rough estimate: JPEG compression ~10-15 KB per 100x100 pixels
  return (width * height * 12) / 10000;
}

// ============= IMAGE LAZY LOADING =============

function createImageCard(index) {
  const card = document.createElement("div");
  card.className = "image-card";

  const imageUrl = generateImageUrl(400, 300);
  const estimatedSize = estimateImageSize(400, 300);

  card.innerHTML = `
    <div class="image-placeholder">
      <div class="loading-indicator"></div>
      <div style="position: absolute; bottom: 10px; left: 10px; font-size: 0.8rem; color: #999;">
        Image ${index + 1}
      </div>
    </div>
    <img class="lazy-image" data-src="${imageUrl}" data-size="${estimatedSize}" alt="Lazy loaded image ${
    index + 1
  }">
    <div class="image-info">
      <div class="image-title">Beautiful Image ${index + 1}</div>
      <div class="image-description">This image is loaded lazily when it comes into view, saving bandwidth and improving performance.</div>
    </div>
  `;

  return card;
}

function loadImage(img) {
  return new Promise((resolve, reject) => {
    const imageUrl = img.dataset.src;
    const estimatedSize = parseFloat(img.dataset.size) || 0;

    logActivity(`🖼️ Loading image: ${imageUrl}`, "info");

    const tempImg = new Image();
    tempImg.onload = () => {
      img.src = imageUrl;
      img.classList.add("loaded");

      // Hide placeholder and loading indicator
      const placeholder = img.previousElementSibling;
      if (placeholder) {
        placeholder.style.display = "none";
      }

      state.loadedImages++;
      state.dataTransferred += estimatedSize;
      updateStats();

      logActivity(
        `✅ Image loaded successfully (${estimatedSize.toFixed(1)} KB)`,
        "success"
      );
      resolve();
    };

    tempImg.onerror = () => {
      logActivity(`❌ Failed to load image: ${imageUrl}`, "error");
      reject();
    };

    tempImg.src = imageUrl;
  });
}

// ============= INTERSECTION OBSERVERS =============

function createImageObserver() {
  return new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;

        if (img.dataset.src && !img.src) {
          loadImage(img)
            .then(() => {
              state.observers.image.unobserve(img);
            })
            .catch(() => {
              // Retry after 2 seconds
              setTimeout(() => {
                loadImage(img).catch(() => {
                  logActivity(`❌ Failed to load image after retry`, "error");
                });
              }, 2000);
            });
        }
      }
    });
  }, CONFIG.imageObserver);
}

function createAnimationObserver() {
  return new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const element = entry.target;
        element.classList.add("visible");

        state.visibleElements++;
        updateStats();

        logActivity(
          `🎬 Element animated into view: ${element.tagName}`,
          "info"
        );

        // Unobserve after animation
        state.observers.animation.unobserve(element);
      }
    });
  }, CONFIG.animationObserver);
}

function createVideoObserver() {
  return new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const container = entry.target;
        const videoSrc = container.dataset.videoSrc;

        if (videoSrc) {
          logActivity(`🎥 Video container in view, ready to load`, "info");

          // Add click handler for video loading
          const placeholder = container.querySelector(".video-placeholder");
          if (placeholder) {
            placeholder.addEventListener("click", () =>
              loadVideo(container, videoSrc)
            );
          }
        }
      }
    });
  }, CONFIG.videoObserver);
}

// ============= VIDEO LAZY LOADING =============

function loadVideo(container, videoSrc) {
  logActivity(`🎥 Loading video: ${videoSrc}`, "info");

  const video = document.createElement("video");
  video.className = "lazy-video";
  video.controls = true;
  video.autoplay = true;
  video.muted = true; // Required for autoplay

  video.addEventListener("loadstart", () => {
    logActivity(`🎥 Video loading started`, "info");
  });

  video.addEventListener("canplay", () => {
    logActivity(`✅ Video ready to play`, "success");
    state.dataTransferred += 500; // Estimate video size
    updateStats();
  });

  video.addEventListener("error", () => {
    logActivity(`❌ Video failed to load`, "error");
    container.innerHTML = `
      <div class="video-placeholder" style="background: #dc3545;">
        <div>❌ Video failed to load</div>
      </div>
    `;
  });

  video.src = videoSrc;
  container.innerHTML = "";
  container.appendChild(video);
}

// ============= DEMO FUNCTIONS =============

function addImages(count = 6) {
  const gallery = document.getElementById("imageGallery");

  for (let i = 0; i < count; i++) {
    const card = createImageCard(state.totalImages + i);
    gallery.appendChild(card);

    // Observe the lazy image
    const img = card.querySelector(".lazy-image");
    state.observers.image.observe(img);
  }

  state.totalImages += count;
  updateStats();

  logActivity(
    `📸 Added ${count} images to gallery (Total: ${state.totalImages})`,
    "success"
  );
}

function loadAllImages() {
  const lazyImages = document.querySelectorAll(".lazy-image:not([src])");

  logActivity(
    `🚀 Loading all remaining images (${lazyImages.length})`,
    "warning"
  );

  lazyImages.forEach((img) => {
    if (img.dataset.src) {
      loadImage(img).then(() => {
        state.observers.image.unobserve(img);
      });
    }
  });
}

function resetDemo() {
  // Clear gallery
  const gallery = document.getElementById("imageGallery");
  gallery.innerHTML = "";

  // Reset state
  state.totalImages = 0;
  state.loadedImages = 0;
  state.visibleElements = 0;
  state.dataTransferred = 0;

  // Reset content sections
  const contentSections = document.querySelectorAll(".content-section");
  contentSections.forEach((section) => {
    section.classList.remove("visible");
    state.observers.animation.observe(section);
  });

  updateStats();

  // Add initial images
  addImages(8);

  logActivity(`🔄 Demo reset - added 8 new images`, "warning");
}

function clearLog() {
  const logElement = document.getElementById("activityLog");
  if (logElement) {
    logElement.innerHTML = "[SYSTEM] Activity log cleared...\n";
  }
  logActivity("🧹 Activity log cleared", "info");
}

// ============= INITIALIZATION =============

function initializeLazyLoading() {
  logActivity("🚀 Initializing Intersection Observers", "success");

  // Create observers
  state.observers.image = createImageObserver();
  state.observers.animation = createAnimationObserver();
  state.observers.video = createVideoObserver();

  // Observe content sections for animations
  const contentSections = document.querySelectorAll("[data-lazy]");
  contentSections.forEach((section) => {
    state.observers.animation.observe(section);
  });

  // Observe video containers
  const videoContainers = document.querySelectorAll("[data-video-src]");
  videoContainers.forEach((container) => {
    state.observers.video.observe(container);
  });

  logActivity(
    `📊 Observing ${contentSections.length} content sections and ${videoContainers.length} video containers`,
    "info"
  );
}

function setupEventListeners() {
  // Button event listeners
  document
    .getElementById("addImages")
    .addEventListener("click", () => addImages(4));
  document.getElementById("loadAll").addEventListener("click", loadAllImages);
  document.getElementById("resetDemo").addEventListener("click", resetDemo);
  document.getElementById("clearLog").addEventListener("click", clearLog);

  logActivity("🎛️ Event listeners setup complete", "success");
}

// ============= ADVANCED FEATURES =============

// Preload critical images
function preloadCriticalImages() {
  const criticalImages = [
    generateImageUrl(400, 300),
    generateImageUrl(400, 300),
  ];

  criticalImages.forEach((url, index) => {
    const img = new Image();
    img.onload = () => {
      logActivity(`⚡ Critical image ${index + 1} preloaded`, "success");
    };
    img.src = url;
  });
}

// Performance monitoring
function monitorPerformance() {
  if ("PerformanceObserver" in window) {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === "largest-contentful-paint") {
          logActivity(`📊 LCP: ${Math.round(entry.startTime)}ms`, "info");
        }
      });
    });

    observer.observe({ entryTypes: ["largest-contentful-paint"] });
  }
}

// Intersection ratio tracking
function createAdvancedObserver() {
  return new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const ratio = Math.round(entry.intersectionRatio * 100);
        if (ratio > 0) {
          logActivity(
            `👁️ Element ${entry.target.tagName} is ${ratio}% visible`,
            "info"
          );
        }
      });
    },
    {
      threshold: [0, 0.25, 0.5, 0.75, 1.0],
    }
  );
}

// ============= MAIN INITIALIZATION =============

document.addEventListener("DOMContentLoaded", function () {
  logActivity("🎯 DOM Content Loaded - Starting lazy loading demo", "success");

  // Initialize core functionality
  initializeLazyLoading();
  setupEventListeners();

  // Add initial images
  addImages(8);

  // Advanced features
  preloadCriticalImages();
  monitorPerformance();

  // Update initial stats
  updateStats();

  logActivity("✅ Lazy loading demo fully initialized", "success");

  // Demo tips
  setTimeout(() => {
    logActivity(
      "💡 TIP: Scroll down to see lazy loading in action!",
      "warning"
    );
  }, 2000);

  setTimeout(() => {
    logActivity(
      "💡 TIP: Try adding more images and watch the performance benefits!",
      "warning"
    );
  }, 5000);
});

// ============= CONSOLE EXAMPLES =============

console.log("🎯 Lazy Loading Features:");
console.log("1. Scroll to see images load automatically");
console.log("2. Watch content sections animate into view");
console.log("3. Click video placeholder to load video");
console.log("4. Monitor performance stats in real-time");
console.log("5. Add more images to test scalability");

// ============= PERFORMANCE TESTING =============

// Simulate network conditions
function simulateSlowNetwork() {
  const originalFetch = window.fetch;
  window.fetch = function (...args) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(originalFetch.apply(this, args));
      }, Math.random() * 1000 + 500); // 500-1500ms delay
    });
  };

  logActivity("🐌 Slow network simulation enabled", "warning");
}

// Export for potential module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    createImageObserver,
    createAnimationObserver,
    loadImage,
    CONFIG,
  };
}

// Global functions for console testing
window.lazyLoadingDemo = {
  addImages,
  loadAllImages,
  resetDemo,
  simulateSlowNetwork,
  state,
};

function printThis() {
  console.log(this);
}

printThis();
