/**
  Copyright 2020 by Nicholas R Ustick
  
  Buff up the party.  Goal is to add a bit of smarts such that in the event the player rerolls with an "Orb of Rebirth" this script
  will change to use the appropriate set of skills based upon class level and mana available.
  
  WIP
*/
function schedulePartyBuff() {
  /**
    Skills found on:  https://habitica.fandom.com/wiki/Skills
   */
  const skills = [
    { name: "heal", character: "Healer", description: "Healing Light", cost: 15, target: "Player", level: 11, effect: "You gain a boost to your health." },
    { name: "brightness", character: "Healer", description: "Searing Brightness", cost: 15, target: "Player", level: 12, effect: "our tasks become more blue/less red." },
    { name: "protectAura", character: "Healer", description: "Protective Aura", cost: 30, target: "Party", level: 13, effect: "Party gains a buff to CON." },
    { name: "blessing", character: "Healer", description: "Blessing", cost: 25, target: "Party", level: 14, effect: "Your whole party regains health." },

    { name: "fireball", character: "Mage", description: "Burst of Flames", cost: 10, target: "Task", level: 11, effect: "You gain XP and deal extra damage to bosses." },
    { name: "mpheal", character: "Mage", description: "Ethereal Surge", cost: 30, target: "Party", level: 12, effect: "The rest of your party (except other mages) gains MP." },
    { name: "earth", character: "Mage", description: "Earthquake", cost: 35, target: "Party", level: 13, effect: "Party gains a buff to INT." },
    { name: "frost", character: "Mage", description: "Chilling Frost", cost: 40, target: "Player", level: 14, effect: "Uncompleted Dailies' streaks won't reset to zero after Cron." },

    { name: "pickPocket", character: "Rogue", description: "Pickpocket", cost: 10, target: "Task", level: 11, effect: "You gain gold." },
    { name: "backStab", character: "Rogue", description: "Backstab", cost: 15, target: "Task", level: 12, effect: "You gain gold and XP." },
    { name: "toolsOfTrade", character: "Rogue", description: "Tools of the Trade", cost: 25, target: "Party", level: 13, effect: "Party gains a buff to PER" },
    { name: "stealth", character: "Rogue", description: "Stealth", cost: 45, target: "Player", level: 14, effect: "Some unticked Dailies are ignored by Cron." },

    { name: "smash", character: "Warrior", description: "Brutal Smash", cost: 10, target: "Task", level: 11, effect: "You damage a boss, task becomes more blue / less red." },
    { name: "defensiveStance", character: "Warrior", description: "Defensive Stance", cost: 25, target: "Player", level: 12, effect: "You gain a buff to CON." },
    { name: "valorousPresence", character: "Warrior", description: "Valorous Presence", cost: 20, target: "Party", level: 13, effect: "Party gains a buff to STR." },
    { name: "intimidate", character: "Warrior", description: "Intimidating Gaze", cost: 15, target: "Party", level: 14, effect: "Party gains a buff" },

    { name: "snowball", character: "Transform", description: "Snowball" },
    { name: "spookySparkles", character: "Transform", description: "Spooky Sparkles" },
    { name: "seafoam", character: "Transform", description: "Seafoam" },
    { name: "shinySeed", character: "Transform", description: "Shiny Seed" }
  ];


  const protect = {
    name: "protectAura",
    character: "Healer",
    description: "Protective Aura",
    cost: 30,
    target: "Party",
    level: 13,
    effect: "Party gains a buff to CON."
  };

  const healAll = {
    name: "healAll",
    character: "Healer",
    description: "Blessing",
    cost: 25,
    target: "Party",
    level: 14,
    effect: "Your whole party regains health."
  };

  const fireball = { name: "fireball", character: "Mage", description: "Burst of Flames", cost: 10, target: "Task", level: 11, effect: "You gain XP and deal extra damage to bosses." };
  const healMana = { name: "mpheal", character: "Mage", description: "Ethereal Surge", cost: 30, target: "Party", level: 12, effect: "The rest of your party (except other mages) gains MP." };
  const buffINT = { name: "earth", character: "Mage", description: "Earthquake", cost: 35, target: "Party", level: 13, effect: "Party gains a buff to INT." }


  let mana = Math.floor(PLAYER.stats().mp);

  const healPartyMana = function () { return PLAYER.cast(healMana.name); };
  if (healPartyMana.cost < mana) {
    console.info("Casting " + healPartyMana.description);
    healPartyMana();
    mana = mana - healPartyMana.cost;
  }

//  let response = PLAYER.quest();

  //const damageBoss = function () { return PLAYER.cast(healMana.name); };
  //if (healPartyMana.cost < mana) {
//    console.info("Casting " + healPartyMana.description);
    //healPartyMana();
    //mana = mana - healPartyMana.cost;
  //}


  const nBuffs = numberBasedOnCost(buffINT.cost, mana);
  const end = futureMillisFromNow(295000);

  const castBuff = function () { return PLAYER.cast(buffINT.name); };
  const castBuffWithTimeLimit = function () { return execute(end, castBuff); };

  console.info("Casting, " + buffINT.description + ", " + nBuffs + " times with available mana(" + mana + "), timeLimit=" + end);
  repeatWithLimit(end, nBuffs, castBuffWithTimeLimit);
}