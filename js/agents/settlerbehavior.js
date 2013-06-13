var SettlerBehavior = {

  name: 'Settler',
  range: 3,
  criticism: 0.3,
  karma: 0.2,
  
  behave: function (agent) {

    console.log(agent)

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

      this.checkIfWeSpeakTheSame(thisAgent, otherAgent);

  },
  
  
  checkIfWeSpeakTheSame: function(thisAgent, otherAgent){
    
    if (objectsAreEqual(thisAgent.getDictionary(), otherAgent.getDictionary())){
      
      var thisLanguage = thisAgent.getLanguage();
      var otherLanguage = otherAgent.getLanguage();
      var language = Math.round(Math.random()*100);
      
      if (!thisLanguage && otherLanguage){
        language = otherLanguage;    
      } 
      else if (!otherLanguage && thisLanguage){
        language = thisLanguage;
      }  

      thisAgent.setLanguage(language);
      otherAgent.setLanguage(language)

    }
        
  }

  
};