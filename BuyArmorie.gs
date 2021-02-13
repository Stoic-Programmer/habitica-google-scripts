/**
    Copyright 2020 by Nicholas R Ustick
    
    Purchase a number of Armoire based upon the
    amount of gold the player has on hand.
    The script can reserve a certain amount of gold
    so that there is always a bit of gold left on the account.
*/
function scheduleBulkBuyArmorie() {
  const TIMEOUT = 295000; // Google scripts limits the amount of time a cript is allowed to run.
  const RESERVE = 100000; // The amount of Gold we want to keep in our bank.
  const PRICE = 100; // The price in gold of each armorie.

  let gold = Math.floor(PLAYER.stats().gp);
  let amount = gold - RESERVE;
  let items = numberBasedOnCost(PRICE, amount);

  if (items > 0) {
    const end = futureMillisFromNow(TIMEOUT);

    console.info("Buy Armorie. reserve=" + RESERVE + ", player gold=" + gold + ", items=" + items +", timeLimit="+end);
    const purchaseArmorie = function () { return PLAYER.buyArmoire(); };
    const purchaseThenDelay = function () { return execute(end, purchaseArmorie); };
    repeatWithLimit(end, items, purchaseThenDelay);
  }
  else {
    console.warn("Not enough reserve to buy.  reserve=" + RESERVE + ", player gold=" + gold);
  }
}
