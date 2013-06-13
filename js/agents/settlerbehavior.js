var SettlerBehavior = {

  name: 'Settler',
  range: 3,
  criticism: 0.3,
  karma: 0.2,
  
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
      
    thisDic = thisAgent.getDictionary();
    otherDic = otherAgent.getDictionary();
  
    for (var i in otherDic){
        var chance = 0;
        
        // case 1: this agent does not know, foreigner does
        if ( !thisDic[i] && otherDic[i] ){
          chance = 1;
        }
        
        // case 2: both agents know
        if ( thisDic[i] && otherDic[i] ){
          chance = 0.5;
        }
        
        // add criticism and karma
        chance = chance + otherAgent.getKarma() - thisAgent.getCriticism();
        
        if (Math.random() >= chance){
          thisDic[i] = otherDic[i];
          
          // adjust karma and criticism values
          thisAgent.decreaseCriticism();
          otherAgent.increaseKarma();
        }
        else {
          // one gains, the other looses
          thisAgent.increaseCriticism();
          otherAgent.decreaseKarma();
        }        
      }

      this.checkIfWeAreTheSame(thisAgent, otherAgent);

  },
  
  
  
  checkIfWeAreTheSame: function(thisAgent, otherAgent){
    thisKeys = keys(thisAgent.dictionary);
    otherKeys = keys(otherAgent.dictionary);
    
    if (thisKeys.length != otherKeys.length ){
      return false;
    }
    
    if (!thisKeys.equals(otherKeys)){
      return false;
    }
  }

  
};