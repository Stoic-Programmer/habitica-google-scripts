# habitica-google-scripts
A collection of scripts used for the online habit tracking tool, Habitica.

[Habitica](https://habitica.com/) is an online and mobile application for tracking and managing habits.  It is done in a way that gameifies the building of good habbits and removal of bad habbits.

[Habitica has a public API](https://habitica.com/apidoc/) that allows players to automate some of the activities surounding the game/application.  This is my collection of scripts that are run on the Goolge App Scripts platform.

I create one Google Apps Scripts "Project" that I called "Habitica" and dumped all my scripts I use for habitica into there.  Most of the scripts or ideas for the scripts originated from a collection of [Google Apps Scripts](https://habitica.fandom.com/wiki/Google_Apps_Script) available on the Habitica wiki. I am in the process of streamlining the scripts to work better for my purposes as a Habitica user.

To make it work on Google Apps Scripts you will need to edit the Project Properties and add properties unter the "ScriptProperties" tab:
- _appURL_ : The google script published web app URL.  This is the Webhook callback that Habitica will call.  AutoQuest.qs has instrictions on setup.
- _apiToken_ : Set this to the value of your Habitica API token which can be taken from your Habitica Profile's settings page on the API tab.
- _apiUser_ : Set this to the value of your Habitica User token.  Also found on your Habitica Profile's settings page on the API tab.
- _toUserId_ : user to which the AutoQuest.gs script will send an email if enabled.

_List of scripts_

- Utility.gs : A collection of utility functions I use in some of the other scripts.
- Player.gs : Defines a PLAYER object that has functions that can be called from other scripts.  This basically hides some of the critical API user and token values in a closure.
- BuyArmorie.gs : Provides a function that can be scheduled periodically to see if a number of Armorie can be purchased. (Depends on the Utility.gs and Player.gs scripts)
- PartyBuff.gs : Provides a function that can be scheduled periodically to cast buffs for the party up to the available amount of mana. (Depends on the Utility.gs and Player.gs scripts)

- AutoQuest.gs : Automatically accepts quest invites as they occure.  And can message the player when a quest completes.  Mostly untouched and based upon [_Faster Auto Accept Quests and Auto Notify on Quest End_](https://raw.githubusercontent.com/elrgarcia/Habitica-Faster-Auto-Accept-Quests-and-Auto-Notify-on-Quest-End/master/Code.txt)
