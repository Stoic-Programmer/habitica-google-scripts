/**
  Copyright 2020 by Nicholas R Ustick
  
  Define a user of Habitica.
*/
const PLAYER = (function() {
  const scriptProperties = PropertiesService.getScriptProperties();
  const USER_ID = scriptProperties.getProperty("apiUser");
  const API_TOKEN = scriptProperties.getProperty("apiToken"); // Do not share this to anyone

  let lastResponse;

  function request( type, supressException ) {
    return {
      "method" : type,
      "headers" : {
        "x-api-user" : USER_ID,
        "x-api-key" : API_TOKEN,
        "x-client" : USER_ID+"-Test"
      }
    };
  }

  function callHabitica( url, request ) {
    lastResponse =  UrlFetchApp.fetch(url, request);
    return lastResponse;
  }

  function queryUser() {
    const url = "https://habitica.com/api/v3/user/anonymized";
    return callHabitica(url, request("get"));
  }
  
  function purchaseArmorie() {
    const url = "https://habitica.com/api/v3/user/buy-armoire"
    return callHabitica(url, request("post"));
  }  
  
  function castSkill( skill ) {
     const url = "https://habitica.com/api/v3/user/class/cast/" + skill 
    return callHabitica(url, request("post"));
  }

  return {
   stats: function () {
      let response = queryUser();
      let result = JSON.parse(response);
      return result.data.user.stats;
    },


    buyArmoire: function () {
      let response = purchaseArmorie();
      let result = JSON.parse(response);
      
      if (result.data.armoire.type === "food") {
        Logger.log("You gained " + result.data.armoire.dropText + ".")
      } else {
        Logger.log("You gained " + result.data.armoire.value + " " + result.data.armoire.type + ".")
      }
    },
    
    cast: function( skill ) {
      let response = castSkill(skill);
      return response;
    },
    
    rateLimits: function() {
      if (lastResponse === undefined) {
         return {
        }
      }
      let headers = lastResponse.getHeaders();
      return {
        limit : headers['x-ratelimit-limit'], 
        remain : headers['x-ratelimit-remaining'],
        untilReset : headers['x-ratelimit-reset'],
        code : lastResponse.getResponseCode()
      }
    }
  }
}());
 

function testUserStats() {
  let limits = PLAYER.rateLimits();
  Logger.log("code="+limits.code+", limit="+limits.limit+", remain="+limits.remain+", resetTime="+limits.untilReset);

  let response = PLAYER.stats();
  limits = PLAYER.rateLimits();
  Logger.log("code="+limits.code+", limit="+limits.limit+", remain="+limits.remain+", resetTime="+limits.untilReset);
}