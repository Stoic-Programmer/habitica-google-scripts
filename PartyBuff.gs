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
    { name: "heal", class: "Healer", description: "Healing Light", cost: 15, target: "Player", level: 11, effect: "You gain a boost to your health." },
    { name: "brightness", class: "Healer", description: "Searing Brightness", cost: 15, target: "Player", level: 12, effect: "our tasks become more blue/less red." },
    { name: "protectAura", class: "Healer", description: "Protective Aura", cost: 30, target: "Party", level: 13, effect: "Party gains a buff to CON." },
    { name: "heallAll", class: "Healer", description: "Blessing", cost: 25, target: "Party", level: 14, effect: "Your whole party regains health." },

    { name: "fireball", class: "Mage", description: "Burst of Flames", cost: 10, target: "Task", level: 11, effect: "You gain XP and deal extra damage to bosses." },
    { name: "mpheal", class: "Mage", description: "Ethereal Surge", cost: 30, target: "Party", level: 12, effect: "The rest of your party (except other mages) gains MP." },
    { name: "earth", class: "Mage", description: "Earthquake", cost: 35, target: "Party", level: 13, effect: "Party gains a buff to INT." },
    { name: "frost", class: "Mage", description: "Chilling Frost", cost: 40, target: "Player", level: 14, effect: "Uncompleted Dailies' streaks won't reset to zero after Cron." },

    { name: "pickPocket", class: "Rogue", description: "Pickpocket", cost: 10, target: "Task", level: 11, effect: "You gain gold." },
    { name: "backStab", class: "Rogue", description: "Backstab", cost: 15, target: "Task", level: 12, effect: "You gain gold and XP." },
    { name: "toolsOfTrade", class: "Rogue", description: "Tools of the Trade", cost: 25, target: "Party", level: 13, effect: "Party gains a buff to PER" },
    { name: "stealth", class: "Rogue", description: "Stealth", cost: 45, target: "Player", level: 14, effect: "Some unticked Dailies are ignored by Cron." },

    { name: "smash", class: "Warrior", description: "Brutal Smash", cost: 10, target: "Task", level: 11, effect: "You damage a boss, task becomes more blue / less red." },
    { name: "defensiveStance", class: "Warrior", description: "Defensive Stance", cost: 25, target: "Player", level: 12, effect: "You gain a buff to CON." },
    { name: "valorousPresence", class: "Warrior", description: "Valorous Presence", cost: 20, target: "Party", level: 13, effect: "Party gains a buff to STR." },
    { name: "intimidate", class: "Warrior", description: "Intimidating Gaze", cost: 15, target: "Party", level: 14, effect: "Party gains a buff" },

    { name: "snowball", class: "Transform", description: "Snowball" },
    { name: "spookySparkles", class: "Transform", description: "Spooky Sparkles" },
    { name: "seafoam", class: "Transform", description: "Seafoam" },
    { name: "shinySeed", class: "Transform", description: "Shiny Seed" }
  ];

  const skill = { name: "toolsOfTrade", class: "Rogue", description: "Tools of the Trade", cost: 25, target: "Party", level: 13, effect: "Party gains a buff to PER" };

  const mana = Math.floor(PLAYER.stats().mp);
  const nBuffs = numberBasedOnCost(skill.cost, mana);

  const end = new Date();
  const stop = end.getTime() + 290000;
  end.setTime(stop);

  PLAYER.setTerminateTime(end);
  const castBuff = function () { return PLAYER.cast(skill.name); };
  const castBuffWithTimeLimit = function () { return execute(stop, castBuff); };

  console.info("Casting, " + skill.description + ", " + nBuffs + " times with available mana(" + mana + "), timeLimit=" + end);
  repeatWithLimit(stop, nBuffs, castBuffWithTimeLimit);
}