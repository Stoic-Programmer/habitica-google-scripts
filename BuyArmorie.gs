/**
    Copyright 2020 by Nicholas R Ustick
    
    Purchase a number of Armoire based upon the
    amount of gold the player has on hand.
    The script can reserve a certain amount of gold
    so that there is always a bit of gold left on the account.
*/
function scheduleBulkBuyArmorie() {
  const DELAY = rateLimit(2100);
  const RESERVE = 30000;
  const MAX_ITEMS = 200;
  const PRICE = 100;

  let gold = Math.floor(PLAYER.stats().gp);
  let amount = gold - RESERVE;

  let items = scaleToFiveMinutes(DELAY, numberBasedOnCost(PRICE, amount));
  items = limitTo(MAX_ITEMS, items);
  
  if (items > 0) {
    Logger.log("Calculated items to buy. required reserve="+RESERVE+", player gold="+gold+", itemCount="+items);
    repeat(DELAY, items, function(){PLAYER.buyArmoire();});
  }
  else {
     Logger.log("Not enough reserve to buy.  reserve="+RESERVE+", player gold="+gold);
  }
}
