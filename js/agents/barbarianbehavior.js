var BarbarianBehavior = {

  name: 'Barbarian',
  range: 5,
  criticism: 0.8, // barbarians have made their minds before invading 
  karma: 0.8, 
  defaultColor: 'hsl(0, 90%, 40%)',
  canChangeLanguage: false,
  randomDictionary: true,
  
  behave: function (agent) {
    agent.randomMoveFromDirection('right');
    
    if (agent.hasReachedBorder('left')){
      agent.die();
    }
  },
  
  whenFindItem: function (agent, item) {},
  
  whenMeetAgent: function (thisAgent, otherAgent) {       
    thisAgent.shareDictionariesWith(otherAgent);
  },
  
  
  
};