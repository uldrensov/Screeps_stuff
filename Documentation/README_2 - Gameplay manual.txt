## Code usage and gameplay guide: ##

### Room setup guidelines: ###
--While not *strictly* required to follow these steps, this is the optimal setup around which the code is designed--
1. The first Spawner should ideally be placed within proximity of either A) BOTH Sources, or B) one Source and the Controller. This location effectively functions as the heart of the base.
    1. When placing subsequent Spawners (including the Power Spawner), place them within reasonable proximity of one another, while also ensuring that there is no possible 5x5 space which can encapsulate more than 2 Spawners at once. This will prevent death from a single nuclear strike.
2. Designate a wide open space (does not need to be nearby) to accomodate all Extensions (total of 60 once RCL 8 is reached). Ideally, all Extensions should be accessible throughout a compressed "circuit" layout, with no/minimal dead ends or irregular pathing branches. The Drone unit is expected to traverse this circuit.
3. All facilities throughout the room should be connected to a central Road network. Roads should be built along the shortest paths between commonly-accessed facilities, and additional pathing branches should also be built in high-activity areas, to function as traffic detours.
4. Towers should be placed near the heart of the base. At RCL 8, all 6 towers should be arranged in such a way that they surround a single tile. The Energiser unit is expected to occupy this tile.
5. Place the Storage near the heart of the base. Ensure that the immediate 3x3 area around its location is vacant, but ideally, ensure that the entire 5x5 area around its location is also vacant.
    1. If the Storage is far from one of the Sources, replace the Assimilator unit stationed at that Source with an Acolyte unit, and pair this Acolyte with an Adherent unit.
    2. If the Storage is far from the Controller, replace the Supplicant unit with a Null Supplicant unit, and pair this Null Supplicant with a Null Adherent unit.
6. If using Acolytes, Adherents, Null Supplicants, or Null Adherents, it is required to construct Links. Links need to be placed in such a way that ensures no extraneous movement required on behalf of the units which attend to them.
    1. For example, a Null Supplicant can interact with a Controller up to 3 tiles away (7x7 range). The Null Supplicant should be able to stand somewhere within range of the Controller, while also being able to reach the Link without moving from that spot.
7. Walls should be built far enough outward so that hostile ranged attackers cannot shoot anything of value from over the Wall (7x7 range). However, Walls should be situated close enough inward so that repair efforts are as efficient as possible.
    1. On the inner side, there should be Road paths for Probe units to easily access and repair (7x7 range) every section of the Wall.
    2. Diagonal "stair" shaped walls are OK, as long as there are no corner-gaps.
8. Ramparts should be deployed to protect important Structures, such as Spawners, Towers, and the Storage. Ramparts should also be used as "doors", so that friendly units may enter and exit the Wall perimeter.
9. Terminal/Factory/Nuker Structures should ideally be placed exactly 1 space away from the Storage. The Treasurer unit is expected to occupy these single-space gaps.
10. The Observer can be placed virtually anywhere, as long as it is not vulnerable to ranged attacks.

### Adding new rooms: ###
* Modify the object ID arrays by adding new data pertaining to the newly annexed room
* Expand each of the unit body-part 2D-arrays by 1 element, and populate them with the desired role-based body part configurations
* More info coming soon...

### Adding new remote (long-distance) mining outposts: ###
* In SET_SOFTDATA.js, add the desired Source ID (from the remote room) to the remoteSource_id array, and the remote room's Controller ID to the remoteCtrl_id array
* Place two pathing/rally flags in the remote room: one for the Source, and one for the Controller
* In SET_SOFTDATA.js, add these flags' names (format: Game.flags['NAME']) to the remote_flag and reserve_flag arrays, respectively
* In-game, set the orbitalAssimilator_MAX, orbitalDrone_MAX, and recalibrator_MAX arrays' nth element to 1, where n is the number of the room they shall spawn from

### Maintenance info: ###
* Unit spawns, deaths, and other important events are recorded to the console; check it from time to time
* To increase/decrease the population quota for certain roles (in a certain room), modify the appropriate [role_MAX] variable in global memory
* More info coming soon...

### Notification setup: ###
--Email notifications can be enabled for the following:

* Daily net gain/loss of credits and pixels
* Armed enemy players spotted in owned / reserved territory
* Enemy nuclear attacks detected