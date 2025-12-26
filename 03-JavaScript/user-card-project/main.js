// USER CARD PROJECT - Call, Bind, Apply Methods Demonstration
// This project demonstrates practical usage of call(), bind(), and apply() methods

console.log("=== USER CARD PROJECT WITH CALL, BIND, APPLY ===\n");

// ============= DOM ELEMENTS =============
let form = document.querySelector("#form");
let userName = document.querySelector("#userName");
let userRole = document.querySelector("#userRole");
let imageUrl = document.querySelector("#imageUrl");
let userBio = document.querySelector("#userBio");
let usersList = document.querySelector("#usersList");

// ============= STATISTICS TRACKING =============
const stats = {
  totalUsers: 0,
  methodCalls: 0,
  bindUsage: 0,
  callApplyUsage: 0,

  updateDisplay() {
    document.getElementById("totalUsers").textContent = this.totalUsers;
    document.getElementById("methodCalls").textContent = this.methodCalls;
    document.getElementById("bindUsage").textContent = this.bindUsage;
    document.getElementById("callApplyUsage").textContent = this.callApplyUsage;
  },

  incrementBind() {
    this.bindUsage++;
    this.methodCalls++;
    this.updateDisplay();
  },

  incrementCallApply() {
    this.callApplyUsage++;
    this.methodCalls++;
    this.updateDisplay();
  },
};

