/**
  Copyright 2020 by Nicholas R Ustick
*/

function futureMillisFromNow(millis) {
  const now = new Date();
  const future = now.getTime() + millis;
  return new Date(future);
}

function numberBasedOnCost(cost, available) {
  let items = 0;

  if (cost !== undefined &&
    available !== undefined &&
    (0 < available) && (0 < cost) &&
    (cost <= available)) {

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
  if (stop.getTime() > now.getTime()) {
    targetFunc();
  }
  else {
    console.warn("execute stoped.  Time limit reached.  stop="+stop+", now="+now);
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
    if (stop.getTime() > now.getTime()) {
      repeatWithLimit(stop, n, targetFunc);
    }
    else {
      console.warn("Reached runtime limits. Ending script. stop=" + stop + ", now=" + now + ",  remaining iterations=" + n);
    }
  }
}
