## READ FIRST: ##
Because the whole point of playing Screeps is to learn and to have a fun outlet for programming, I've elected to make my personal codebase open-source. This repository serves to document and demonstrate my own methodology for playing Screeps, for which there are thousands of different possible ways to take a crack at. Here I will assume that the reader is already familiar with how to play the game (at least, at a basic level). It is therefore my hope that the reader may learn something from my personal method(s) of approach, possibly sparking new ideas for their own implementation.

### What my code does well: ###
* Features over 20 unique unit roles that synergise with each other, in the effort of maintaining a network of multiple max-level rooms
* Automatically responds to threats encountered inside and outside of home territory, most notably during long-distance mining (fleeing, counter-attacking, reclaiming, etc.)
* Includes scripts that alleviate the stress of macromanaging economy (detailed status reports, automated market transactions, etc.)
### What it does poorly: ###
* Running more than 6-7 rooms without straining the 20 CPU/tick limit
* Proactive combat
* Mining high-risk resources like Power

Anyone is welcome to clone this repository and run it themselves for demonstration purposes. In contrast, if your goal is to simply copy-paste a functioning codebase into your own account as a substitute for playing the game legitimately, let it be known that there are better and more streamlined "prepackaged" codebases out there. Copy at your own risk.

## Overview of files: ##
### Core files: ###
--These are files without .AI or .exe in their name--

* main.js is called once per game tick; as the name implies, this is the main script that runs on repeat
* SOFTDATA.js is a library containing various constants, parameters, and essential object IDs; this should be uniquely configured according to the user's needs and preferences [e.g. using my file with my personal settings will break your game]
* MEMORYINIT.js initialises global memory, and is periodically looped to maintain configuration standards in case of corruption
* SPAWNCYCLE.js is called in main, and is responsible for spawning all units to meet the needs of the population quota
* UNITDRIVE.js is called in main, and is responsible for running each unit type's respective AI script using the proper parameters
* TOWERDRIVE.js is called in main, and is responsible for controlling defensive Towers in each room
* ECONDRIVE.js is called in main, and is responsible for automating economic actions in rooms that have certain settings enabled
### .AI files: ###
--Each .AI file corresponds to a single unit role--
--For simplicity's sake, I will only describe a few--

* Drone: Supplies Spawners, Extensions, and the Storage with Energy
* Assimilator: Mines Energy and dumps it into nearby Container
* Energiser: Supplies Towers with Energy
* Sacrificer: Supplies the room's Controller with Energy
* Probe: Consumes Energy to repair decaying Structures
* Architect: Consumes Energy to build new Structures
* Visionary: Paths into a new room and annexes it
* Specialist: Self-sufficient construction unit designed to travel distances and perform orders in wild territory
* Orbital drone: Intelligent unit armed with various sensors and alarm permissions. Carries Energy home from a long-distance mining site.
* Blood hunter: Appears in response to a raised alarm, and attempts to purge whatever threat caused it
### .exe files: ###
--These files are designed as tools which can be manually executed through the console--

* STATUSREPORT.exe.js writes a detailed summary report about a single chosen room
* STATUSREPORT_E.exe.js writes a condensed summary report about the Storage/Terminal contents of every room
* STATUSREPORT_R.exe.js writes a summary report about every long-distance mining site, including time trackers for recently detected threats
* STATUSREPORT_T.exe.js writes a summary report about overall CPU/tick performance data, measured at various breakpoints throughout code execution
* TERMINALTRANSFER.exe.js spawns in a 'Treasurer' unit to carry items (any amount, any type) between Storage and Terminal/Power Spawn/Nuker in a single chosen room
* CIRCULATE.exe.js transfers goods (any amount, any type) between two chosen rooms via Terminal
* TRANSACTION.exe.js uses the Terminal of a chosen room to buy or sell resources (any amount, any type) through the in-game market
* ENERGYVENT.exe.js uses the Terminal of a chosen room to sell Energy (any amount) through the in-game market
## Usage: ##
### Setup: ###
More info coming soon...
### Adding new rooms: ###
* Modify the object ID arrays by adding new data pertaining to the newly annexed room
* Expand each of the unit body-part 2D-arrays by 1 element, and populate them with the desired role-based body part configurations
* More info coming soon...
### Maintenance: ###
* Unit spawns, deaths, and other important events are recorded to the console; check it from time to time
* To increase/decrease the population quota for certain roles (in a certain room), modify the appropriate [role_MAX] variable in global memory
* More info coming soon...
### Notifications: ###
--Email notifications can be enabled for the following:

* Armed enemy unit spotted in a room containing defensive Towers
* Contents within a Storage are about to overflow (surplus)
* Energy capacity within a Storage is about to run out (shortage)
* Threat sightings in long-distance mining sites
