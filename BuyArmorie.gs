/**
    Copyright 2020 by Nicholas R Ustick
    
    Purchase a number of Armoire based upon the
    amount of gold the player has on hand.
    The script can reserve a certain amount of gold
    so that there is always a bit of gold left on the account.
*/
function scheduleBulkBuyArmorie() {
  const RESERVE = 30000;
  const MAX_ITEMS = 200;
  const PRICE = 100;

  let gold = Math.floor(PLAYER.stats().gp);
  let amount = gold - RESERVE;

  let items = numberBasedOnCost(PRICE, amount);
  items = limitTo(MAX_ITEMS, items);

  if (items > 0) {
    const now = new Date();
    const stop = now.getMilliseconds() + 295000; // point we need to terminate.

    Logger.log("Calculated items to buy. required reserve=" + RESERVE + ", player gold=" + gold + ", itemCount=" + items);
    const purchaseArmorie = function () { return PLAYER.buyArmoire(); };
    const purchaseThenDelay = function () { return execute(stop, purchaseArmorie); };
    repeatWithLimit(stop, items, purchaseThenDelay);
  }
  else {
    Logger.log("Not enough reserve to buy.  reserve=" + RESERVE + ", player gold=" + gold);
  }
}
