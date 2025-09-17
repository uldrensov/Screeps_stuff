## Overview of code files: ##

### Core files: ###
--These are files without .AI or .exe in their name--

* main.js is called once per game tick; as the name implies, this is the main script that runs on repeat
* SET_SOFTDATA.js is a library containing various constants, parameters, and essential object IDs; this should be uniquely configured according to the user's needs and preferences [e.g. using my file with my personal settings will break your game]
* SET_MEMORYINIT.js initialises global memory, and is periodically looped to maintain configuration standards in case of corruption
* DRIVE_RESPONSES runs checks for dangerous events, and executes the appropriate response in the event that action is required
* DRIVE_DAILIES.js executes certain actions once per day (e.g. logging certain data points, sending certain notifications)
* DRIVE_SPAWN.js is responsible for spawning all units and meeting the needs of the population quota
* DRIVE_UNITS.js runs every unit's respective AI script based on their role, using the proper parameters where needed
* DRIVE_TOWERS.js controls defensive Towers in each room
* DRIVE_ECON.js automates economic actions in rooms that have certain settings enabled

### .AI files: ###
--Each .AI file corresponds to a specific unit role--  
--(For simplicity's sake, I will only describe a few)--

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
--These files are designed as tools which can be manually executed through the in-game console/terminal--

* STATUSREPORT.exe.js writes a detailed summary report about a single chosen room
* STATUSREPORT_E.exe.js writes a condensed summary report about the Storage/Terminal contents of every room
* STATUSREPORT_R.exe.js writes a summary report about every long-distance mining site, including time trackers for recently detected threats
* STATUSREPORT_T.exe.js writes a summary report about overall CPU/tick performance data, measured at various breakpoints throughout code execution
* TRANSFER_INROOM.exe.js spawns in a 'Treasurer' unit to carry items (any amount, any type) between Storage and Terminal/Power Spawn/Nuker in a single chosen room
* TRANSFER_CROSSROOM.exe.js transfers goods (any amount, any type) between two chosen rooms via Terminal
* TRADE_RESOURCE.exe.js uses the Terminal of a chosen room to buy or sell resources (any amount, any type) through the in-game market
* TRADE_ENERGY.exe.js uses the Terminal of a chosen room to sell Energy (any amount) through the in-game market