/**
    Purchase a number of Armoire based upon the
    amount of gold the player has on hand.
    The script can reserve a certain amount of gold
    so that there is always a bit of gold left on the account.
*/
function scheduleBulkBuyArmorie() {
  const DELAY = rateLimit(2100);
  const RESERVE = 20000;
  const MAX_ITEMS = 50;
  const PRICE = 100;

  let gold = Math.floor(PLAYER.stats().gp);
  let amount = gold - RESERVE;
  let items = scaleToFiveMinutes(numberBasedOnCost(amount, PRICE), DELAY);
  
  if (items > MAX_ITEMS) {
    items = MAX_ITEMS;
  }
  
  if (items > 0) {
    Logger.log("Calculated items to buy. required reserve="+RESERVE+", player gold="+gold+", itemCount="+items);
    repeat(function(){PLAYER.buyArmoire();}, items, DELAY);
  }
  else {
     Logger.log("Not enough reserve to buy.  reserve="+RESERVE+", player gold="+gold);
  }
}
