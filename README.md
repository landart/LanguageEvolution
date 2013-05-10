LanguageEvolution
=================

An agent-based simulation of language evolution.

Rules:

* Each turn, each agent puts a name to one unclassified item nearby.
* When naming or renaming an item, the agent is its "owner".
* There is a 20% chance that another agent renames an "owned" item (neologism).
* The agents move randomly every clock tick, no matter what they do.
* When an agent meets another, the former mixes its dictionary with the latter's:
 * The receiver's dictionary fills its gaps with the other agent's.
 * If both have named an item, there is a 20% (possession) of adoption if the reciver is the "owner", 70% (neologism) if it is the other agent, and 40% (conservative) otherwise.
* Finally, the simulation should converge when all the agents have discovered all the items and agreed upon their names.

The Kraken:

The "Kraken" is a foreigner agent that causes chaos, destabilizing the system. Once all agents have agreed upon their dictionaries and the simulation has converged, you will be presented with a link to release the Kraken. Its behavior is simple:

* Once each turn, take an item randomly and change its name.
* If there are other agents in its range, it confuses them by replacing randomly each item in its dictionary with another random name with a 20% probability.
* The Kraken moves twice as fast as an agent and is range is almost double (5 cells Vs. 3).


