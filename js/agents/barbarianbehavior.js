var BarbarianBehavior = Class.create(Behavior.prototype,{
  
  _speed: 2,
    
  getAction: function(){
    // corrupt item names
    var items = this._state.items;
    var item = items[Math.floor(Math.random(0)*items.length)]; 
    
    item.setLastName(this._getRandomName());
    item.setLastAgent(this);
      
    // tamper nearby agents' dictionaries
    var agents = this._state.agents;
    if (agents.length){
      this._corruptDictionaries();
    }
      
    // move anyway so that discovery is fostered
    this._moveAgent();
    
  },
  
  _corruptDictionaries: function(){ 
    var agents = this._state.agents;
    var items = this._state.items;
    var allItems = this._state.allItems;
    
    for (var index in agents){
      var agent = agents[index];
      var agentDic = agent.getDictionary();      

      for (var i in agentDic) {

        // 20% probability of the word being changed
        if (Math.random() < 0.2) {
          agentDic[i] = this._getRandomName();
          allItems[i].setLastName(agentDic[i]);
          allItems[i].setLastAgent(this)
        }
      }

    }
  }  
  
});