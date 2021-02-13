/**
    Copyright 2020 by Nicholas R Ustick
    
    Purchase a number of Armoire based upon the
    amount of gold the player has on hand.
    The script can reserve a certain amount of gold
    so that there is always a bit of gold left on the account.
*/
function scheduleBulkBuyArmorie() {
  const RESERVE = 100000;
  const PRICE = 100;

  let gold = Math.floor(PLAYER.stats().gp);
  let amount = gold - RESERVE;
  let items = numberBasedOnCost(PRICE, amount);

  if (items > 0) {
    const end = new Date();
    const stop = end.getTime() + 290000;
    end.setTime(stop);

    PLAYER.setTerminateTime(end);
    console.info("Buy Armorie. reserve=" + RESERVE + ", player gold=" + gold + ", items=" + items +", timeLimit="+end);
    const purchaseArmorie = function () { return PLAYER.buyArmoire(); };
    const purchaseThenDelay = function () { return execute(stop, purchaseArmorie); };
    repeatWithLimit(stop, items, purchaseThenDelay);
  }
  else {
    console.warn("Not enough reserve to buy.  reserve=" + RESERVE + ", player gold=" + gold);
  }
}
