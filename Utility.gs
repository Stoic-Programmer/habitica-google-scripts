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

function numberBasedOnCost(cost, available) {
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

function execute(stop, targetFunc) {
  let now = new Date();
  if (stop > now.getMilliseconds()) {
    targetFunc();
  }
}

function repeat(n, targetFunc) {
  if (n > 0) {
    targetFunc();
    --n;
    repeat(n, targetFunc);
  }
}

function repeatWithLimit(stop, n, targetFunc) {
  if (n > 0) {
    targetFunc();
    --n;
    let now = new Date();
    if (stop > now.getMilliseconds()) {
      repeatWithLimit(stop, n, targetFunc);
    }
    else {
      Logger.log("Reached runtime limits.  number remaining: " + n)
    }
  }
}

/**
 * Fetches the ratelimit data from the response and puts
 * it into an opbject for further processing.  The
 * rate limit data tells us if we need to stop processing and
 * wait a short bit before sending again.
 */
function buildHeader(response) {
  if (response === undefined) {
    return {
      "limit": "",
      "remain": "",
      "resetTime": "",
      "code": "",
      "result": ""
    };
  }

  let headers = response.getHeaders();
  let content = JSON.parse(response);
  let limit = headers['x-ratelimit-limit'];
  let remain = headers['x-ratelimit-remaining'];
  let resetTime = headers['x-ratelimit-reset'];
  let code = response.getResponseCode();
  return {
    "limit": limit,
    "remain": remain,
    "resetTime": resetTime,
    "code": code,
    "result": content
  };
}

