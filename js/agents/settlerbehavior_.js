/*var SettlerBehavior = Class.create(Behavior.prototype,{

  getAction: function(){

    
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
  

  
});*/