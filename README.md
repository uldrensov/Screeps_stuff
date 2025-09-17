## READ FIRST: ##
This repository serves to document and demonstrate my own methodology for playing and automating Screeps, for which there are thousands of different possible strategies and approaches. All documentation included shall assume that the reader is already familiar with the game on a basic, high-level sense.

### What this code does well: ###
* Features over 20 unique unit roles that synergise with each other, in the effort of maintaining a network of multiple max-level rooms
* Automatically responds to threats encountered inside and outside of home territory, most notably during long-distance mining (fleeing, counter-attacking, reclaiming, etc.)
* Includes scripts that alleviate the stress of macromanaging economy (detailed status reports, automated market transactions, etc.)

### What it does poorly: ###
* Running more than 8(?) rooms without straining the 20 CPU/tick limit (highest load tested = 8 main rooms + 5 long-distance mining rooms)
* Proactive combat
* Mining high-risk resources like Power

Anyone is welcome to clone this repository and run it themselves for demonstration purposes. One might also be tempted to copy all this instead of writing their own code, but I'm not sure I'd recommend that. There's better and more streamlined "prepackaged" codebases out there.

Additional README docs can be found in the ./Documentation directory.