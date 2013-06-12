var SettlerBehavior = Class.create(Behavior.prototype,{

  getAction: function(){
    var agents = this._state.agents;
    var agent = this._state.agent;
    var items = this._state.items;
    var allItemsCatalogued = this._state.allItemsCatalogued;
    var dictionary = this._state.dictionary;
    
    // otherwise, if there are non catalogued items
    if (!allItemsCatalogued){

      var item = items[Math.floor(Math.random(0)*items.length)]; 
        
      if (!dictionary[item.getIndex()]){
        this._addItemToDictionary(item);
      }
    }
    // besides, if there is any agent, exchange knowledge
    if (agents.length){
      this._mixDictionaries();
    }
      
    // move anyway so that discovery is fostered
    this._moveAgent();
    
  },
  
  _mixDictionaries: function(){ 
    var receiver = this._state.agent;
    var dic = receiver.getDictionary();
    var agents = this._state.agents;
    var items = this._state.allItems;
    
    for (var index in agents){
      var agent = agents[index];
      var agentDic = agent.getDictionary();      
      
      for (var i in dic){
        
        // case 1: this agent does not know, foreigner does
        if (!dic[i]&&agentDic[i]){
          dic[i]=agentDic[i];
          items[i].setLastName(dic[i]); // keep last agent as it was
        }
        
        // case 2: both agents know
        if (dic[i]&&agentDic[i]){
          // if receiver is the namer, 20% chance that we accept foreigner's word
          if (receiver == items[i].getLastAgent()){
            if (Math.random()<0.2){
              dic[i]=agentDic[i];
              items[i].setLastName(dic[i]);
              items[i].setLastAgent(agent); // foreigner rules!
            }
          }
          // if current agent is the namer, 70% chance since it is quite reliable
          else if(agent == items[i].getLastAgent()){
            if (Math.random()<0.7){
              dic[i]=agentDic[i];
              items[i].setLastName(dic[i]); // keep last agent as it was
            }
          }
          // 40% otherwise (conservative)
          else {
            if (Math.random()<0.4){
              dic[i]=agentDic[i];
              items[i].setLastName(dic[i]);
              items[i].setLastAgent(agent)
            }
          }        
          
        }
      }
    }
  },
  
  _addItemToDictionary: function(item){
    var dictionary = this._state.dictionary;
    
    // if item was not named
    // or named by another agent (20%)
    var conditions = !item.getLastName() || 
                      item.getLastAgent()!=this._state.agent && Math.random()<0.2
    
    if (conditions){
      var name = this._getRandomName();
    
      dictionary[item.getIndex()] = name;
      item.setLastName(name);
      item.setLastAgent(this);
    }   
  }  
  
});