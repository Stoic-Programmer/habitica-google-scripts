const myFunction = (function() {
  let count = 0;
  return function() {
    count = count + 1;
    Logger.log("Execution: "+count);
  };
})();


function testRepeat() {
  Logger.log("Starting Test..." + new Date() );
  repeat(3, myFunction);
  Logger.log("Ending Test..." + new Date());
}

function testExecuteThenDelay() {
  let runThis = function() { return executeThenDelay( 2000, myFunction) };
  Logger.log("Starting Test..." + new Date() );
  runThis();
  Logger.log("Ending Test..." + new Date());
}

function testRepeatWithDelay() {
  let execWithDelay = function() { executeThenDelay( 2000, myFunction) };
  let repeatWithDelay = function() { return repeat( 3, execWithDelay); };
  
  Logger.log("Starting Test..." + new Date() );
  repeatWithDelay();
  Logger.log("Ending Test..." + new Date());
}

