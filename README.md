# READ FIRST:
If you are a complete stranger to Screeps, and are just here to casually check things out, I suggest scrolling to the bottom first so you can get a solid visual of what everything looks like when it's running.

## INTRO:
Because the whole point of playing Screeps is to learn and to have a fun outlet for programming, I've elected to make my personal codebase open-source. This repository serves to document and demonstrate my own methodology for playing Screeps, for which there are thousands of different possible ways to have a crack at. Here I will assume that the reader is already familiar with how to play the game (at least, at a basic level), and it is my hope that this reader might learn something from my code which may spark new/interesting ideas for his/her own implementation.
### What my code does well:
* Runs at least 9 rooms simultaneously (assuming at least ~6 creeps per room) without straining the 20 CPU limit
* Automatically responds to threats encountered during remote mining (fleeing, counter-attacking, reclaiming, etc.)
* Includes scripts that alleviate the stress of macromanaging economy (status reports, transferring resources)
### What it does poorly:
* Does very little in terms of starting and nurturing newly-annexed rooms (a lot of manual decision-making is required)
* Aggressive/militant combat
* Defensive towers are not "smart" enough to choose targets wisely

Anyone is welcome to clone this repository and run it themselves. But of course, if your goal is to simply copy-paste a working repository into your own account as a substitute for playing the game legitimately, let it be known that there are better and more user-friendly "prepackaged" codebases out there, so I'm honoured if you're choosing to copy mine in spite of that (no hard feelings).

## Overview of files:
### Core files:
--These are files without .AI or .exe in their name--
* main.js is called once per game tick; it acts as an infinite while-loop
* SOFTDATA.js is a library containing various constants, parameters, and essential object IDs; this should be uniquely configured according to the user's needs and preferences [e.g. using my version here will NOT work in your unique situation]
* MEMORYINIT.js initialises global memory
* SPAWNCYCLE.js is called in main, and is responsible for spawning/replacing units until the quota is met
* UNITDRIVE.js is called in main, and is responsible for running each unit type's respective AI script using the proper parameters
* TOWERDRIVE.js is called in main, and is responsible for controlling defensive towers in each room
* ECONDRIVE.js is called in main, and is responsible for automating certain economic actions in each (suitable) room

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
* STATUSREPORT_E.exe.js writes a condensed summary report about the Storage/Terminal contents of every room
* TERMINALTRANSFER.exe.js spawns in a 'Treasurer' unit to carry materials (any amount, any type) between Storage and Terminal for a chosen room
* CIRCULATE.exe.js transfers goods between owned terminals
* TRANSACTION.exe.js attempts to sell a room's minerals (any amount) through the in-game market, one trade offer at a time

## Usage:
### Setup:
TBD

### Adding new rooms:
* In SOFTDATA.js, increase the [roomcount] property by 1
* Modify the object ID arrays by adding new data pertaining to the newly annexed room
* Expand each of the unit body-part 2D-arrays by 1 element, and populate them with the desired role-based body part configurations

### Maintenance:
* Unit spawns, deaths, and other important events are recorded to the console; check it from time to time
* To increase/decrease the population quota for certain roles (in a certain room), modify the appropriate [role_MAX] variable in global memory
* More coming soon...

### Notifications:
--Email notifications are enabled for the following:
* Armed enemy unit spotted in a room containing defensive towers
* Contents within a vault are about to overflow (surplus)
* Energy capacity within a vault is about to run out (shortage)

## Visual example
![Example screenshot of an in-game room](https://github.com/uldrensov/Screeps_stuff/blob/master/room_example.png?raw=true)
* (1) This is an [energy node]. Without energy, most units and facilities cannot operate. This is essentially a room-wide "currency" that determines how well one can maintain and operate within a room. In order for energy to be used, a unit must harvest from the energy node.
* (2) This is an [assimilator] unit. Its sole purpose is to harvest from energy nodes and deposit revenue into a small bin underneath where it is standing. This room has 2 energy nodes, therefore it has 2 assimilators.
* (3) This is the [vault], basically the room's main storage receptacle. It can hold a very large amount of energy, if something were to fill it with energy.
* (4) This is a [spawner], the most important structure in the room. In this room, there are 3. Spawners are responsible for continually generating units (such as the assimilator) to do work in the room. Since all units have timed life, the spawners can never rest. Energy is required to spawn units, however, a spawner can very slowly generate a little bit of energy for free.
* (5) These are called [extensions]. Units with many "body parts" are generally more efficient at their work (e.g. an assimilator with twice as many "arms" can harvest faster), but they cost more energy to spawn. The energy stored within extensions essentially functions as a "wallet" in terms of spawning. The more extensions are full, the more energy is visible and usable to the spawner structures.
* (6) This is a [drone] unit. Drones go hand-in-hand with assimilators. If an assimilator's job is to harvest energy and drop it into a bucket, the drone's job is to haul the contents of said bucket into the room's extensions, or if those are full, the room's central vault.
* (7) This is an [energiser] unit. Energisers exist to keep the turrets charged with energy. The energiser shown here will periodically path to the nearby energy vault, fill its pockets, then move back to its currently shown position so that it sits within adjacent reach of all 6 turrets.  
* (7a) The turrets are vital to the room's successful operation. They serve 3 functions: shooting trespassers (to kill them), shooting allies (to heal them), or shooting allied structures (to repair them). Most structures decay over time, and require consistent repairs.
In this snapshot, the turrets are attempting to repair the bucket at an assimilator's feet.
* (8) This is a [supplicant] unit. Supplicants dump energy into the room's "controller" (AKA the octagon-like object on the left). Feeding the controller is similar to paying "rent"; a user risks losing ownership of the room if the controller remains unattended for too long.
The supplicant shown here does not procure energy out of nowhere. It withdraws the necessary amount from the diamond-shaped object on the right, called a "link".  
* (8a) The link is essentially a transportation and storage receptacle; energy can be stored in one link, transferred to another one in the same room,
then withdrawn. This particular link is on the receiving end.
* (9) This is an [adherent] unit. The adherent goes hand-in-hand with the supplicant, since its primary role is to take energy from the vault and use it to fill the
nearby link. Once the link is full, the adherent commands it to transfer its contents to the other link (near the supplicant, towards the left).
* (10) This transparent green tile is a [rampart]. Ramparts are like walls, except allied units can walk right through them. Additionally, allied structures can be built right on top of a rampart. These effectively serve as defensive barriers; they keep enemies from walking through your entrances/exits, and can
protect important structures that occupy the same tile.
