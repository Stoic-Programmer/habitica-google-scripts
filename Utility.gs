/**
  Copyright 2020 by Nicholas R Ustick
*/


/**
  Ensures the calling rate it limited to the number of resuests
  that Habitica requires.  Habitical will error if requests are made faster
  than 30 calls per minute.
*/
function rateLimit(milliseconds) {
  let MINUTE = 60000; // Milliseconds per minute.
  let MAX_PER_MINUTE = 30; // Number of requests per minute.
  let RATE_LIMIT = MINUTE / MAX_PER_MINUTE;
  return limitTo(RATE_LIMIT, milliseconds);
}

function scaleToFiveMinutes(delay, ntimes) {
  const FIVE_MINUTES = 4 * 60 * 1000; //milliseconds in  four minutes to scale it in a bit
  let n = ntimes;
  let estRunTime = n * delay;
  if (FIVE_MINUTES < estRunTime) {
    n = Math.floor(FIVE_MINUTES / delay) - 1;
  }
  return n;
}

function limitTo(max, value) {
  if (max && (max < value)) {
    return max
  }
  return value;  
}

function numberBasedOnCost(cost, available)  {
  let items = 0;
  if ((0 < cost) && (cost <= available)) {
    items = Math.floor(available / cost);
  }
  return items;
}

function executeThenDelay(delay, targetFunc) {
  targetFunc();
  delay && Utilities.sleep(delay);
}

function repeat(n, targetFunc) {
  if (n > 0) {
    targetFunc();
    --n;
    repeat(n,targetFunc);
  }
}

