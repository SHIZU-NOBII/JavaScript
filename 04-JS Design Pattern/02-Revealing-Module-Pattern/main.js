// REVEALING MODULE PATTERN - Similar to Module Pattern but reveals methods with different names
// All methods are defined privately, then selectively exposed with custom names

console.log("=== REVEALING MODULE PATTERN EXAMPLE ===\n");

let ShoppingCart = (function () {
  // Private variables
  let items = [];
  let totalAmount = 0;
  let discountPercent = 0;

  // All methods defined as private functions first
  function addItemToCart(name, price, quantity = 1) {
    const item = {
      id: Date.now(),
      name: name,
      price: price,
      quantity: quantity,
      total: price * quantity,
    };

    items.push(item);
    calculateTotal();
    console.log(
      `✅ Added: ${quantity}x ${name} @ ₹${price} each = ₹${item.total}`
    );
  }

  function removeItemFromCart(itemName) {
    const initialLength = items.length;
    items = items.filter((item) => item.name !== itemName);

    if (items.length < initialLength) {
      calculateTotal();
      console.log(`🗑️ Removed: ${itemName} from cart`);
    } else {
      console.log(`❌ Item "${itemName}" not found in cart`);
    }
  }

  function showCartContents() {
    console.log("\n🛒 Shopping Cart Contents:");
    if (items.length === 0) {
      console.log("Cart is empty");
      return;
    }

    items.forEach((item, index) => {
      console.log(
        `${index + 1}. ${item.name} - Qty: ${item.quantity} - ₹${
          item.price
        } each - Total: ₹${item.total}`
      );
    });
    console.log(`\n💰 Subtotal: ₹${totalAmount}`);
    if (discountPercent > 0) {
      const discountAmount = (totalAmount * discountPercent) / 100;
      console.log(`🎯 Discount (${discountPercent}%): -₹${discountAmount}`);
      console.log(`💳 Final Total: ₹${totalAmount - discountAmount}`);
    }
  }

  function applyDiscountToCart(percent) {
    if (percent >= 0 && percent <= 50) {
      discountPercent = percent;
      console.log(`🎉 ${percent}% discount applied!`);
    } else {
      console.log("❌ Invalid discount. Must be between 0-50%");
    }
  }

  function calculateTotal() {
    totalAmount = items.reduce((sum, item) => sum + item.total, 0);
  }

  function clearEntireCart() {
    items = [];
    totalAmount = 0;
    discountPercent = 0;
    console.log("🧹 Cart cleared!");
  }

  function getCartItemCount() {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    console.log(`📊 Total items in cart: ${totalItems}`);
    return totalItems;
  }

  // REVEALING: Expose private methods with custom public names
  return {
    add: addItemToCart, // addItemToCart becomes 'add'
    remove: removeItemFromCart, // removeItemFromCart becomes 'remove'
    show: showCartContents, // showCartContents becomes 'show'
    discount: applyDiscountToCart, // applyDiscountToCart becomes 'discount'
    clear: clearEntireCart, // clearEntireCart becomes 'clear'
    count: getCartItemCount, // getCartItemCount becomes 'count'
  };
})();

// Usage Example - Notice the clean, simple method names
ShoppingCart.add("Laptop", 50000, 1);
ShoppingCart.add("Mouse", 1500, 2);
ShoppingCart.add("Keyboard", 3000, 1);
ShoppingCart.show();

ShoppingCart.discount(10);
ShoppingCart.show();

ShoppingCart.count();
ShoppingCart.remove("Mouse");
ShoppingCart.show();

console.log("\n🔒 Private methods are not accessible:");
console.log("addItemToCart:", ShoppingCart.addItemToCart); // undefined
