# Overview of files:
### Core files:
--These are files without .AI or .exe in their name--
* main.js is called once per game tick; it acts as an infinite while-loop
* SOFTDATA.js is a library containing various constants, parameters, and essential object IDs; this should be uniquely configured according to the user's needs and preferences [e.g. using my version here will NOT work in your unique situation]
* MEMORYINIT.js initialises global memory
* SPAWNCYCLE.js is called in main, and is responsible for spawning/replacing units until the quota is met
* UNITDRIVE.js is called in main, and is responsible for running each unit type's respective AI script using the proper parameters
* TOWERDRIVE.js is called in main, and is responsible for controlling defensive towers in each room
* ECONDRIVE.js is called in main, and is responsible for automating a number of economic functions in each suitable room

### .AI files:
--Each .AI file corresponds to a single unit role--
<br/>
--For simplicity's sake, I will only describe the bare essentials here--
* Drone: Supplies spawners and extensions with energy
* Assimilator: Mines energy and dumps it into nearby container for other units to retrieve at their convenience
* Energiser: Supplies towers with energy
* Sacrificer: Supplies the room's controller with energy
* Probe: Consumes energy to repair decaying structures
* Architect: Consumes energy to build new structures
* Visionary: Paths into a new room and annexes it into the colony

### .exe files:
--These files are designed as tools to be manually executed through the console--
* STATUSREPORT.exe.js writes a summary report to console output of any chosen room
* TERMINALTRANSFER.exe.js spawns in a 'Treasurer' unit to carry materials (any amount, any type) between Storage and Terminal for a chosen room
* TRANSACTION.exe.js attempts to sell a room's minerals (any amount) through the in-game market, one trade offer at a time

# Usage:
### Setup:
TBD

### Adding new rooms:
* In SOFTDATA.js, increase the [roomcount] property by 1
* Modify the object ID arrays by adding new data pertaining to the newly annexed room
* Expand each of the unit body part 2D-arrays by 1 element, and populate each with the desired role-based body part configurations

### Maintenance:
* Unit spawns, deaths, and other important events are recorded to the console; check it from time to time
* To increase/decrease the population quota for certain roles (in a certain room), modify the appropriate [role_MAX] variable in global memory
* More coming soon...

### Notifications:
--Email notifications are enabled for the following:
* Armed enemy unit spotted in a room containing defensive towers
* Contents within a vault are about to overflow (surplus)
* Energy capacity within a vault is about to run out (shortage)
