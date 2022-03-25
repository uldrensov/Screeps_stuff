## READ FIRST: ##
Because the whole point of playing Screeps is to learn and to have a fun outlet for programming, I've elected to make my personal codebase open-source. This repository serves to document and demonstrate my own methodology for playing Screeps, for which there are thousands of different possible ways to have a crack at. Here I will assume that the reader is already familiar with how to play the game (at least, at a basic level), and it is my hope that this reader might learn something from my code which may spark new/interesting ideas for his/her own implementation.

### What my code does well: ###
* Runs at least 9 rooms simultaneously (assuming at least ~6 creeps per room) without straining the 20 CPU limit
* Automatically responds to threats encountered during remote mining (fleeing, counter-attacking, reclaiming, etc.)
* Includes scripts that alleviate the stress of macromanaging economy (status reports, transferring resources)
### What it does poorly: ###
* Does very little in terms of starting and nurturing newly-annexed rooms (a lot of manual decision-making is required)
* Aggressive/militant combat
* Defensive towers are not "smart" enough to choose targets wisely

Anyone is welcome to clone this repository and run it themselves. But of course, if your goal is to simply copy-paste a working repository into your own account as a substitute for playing the game legitimately, let it be known that there are better and more user-friendly "prepackaged" codebases out there, so I'm honoured if you're choosing to copy mine in spite of that (no hard feelings).

## Overview of files: ##
### Core files: ###
--These are files without .AI or .exe in their name--

* main.js is called once per game tick; it acts as an infinite while-loop
* SOFTDATA.js is a library containing various constants, parameters, and essential object IDs; this should be uniquely configured according to the user's needs and preferences [e.g. using my version here will NOT work in your unique situation]
* MEMORYINIT.js initialises global memory
* SPAWNCYCLE.js is called in main, and is responsible for spawning/replacing units until the quota is met
* UNITDRIVE.js is called in main, and is responsible for running each unit type's respective AI script using the proper parameters
* TOWERDRIVE.js is called in main, and is responsible for controlling defensive towers in each room
* ECONDRIVE.js is called in main, and is responsible for automating certain economic actions in each (suitable) room
### .AI files: ###
--Each .AI file corresponds to a single unit role--
--For simplicity's sake, I will only describe the bare essentials here--

* Drone: Supplies spawners and extensions with energy
* Assimilator: Mines energy and dumps it into nearby container for other units to retrieve at their convenience
* Energiser: Supplies towers with energy
* Sacrificer: Supplies the room's controller with energy
* Probe: Consumes energy to repair decaying structures
* Architect: Consumes energy to build new structures
* Visionary: Paths into a new room and annexes it into the colony
### .exe files: ###
--These files are designed as tools to be manually executed through the console--

* STATUSREPORT.exe.js writes a summary report to console output of any chosen room
* STATUSREPORT_E.exe.js writes a condensed summary report about the Storage/Terminal contents of every room
* TERMINALTRANSFER.exe.js spawns in a 'Treasurer' unit to carry materials (any amount, any type) between Storage and Terminal for a chosen room
* CIRCULATE.exe.js transfers goods between owned terminals
* TRANSACTION.exe.js attempts to sell a room's minerals (any amount) through the in-game market, one trade offer at a time
## Usage: ##
### Setup: ###
TBD
### Adding new rooms: ###
* In SOFTDATA.js, increase the [roomcount] property by 1
* Modify the object ID arrays by adding new data pertaining to the newly annexed room
* Expand each of the unit body-part 2D-arrays by 1 element, and populate them with the desired role-based body part configurations
### Maintenance: ###
* Unit spawns, deaths, and other important events are recorded to the console; check it from time to time
* To increase/decrease the population quota for certain roles (in a certain room), modify the appropriate [role_MAX] variable in global memory
* More coming soon...
### Notifications: ###
--Email notifications are enabled for the following:

* Armed enemy unit spotted in a room containing defensive towers
* Contents within a vault are about to overflow (surplus)
* Energy capacity within a vault is about to run out (shortage)
