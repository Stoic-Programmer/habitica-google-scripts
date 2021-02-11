/**
  Copyright 2020 by Nicholas R Ustick
  
  Define a user of Habitica.
*/
const PLAYER = (function () {
  const scriptProperties = PropertiesService.getScriptProperties();
  const USER_ID = scriptProperties.getProperty("apiUser");
  const API_TOKEN = scriptProperties.getProperty("apiToken"); // Do not share this to anyone
  const AUTHOR_ID = "ebded617-5b88-4f67-9775-6c89ac45014f"; // Rafton on Habitica

  let lastResponse;
  let terminateTime;

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
        "wakeup": "",
        "code": "",
        "data": ""
      };
    }

    let headers = response.getHeaders();
    let content = JSON.parse(response);
    let limit = headers['x-ratelimit-limit'];
    let remain = headers['x-ratelimit-remaining'];
    let wakeupTime = headers['x-ratelimit-reset'];
    let code = response.getResponseCode();
    let wakeupDate = new Date(wakeupTime);
    return {
      "limit": limit,
      "remain": remain,
      "wakeup": wakeupDate,
      "code": code,
      "data": content
    };
  }

  const HEADERS = {
    "x-client": AUTHOR_ID + "-PartyBuff_or_BuyArmorie",
    "x-api-user": USER_ID,
    "x-api-key": API_TOKEN,
  }

  function request(type, supressException) {
    return {
      "method": type,
      "headers": HEADERS
    };
  }

  /**
   * Inspects the responce form the API call and determines we we need to sleep untill the next reset.
   */
  function processResponse(response) {
    header = buildHeader(response);
    if (header.remain < 1) {
      let now = new Date();
      let delay = header.wakeup.getTime() - now.getTime() + 1000;
      let target = new Date(now.getTime() + delay);

      if (terminateTime === undefined || target.getTime() < terminateTime.getTime()) {
         delay = terminateTime - now.getTime() - 500;
         console.warn("Shortening the delay time since we might overrun the Google clock if we delay too long.");
      }
      console.warn("Reached rate limit.  Pausing for : " + delay + "ms, wakeup @ " + header.wakeup);
      Utilities.sleep(delay);
    }
    return header
  }

  function callHabitica(url, request) {
    lastResponse = UrlFetchApp.fetch(url, request);
    processResponse(lastResponse);
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

  function castSkill(skill) {
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
      //      if (result.data.armoire.type === "food") {
      //        console.info("You gained " + result.data.armoire.dropText + ". ");
      //      } else {
      //        console.info("You gained " + result.data.armoire.value + " " + result.data.armoire.type + ".");
      //      }
      return response;
    },

    cast: function (skill) {
      let response = castSkill(skill);
      return response;
    },

    rateLimits: function () {
      return buildHeader(lastResponse);
    },

    setTerminateTime: function (end) {
      terminateTime = end;
    }
  }
}());


function testUserStats() {
  let limits = PLAYER.rateLimits();
  console.log("code=" + limits.code + ", limit=" + limits.limit + ", remain=" + limits.remain + ", resetTime=" + limits.wakeup);

  let response = PLAYER.stats();
  limits = PLAYER.rateLimits();
  console.log("code=" + limits.code + ", limit=" + limits.limit + ", remain=" + limits.remain + ", resetTime=" + limits.wakeup);
}