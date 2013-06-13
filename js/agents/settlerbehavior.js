var SettlerBehavior = {

  name: 'Settler',
  range: 3,
  criticism: 0.2, // low values for faster convergence
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
    this.shareDictionaries(thisAgent, otherAgent);
    this.checkIfWeSpeakTheSame(thisAgent, otherAgent);
  },
  
  shareDictionaries: function(thisAgent, otherAgent){
    thisDic = thisAgent.getDictionary();
    otherDic = otherAgent.getDictionary();
      
    for (var i in otherDic) {
      var chance = 0;

      // case 1: this agent does not know, foreigner does
      if (!thisDic[i] && otherDic[i]) {
        chance = 1;
      }

      // case 2: both agents know
      if (thisDic[i] && otherDic[i]) {
        chance = 0.5;
      }

      // add criticism and karma
      chance = chance + otherAgent.getKarma() - thisAgent.getCriticism();

      if (Math.random() < chance) {
        // risk of mutation in transfer (neologism)
        if (Math.random() < thisAgent.getNeologismFactor()){
          thisDic[i] = getRandomName(); 
        }
        else {
          thisDic[i] = otherDic[i];  
        }        

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

  },
  
  
  checkIfWeSpeakTheSame: function(thisAgent, otherAgent){
    
    var thisLanguage = thisAgent.getLanguage();
    var otherLanguage = otherAgent.getLanguage();
    var language = getRandomLanguage();
    
    if (objectsAreEqual(thisAgent.getDictionary(), otherAgent.getDictionary())){
      
      // accept other's
      if (!thisLanguage && otherLanguage){
        language = otherLanguage;    
      } 

      // accept this one
      else if (!otherLanguage && thisLanguage){
        language = thisLanguage;
      }  
      
      // it might be any of both
      else if (thisLanguage && otherLanguage){
        var factor = thisAgent.getKarma()*thisAgent.getCriticism()/otherAgent.getKarma()/otherAgent.getCriticism();
        language = Math.random() < 0.5 * factor ? thisLanguage : otherLanguage;
      }
      
      // if any of them has a language, then the random one

      thisAgent.setLanguage(language);
      otherAgent.setLanguage(language)

    }
    else {
      // break equality since dictionaries are not equal and agents have a language assigned
      if (thisLanguage == otherLanguage && thisLanguage){
        thisAgent.setLanguage(language);
      }
    }
        
  }

  
};