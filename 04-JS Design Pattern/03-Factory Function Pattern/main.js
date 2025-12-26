function createProduct(name, price) {
  let stock = 100;

  return {
    name,
    price,
    checkQuantity() {
      console.log(stock + "Pieces are available in stock");
    },
    buy(qty) {
      if (qty <= stock) {
        stock -= qty;
        console.log("Booked " + stock + "Pieces Left");
      } else {
        console.log("We have only " + stock + " available in stock");
      }
    },
    refil(qty) {
      stock += qty;
      console.log("Total Number Of Stock " + stock);
    },
  };
}

let laptop = createProduct("Laptop", 2000);

laptop.buy(20);
