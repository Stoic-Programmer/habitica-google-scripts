/**
  Copyright 2020 by Nicholas R Ustick
*/


/**
  Ensures the calling rate it limited to the number of resuests
  that Habitica requires.  Habitical will error if requests are made faster
  than 30 calls per minute.
*/
function rateLimit(milliseconds) {
  var MINUTE = 60000; // Milliseconds per minute.
  var MAX_PER_MINUTE = 30; // Number of requests per minute.
  var RATE_LIMIT = MINUTE / MAX_PER_MINUTE;
  if ( milliseconds < RATE_LIMIT ) {
    return RATE_LIMIT
  }
  return milliseconds
}

function scaleToFiveMinutes(ntimes, delay) {
  const FIVE_MINUTES = 5 * 60 * 1000; //milliseconds in five minutes.
  let n = ntimes;
  let estRunTime = n * delay;
  if ( estRunTime > FIVE_MINUTES ) {
    n = Math.floor(FIVE_MINUTES / delay) - 1;
  }
  return n;
}

function numberBasedOnCost(available, cost)  {
  let ntimes = 0;
  if (0 < cost && cost < available) {
    ntimes = Math.floor(available / cost);
  }
  return ntimes;
}

function repeat(fcn, ntimes, delay) {
  if (ntimes > 0) {
    fcn();
    ntimes = ntimes - 1;
    if ((ntimes > 0) && (delay !== undefined)) {
      Utilities.sleep(delay);
    }
    repeat(fcn, ntimes, delay);
  }
}
