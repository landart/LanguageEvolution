var SettlerBehavior = {

  name: 'Settler',
  range: 3,
  criticism: 0.3,
  karma: 0.2,
  
  behave: function (agent) {
    if (agent.allItemsInRangeAreCatalogued()){
      agent.randomMove();
    }    
  },

  whenMeetAgent: function (agent) {
    agent.corrupt(0.1);
    agent.kill(0.1);
  },

  whenFindItem: function (item) {
    item.learn();
  }

};