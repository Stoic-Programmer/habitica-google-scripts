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
    if (header.remaining <= 1) {
      console.warn("Reached rate limit.  Pausing until: " + header.reset);
      let now = new Date();
      let delay = header.reset.getMilliseconds() - now.getMilliseconds() + 2000;
      Utilities.sleep(delay);
    }
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

      if (result.data.armoire.type === "food") {
        Logger.log("You gained " + result.data.armoire.dropText + ".")
      } else {
        Logger.log("You gained " + result.data.armoire.value + " " + result.data.armoire.type + ".")
      }
    },

    cast: function (skill) {
      let response = castSkill(skill);

      return response;
    },

    rateLimits: function () {
      return buildHeader(lastResponse);
    }
  }
}());


function testUserStats() {
  let limits = PLAYER.rateLimits();
  Logger.log("code=" + limits.code + ", limit=" + limits.limit + ", remain=" + limits.remain + ", resetTime=" + limits.untilReset);

  let response = PLAYER.stats();
  limits = PLAYER.rateLimits();
  Logger.log("code=" + limits.code + ", limit=" + limits.limit + ", remain=" + limits.remain + ", resetTime=" + limits.untilReset);
}