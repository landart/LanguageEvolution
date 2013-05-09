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
            <li>Each agent puts a name to the unclassified items nearby.</li>
            <li>When an agent puts a name to an item previously classified by another one, the former will name it when it is close again.</li>
            <li>The agents move randomly every clock tick, no matter what.</li>
            <li>When an agent meets another, the former asks the latter for its dictionary, which uses to fill its gaps. If the latter had different values for items than the latter had already classified, there is a chance of 20% that it will accept it as a neologism.</li>
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