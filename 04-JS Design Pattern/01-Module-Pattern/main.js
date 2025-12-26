// MODULE PATTERN - Encapsulation with IIFE (Immediately Invoked Function Expression)
// Creates private variables and methods that cannot be accessed from outside

console.log("=== MODULE PATTERN EXAMPLE ===\n");

let BankAccount = (function () {
  // Private variables - cannot be accessed directly from outside
  let accountBalance = 1000;
  let accountNumber = "ACC123456";
  let transactionHistory = [];

  // Private method - only accessible within this module
  function addTransaction(type, amount) {
    transactionHistory.push({
      type: type,
      amount: amount,
      date: new Date().toLocaleDateString(),
      balance: accountBalance,
    });
  }

  // Public methods - exposed through return object
  function checkBalance() {
    console.log(`💰 Account ${accountNumber}: Balance is ₹${accountBalance}`);
    return accountBalance;
  }

  function withdraw(amount) {
    if (amount <= 0) {
      console.log("❌ Invalid amount");
      return false;
    }
    if (amount > accountBalance) {
      console.log("❌ Insufficient Balance");
      return false;
    }

    accountBalance -= amount;
    addTransaction("Withdraw", amount);
    console.log(
      `✅ Withdraw Successful: ₹${amount}. Remaining Balance: ₹${accountBalance}`
    );
    return true;
  }

  function deposit(amount) {
    if (amount < 100) {
      console.log("❌ Minimum deposit amount is ₹100");
      return false;
    }

    accountBalance += amount;
    addTransaction("Deposit", amount);
    console.log(
      `✅ Deposit Successful: ₹${amount}. New Balance: ₹${accountBalance}`
    );
    return true;
  }

  function getTransactionHistory() {
    console.log("📋 Transaction History:");
    transactionHistory.forEach((transaction, index) => {
      console.log(
        `${index + 1}. ${transaction.type}: ₹${transaction.amount} on ${
          transaction.date
        } (Balance: ₹${transaction.balance})`
      );
    });
  }

  // Public API - only these methods are accessible from outside
  return {
    checkBalance: checkBalance,
    withdraw: withdraw,
    deposit: deposit,
    getHistory: getTransactionHistory,
  };
})();

// Usage Example
BankAccount.checkBalance();
BankAccount.deposit(500);
BankAccount.withdraw(200);
BankAccount.deposit(50); // Will fail - minimum amount
BankAccount.withdraw(2000); // Will fail - insufficient balance
BankAccount.getHistory();

// Try to access private variables (will be undefined)
console.log("\n🔒 Trying to access private data:");
console.log("accountBalance:", BankAccount.accountBalance); // undefined
console.log("accountNumber:", BankAccount.accountNumber); // undefined
