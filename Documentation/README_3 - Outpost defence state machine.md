## Outpost defence mechanism: ##

### What is an "outpost"? ###
An outpost is a room within your economic network that you've reserved, but haven't formally claimed (i.e. you mine from it without actually incorporating it into your base). Reserving the room allows you to build basic structures in it, and doubles the capacity of all present energy nodes - all without requiring any GCL (Global Control Level) or costing any energy. Since you aren't upgrading the Controller, however, you can't build turrets nor any higher-level structures. This limits how robust your defences can be in an outpost.

### What if your outpost is attacked? ###
Without the usual support of your home base infrastructure, your options are limited. Basically, you can either try to retaliate by sending in military units, or just cut your losses and run. My outpost defence strategy operates on a relatively simple FSM, whose operation is visually depicted in the accompanying file screeps_OutpostImmuneSystem.jpg, found in this directory.

### Terminology: ###
* Invader: Hostile NPC military unit, usually a lone threat but can sometimes appear in hordes (groups of ~5)
* Invader core: Hostile NPC structure that reserves rooms for its own faction (can undo reservations made by the player)
* Enforcer: Defence unit, attacks invader cores
* Purifier: Defence unit, contests the invader core by counter-reserving the room
* Blood hunter: Defence unit, chases and attacks a single hostile unit

### Reading the flowchart diagram: ###
This flowchart makes use of "sequential states" and "parallel states". As described in the legend/key section, sequential states are progressive evolutions of their previous states, while parallel states are more like simultaneous statuses that act somewhat like "modifiers". Following are some examples to help illustrate/explain the FSM behaviour:
* From SAFE, both the ENFORCER: ON and PURIFIER: ON parallel states can be active at once, without overriding SAFE
* Since SAFE is not overridden, the state machine can still transition to NOT SAFE, since SAFE is still technically in effect
* When NOT SAFE is in effect, neither the ENFORCER: ON nor PURIFIER: ON states can activate - this is because NOT SAFE is sequential to SAFE, meaning that SAFE is no longer in effect once NOT SAFE activates
* The ENFORCER: OFF and PURIFIER: OFF states are sequential to their respective ON states, but not sequential to SAFE - meaning that SAFE is still active during any combination of ENFORCER/PURIFIER states (as long as NOT SAFE is not active, since this is sequential to SAFE)
