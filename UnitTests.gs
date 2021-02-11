const myFunction = (function() {
  let count = 0;
  return function() {
    count = count + 1;
    console.log("Execution: "+count);
  };
})();


function testRepeat() {
  console.log("Starting Test..." + new Date() );
  repeat(3, myFunction);
  console.log("Ending Test..." + new Date());
}

function testExecuteThenDelay() {
  let runThis = function() { return executeThenDelay( 2000, myFunction) };
  console.log("Starting Test..." + new Date() );
  runThis();
  console.log("Ending Test..." + new Date());
}

function testRepeatWithDelay() {
  let execWithDelay = function() { executeThenDelay( 2000, myFunction) };
  let repeatWithDelay = function() { return repeat( 3, execWithDelay); };
  
  console.log("Starting Test..." + new Date() );
  repeatWithDelay();
  console.log("Ending Test..." + new Date());
}

