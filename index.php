<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title></title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width">
        
        <link href="css/main.css" type="text/css" rel="stylesheet" />
    </head>
    <body>

        <!-- Add your site or application content here -->
        <div id="results"></div>
        <div id="legend">
          <h3>Rules:</h3>
          <ul>
            <li>Each turn, each agent puts a name to one unclassified item nearby.</li>
            <li>When naming or renaming an item, the agent is its "owner".</li>
            <li>There is a 20% chance that another agent renames an "owned" item (neologism).</li>
            <li>The agents move randomly every clock tick, no matter what they do.</li>
            <li>When an agent meets another, the former mixes its dictionary with the latter's:   
              <ul>
                <li>The receiver's dictionary fills its gaps with the other agent's.</li>  
                <li>If both have named an item, there is a 20% (possession) of adoption if the reciver is the "owner", 70% (neologism) if it is the other agent, and 40% (conservative) otherwise.</li>
              </ul>
            </li>
            <li>Finally, the simulation should converge when all the agents have discovered all the items and agreed upon their names.</li>
          </ul>
        </div>
        <div id="canvas"></canvas>       

        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
        <script>window.jQuery || document.write('<script src="js/vendor/jquery-1.9.1.min.js"><\/script>')</script>
        <script src="js/lib/Class-0.0.2.min.js"></script>
        <script src="js/helper.js"></script>
        <script src="js/world.js"></script>
        <script src="js/item.js"></script>
        <script src="js/agentbehavior.js"></script>
        <script src="js/agent.js"></script>
        <script src="js/simulation.js"></script>

    </body>
</html>