// Observer Moduel Pattern
let Bank = (function () {
  let bankBalance = 1000; // private variable

  function checkBalance() {
    console.log("Your Balance is " + bankBalance);
  }

  function withdraw(amount) {
    if (amount > bankBalance) return "Insufficient Balance";

    bankBalance -= amount;
    console.log("Withdraw Successful. Remaining Balance: " + bankBalance);
  }

  function deposit(amount) {
    if (amount < 100) return "Amount must be greater than or equal to 100";

    bankBalance += amount;
    console.log("Deposit Successful. Balance: " + bankBalance);
  }

  //public API
  return {
    check: checkBalance,
    draw: withdraw,
    fundadd: deposit,
  };
})();

Bank.check();