// ============= USER VALIDATOR OBJECT =============
const userValidator = {
  name: "UserValidator",

  // Method to validate user data using CALL
  validate: function (userData) {
    console.log(`🔍 ${this.name} validating user: ${userData.username}`);

    const errors = [];

    if (!userData.username || userData.username.trim().length < 2) {
      errors.push("Name must be at least 2 characters");
    }

    if (!userData.role) {
      errors.push("Role is required");
    }

    if (!userData.bio || userData.bio.trim().length < 10) {
      errors.push("Bio must be at least 10 characters");
    }

    if (userData.imageUrl && !this.isValidUrl(userData.imageUrl)) {
      errors.push("Invalid image URL format");
    }

    return {
      isValid: errors.length === 0,
      errors: errors,
    };
  },

  isValidUrl: function (url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  // Method to sanitize input using CALL
  sanitize: function (userData) {
    console.log(`🧹 ${this.name} sanitizing user data`);

    return {
      username: userData.username.trim(),
      role: userData.role.trim(),
      bio: userData.bio.trim(),
      imageUrl:
        userData.imageUrl.trim() ||
        "https://via.placeholder.com/150/667eea/white?text=User",
    };
  },
};

// ============= USER FORMATTER OBJECT =============
const userFormatter = {
  name: "UserFormatter",

  // Format user data using APPLY
  formatUserData: function (...users) {
    console.log(`🎨 ${this.name} formatting ${users.length} users`);

    return users.map((user) => ({
      ...user,
      id: Date.now() + Math.random(),
      createdAt: new Date().toLocaleString(),
      displayName: this.capitalizeWords(user.username),
      shortBio: this.truncateText(user.bio, 100),
    }));
  },

  capitalizeWords: function (text) {
    return text.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  },

  truncateText: function (text, maxLength) {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  },
};

// ============= MAIN USER MANAGER OBJECT =============
const userManager = {
  users: [],
  name: "UserManager",

  // Initialize with BIND for event listeners
  init: function () {
    console.log(`🚀 ${this.name} initializing...`);

    // BIND USAGE: Binding event handlers to preserve 'this' context
    form.addEventListener("submit", this.handleSubmit.bind(this));
    stats.incrementBind();

    document
      .getElementById("addMultiple")
      .addEventListener("click", this.addMultipleUsers.bind(this));
    stats.incrementBind();

    document
      .getElementById("updateAll")
      .addEventListener("click", this.updateAllRoles.bind(this));
    stats.incrementBind();

    document
      .getElementById("clearAll")
      .addEventListener("click", this.clearAllUsers.bind(this));
    stats.incrementBind();

    document
      .getElementById("fillSample")
      .addEventListener("click", this.fillSampleData.bind(this));
    stats.incrementBind();

    console.log("✅ Event listeners bound successfully using bind()");
  },

  // Handle form submission using CALL and APPLY
  handleSubmit: function (e) {
    e.preventDefault();
    console.log(`📝 ${this.name} handling form submission`);

    const userData = {
      username: userName.value,
      role: userRole.value,
      bio: userBio.value,
      imageUrl: imageUrl.value,
    };

    // CALL USAGE: Using call() to validate with different context
    const validation = userValidator.validate.call(userValidator, userData);
    stats.incrementCallApply();

    if (!validation.isValid) {
      alert("❌ Validation failed:\n" + validation.errors.join("\n"));
      return;
    }

    // CALL USAGE: Using call() to sanitize data
    const sanitizedData = userValidator.sanitize.call(userValidator, userData);
    stats.incrementCallApply();

    // APPLY USAGE: Using apply() to format user data
    const [formattedUser] = userFormatter.formatUserData.apply(userFormatter, [
      sanitizedData,
    ]);
    stats.incrementCallApply();

    this.addUser(formattedUser);
    form.reset();
  },

  // Add single user
  addUser: function (userData) {
    console.log(`➕ ${this.name} adding user: ${userData.username}`);

    this.users.push(userData);
    stats.totalUsers++;
    stats.updateDisplay();

    this.renderUsers();
    this.logUserAdded(userData);
  },

  // APPLY USAGE: Add multiple users using apply()
  addMultipleUsers: function (...users) {
    console.log(`➕ ${this.name} adding multiple users using apply()`);

    const sampleUsers = [
      {
        username: "Alice Johnson",
        role: "Frontend Developer",
        bio: "Passionate about creating beautiful and responsive user interfaces with React and Vue.js",
        imageUrl: "https://randomuser.me/api/portraits/women/1.jpg",
      },
      {
        username: "Bob Smith",
        role: "Backend Developer",
        bio: "Expert in Node.js, Python, and database design. Love building scalable APIs and microservices",
        imageUrl: "https://randomuser.me/api/portraits/men/2.jpg",
      },
      {
        username: "Carol Davis",
        role: "UI/UX Designer",
        bio: "Creative designer focused on user-centered design principles and modern design trends",
        imageUrl: "https://randomuser.me/api/portraits/women/3.jpg",
      },
    ];

    // APPLY USAGE: Format all users at once using apply()
    const formattedUsers = userFormatter.formatUserData.apply(
      userFormatter,
      sampleUsers
    );
    stats.incrementCallApply();

    // APPLY USAGE: Add all users using apply() with push
    Array.prototype.push.apply(this.users, formattedUsers);
    stats.incrementCallApply();

    stats.totalUsers += formattedUsers.length;
    stats.updateDisplay();

    this.renderUsers();
    console.log(`✅ Added ${formattedUsers.length} users using apply()`);
  },

  // CALL USAGE: Update all user roles using call()
  updateAllRoles: function () {
    console.log(`🔄 ${this.name} updating all user roles using call()`);

    const roleUpdater = {
      name: "RoleUpdater",
      updateRole: function (user, newRole) {
        console.log(`🔄 ${this.name} updating ${user.username} to ${newRole}`);
        user.role = newRole;
        user.updatedAt = new Date().toLocaleString();
      },
    };

    const newRoles = [
      "Senior Developer",
      "Lead Developer",
      "Tech Lead",
      "Principal Engineer",
    ];

    this.users.forEach((user, index) => {
      const randomRole = newRoles[Math.floor(Math.random() * newRoles.length)];
      // CALL USAGE: Using call() to update role with different context
      roleUpdater.updateRole.call(roleUpdater, user, randomRole);
      stats.incrementCallApply();
    });

    this.renderUsers();
    console.log("✅ All user roles updated using call()");
  },

  // Remove user with CALL usage
  removeUser: function (userId) {
    console.log(`🗑️ ${this.name} removing user with ID: ${userId}`);

    const remover = {
      name: "UserRemover",
      remove: function (users, id) {
        const index = users.findIndex((user) => user.id === id);
        if (index !== -1) {
          const removedUser = users.splice(index, 1)[0];
          console.log(`🗑️ ${this.name} removed: ${removedUser.username}`);
          return removedUser;
        }
        return null;
      },
    };

    // CALL USAGE: Using call() to remove user
    const removedUser = remover.remove.call(remover, this.users, userId);
    stats.incrementCallApply();

    if (removedUser) {
      stats.totalUsers--;
      stats.updateDisplay();
      this.renderUsers();
    }
  },

  // Clear all users
  clearAllUsers: function () {
    console.log(`🗑️ ${this.name} clearing all users`);

    this.users = [];
    stats.totalUsers = 0;
    stats.updateDisplay();
    this.renderUsers();
  },

  // Fill sample data using BIND
  fillSampleData: function () {
    console.log(`🎲 ${this.name} filling sample data`);

    const sampleData = {
      username: "John Doe",
      role: "Full Stack Developer",
      bio: "Experienced developer with expertise in JavaScript, React, Node.js, and modern web technologies. Passionate about clean code and user experience.",
      imageUrl: "https://randomuser.me/api/portraits/men/1.jpg",
    };

    // Fill form fields
    userName.value = sampleData.username;
    userRole.value = sampleData.role;
    userBio.value = sampleData.bio;
    imageUrl.value = sampleData.imageUrl;

    console.log("✅ Sample data filled");
  },

  // Render users to DOM
  renderUsers: function () {
    console.log(`🎨 ${this.name} rendering ${this.users.length} users`);

    if (this.users.length === 0) {
      usersList.innerHTML = `
        <div class="no-users">
          No users added yet. Use the form to add your first user! 🚀
        </div>
      `;
      return;
    }

    // Create user cards HTML
    const userCardsHTML = this.users
      .map((user) => {
        const fallbackImage = `https://via.placeholder.com/60/667eea/white?text=${
          user.displayName ? user.displayName.charAt(0) : "U"
        }`;

        return `
        <div class="user-card" data-user-id="${user.id}">
          <div class="user-header">
            <img src="${user.imageUrl || fallbackImage}" 
                 alt="${user.displayName || user.username}" 
                 class="user-avatar" 
                 onerror="this.src='${fallbackImage}'">
            <div class="user-info">
              <h3>${user.displayName || user.username}</h3>
              <span class="user-role">${user.role}</span>
            </div>
          </div>
          <div class="user-bio">${user.shortBio || user.bio}</div>
          <div class="user-actions">
            <button class="btn btn-danger" onclick="userManager.removeUser.call(userManager, ${
              user.id
            })">
              🗑️ Remove
            </button>
            <button class="btn btn-primary" onclick="userManager.editUser.call(userManager, ${
              user.id
            })">
              ✏️ Edit
            </button>
          </div>
          <div style="margin-top: 10px;">
            <small style="color: #666;">
              📅 Created: ${user.createdAt || "Unknown"}
              ${user.updatedAt ? `<br>🔄 Updated: ${user.updatedAt}` : ""}
            </small>
          </div>
        </div>
      `;
      })
      .join("");

    // Update the DOM
    usersList.innerHTML = userCardsHTML;

    console.log(`✅ ${this.users.length} user cards rendered successfully`);
  },

  // Edit user method using CALL
  editUser: function (userId) {
    console.log(`✏️ ${this.name} editing user with ID: ${userId}`);

    const user = this.users.find((u) => u.id === userId);
    if (!user) {
      console.log("❌ User not found");
      return;
    }

    // Fill form with user data for editing
    userName.value = user.username;
    userRole.value = user.role;
    userBio.value = user.bio;
    imageUrl.value = user.imageUrl;

    // Remove the user temporarily (will be re-added when form is submitted)
    this.removeUser(userId);

    console.log(`✏️ User data loaded for editing: ${user.username}`);
  },

  // Log user addition using APPLY
  logUserAdded: function (user) {
    const logger = {
      name: "UserLogger",
      log: function (action, username, role, timestamp) {
        console.log(
          `📝 ${this.name}: ${action} - ${username} (${role}) at ${timestamp}`
        );
      },
    };

    // APPLY USAGE: Using apply() to log with array of arguments
    const logArgs = ["USER_ADDED", user.displayName, user.role, user.createdAt];
    logger.log.apply(logger, logArgs);
    stats.incrementCallApply();
  },
};

// ============= UTILITY FUNCTIONS DEMONSTRATING CALL/APPLY =============

// Array-like object manipulation using CALL
const arrayLikeUtils = {
  name: "ArrayLikeUtils",

  // Convert array-like objects using CALL
  convertToArray: function (arrayLike) {
    console.log(`🔄 ${this.name} converting array-like object using call()`);

    // CALL USAGE: Using call() to convert array-like objects
    const result = Array.prototype.slice.call(arrayLike);
    stats.incrementCallApply();

    return result;
  },

  // Find max ID using APPLY
  findMaxId: function (users) {
    if (users.length === 0) return 0;

    console.log(`🔍 ${this.name} finding max ID using apply()`);

    const ids = users.map((user) => user.id);

    // APPLY USAGE: Using apply() to find maximum value
    const maxId = Math.max.apply(null, ids);
    stats.incrementCallApply();

    return maxId;
  },
};

// ============= ADVANCED EXAMPLES =============

// Function borrowing example
const functionBorrower = {
  name: "FunctionBorrower",

  // Borrow array methods for objects using CALL
  borrowArrayMethods: function (obj) {
    console.log(`🔄 ${this.name} borrowing array methods using call()`);

    // CALL USAGE: Borrowing push method from Array
    Array.prototype.push.call(obj, "new item");
    stats.incrementCallApply();

    // CALL USAGE: Borrowing join method from Array
    const result = Array.prototype.join.call(obj, ", ");
    stats.incrementCallApply();

    return result;
  },
};

// Method chaining with different contexts
const contextChanger = {
  name: "ContextChanger",

  // Change context using CALL
  changeContext: function (method, newContext, ...args) {
    console.log(`🔄 ${this.name} changing context using call()`);

    // CALL USAGE: Changing method context
    const result = method.call(newContext, ...args);
    stats.incrementCallApply();

    return result;
  },
};

// ============= INITIALIZATION =============

document.addEventListener("DOMContentLoaded", function () {
  console.log("🚀 DOM Content Loaded - Initializing User Manager");

  // Initialize user manager using BIND
  userManager.init();

  // Initialize stats display
  stats.updateDisplay();

  console.log("✅ User Card Project initialized successfully");

  // Demonstration examples
  setTimeout(() => {
    console.log("\n🎯 CALL, BIND, APPLY Examples:");
    console.log("1. Form submission uses BIND for event handlers");
    console.log("2. Validation uses CALL to change context");
    console.log("3. Multiple user addition uses APPLY with arrays");
    console.log("4. Role updates use CALL for method borrowing");
    console.log("5. Logging uses APPLY with argument arrays");

    // Demo function borrowing
    const arrayLikeObj = { 0: "item1", 1: "item2", length: 2 };
    const converted = arrayLikeUtils.convertToArray(arrayLikeObj);
    console.log("🔄 Array-like conversion result:", converted);

    // Demo max ID finding
    if (userManager.users.length > 0) {
      const maxId = arrayLikeUtils.findMaxId(userManager.users);
      console.log("🔍 Max user ID:", maxId);
    }
  }, 2000);
});

// ============= CONSOLE EXAMPLES FOR TESTING =============

// Global functions for console testing
window.userCardDemo = {
  userManager,
  userValidator,
  userFormatter,
  arrayLikeUtils,
  functionBorrower,
  contextChanger,
  stats,

  // Test CALL method
  testCall: function () {
    console.log("\n🧪 Testing CALL method:");
    const testUser = {
      username: "Test User",
      role: "Tester",
      bio: "Testing call method",
      imageUrl: "",
    };
    const result = userValidator.validate.call(userValidator, testUser);
    console.log("Validation result:", result);
  },

  // Test APPLY method
  testApply: function () {
    console.log("\n🧪 Testing APPLY method:");
    const testUsers = [
      {
        username: "User 1",
        role: "Developer",
        bio: "First test user",
        imageUrl: "",
      },
      {
        username: "User 2",
        role: "Designer",
        bio: "Second test user",
        imageUrl: "",
      },
    ];
    const result = userFormatter.formatUserData.apply(userFormatter, testUsers);
    console.log("Formatted users:", result);
  },

  // Test BIND method
  testBind: function () {
    console.log("\n🧪 Testing BIND method:");
    const boundMethod = userManager.addUser.bind(userManager);
    console.log("Bound method created:", typeof boundMethod);
  },
};
