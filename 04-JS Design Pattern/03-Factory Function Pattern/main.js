// FACTORY FUNCTION PATTERN - Creates objects without using 'new' keyword
// Returns objects with methods and private variables through closures

console.log("=== FACTORY FUNCTION PATTERN EXAMPLE ===\n");

// Factory function to create Product objects
function createProduct(name, price, initialStock = 100) {
  // Private variables (closure)
  let stock = initialStock;
  let sales = 0;
  let productId = Math.random().toString(36).substr(2, 9);

  // Return object with methods (each instance has its own copy)
  return {
    // Public properties
    name: name,
    price: price,
    id: productId,

    // Public methods
    checkStock() {
      console.log(
        `📦 ${this.name} (ID: ${this.id}): ${stock} pieces available in stock`
      );
      return stock;
    },

    buy(quantity) {
      if (quantity <= 0) {
        console.log("❌ Invalid quantity");
        return false;
      }

      if (quantity <= stock) {
        stock -= quantity;
        sales += quantity;
        const totalCost = quantity * this.price;
        console.log(
          `✅ Purchased ${quantity}x ${this.name} for ₹${totalCost}. Stock left: ${stock}`
        );
        return true;
      } else {
        console.log(
          `❌ Sorry! We only have ${stock} pieces of ${this.name} available`
        );
        return false;
      }
    },

    restock(quantity) {
      if (quantity > 0) {
        stock += quantity;
        console.log(
          `📈 Restocked ${quantity} pieces of ${this.name}. Total stock: ${stock}`
        );
      } else {
        console.log("❌ Invalid restock quantity");
      }
    },

    getSalesInfo() {
      const revenue = sales * this.price;
      console.log(
        `📊 ${this.name} Sales: ${sales} units sold, Revenue: ₹${revenue}`
      );
      return { unitsSold: sales, revenue: revenue };
    },

    applyDiscount(discountPercent) {
      if (discountPercent > 0 && discountPercent <= 50) {
        const originalPrice = this.price;
        this.price = originalPrice - (originalPrice * discountPercent) / 100;
        console.log(
          `🎯 ${discountPercent}% discount applied to ${this.name}! New price: ₹${this.price} (was ₹${originalPrice})`
        );
      } else {
        console.log("❌ Invalid discount percentage (must be 1-50%)");
      }
    },
  };
}

// Factory function to create different types of products
function createElectronics(name, price, warranty, brand) {
  // Get base product functionality
  const product = createProduct(name, price, 50);

  // Add electronics-specific properties and methods
  product.warranty = warranty;
  product.brand = brand;
  product.type = "Electronics";

  product.getWarrantyInfo = function () {
    console.log(
      `🛡️ ${this.name} by ${this.brand} comes with ${this.warranty} warranty`
    );
  };

  return product;
}

function createClothing(name, price, size, color) {
  const product = createProduct(name, price, 200);

  product.size = size;
  product.color = color;
  product.type = "Clothing";

  product.getDetails = function () {
    console.log(
      `👕 ${this.name} - Size: ${this.size}, Color: ${this.color}, Price: ₹${this.price}`
    );
  };

  return product;
}

// Usage Examples
console.log("Creating different products using factory functions:\n");

// Create electronics
const laptop = createElectronics("Gaming Laptop", 75000, "2 years", "ASUS");
const phone = createElectronics("Smartphone", 25000, "1 year", "Samsung");

// Create clothing
const tshirt = createClothing("Cotton T-Shirt", 800, "L", "Blue");
const jeans = createClothing("Denim Jeans", 2500, "32", "Black");

// Test the products
laptop.getWarrantyInfo();
laptop.checkStock();
laptop.buy(2);
laptop.getSalesInfo();

console.log();
tshirt.getDetails();
tshirt.buy(5);
tshirt.applyDiscount(20);
tshirt.restock(100);

console.log();
phone.checkStock();
phone.buy(60); // Will fail - not enough stock
phone.restock(20);
phone.buy(15);

console.log("\n🔒 Each product instance has its own private stock:");
console.log("Laptop stock and Phone stock are independent of each other");
