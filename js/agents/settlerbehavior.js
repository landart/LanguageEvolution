var SettlerBehavior = {

  name: 'Settler',
  range: 3,
  karma: 0.2, // low values for faster convergence
  
  behave: function (agent) {
    if (!agent.thereAreUnknownItemsInRange()){
      agent.randomMove();
    }
  },
  
  whenFindItem: function (agent, item) {
    if (!agent.isItemInDictionary(item)){
      agent.addItemToDictionary(item);
    }
  },
  
  whenMeetAgent: function (thisAgent, otherAgent) {       
    thisAgent.shareDictionariesWith(otherAgent);
  }
  
};