var AgentBehavior = Class.create({
  
  _state: null,
  
  init: function(state){
    this._state = state;
  },
  
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
      agent.mixDictionaryWith(agents);
      agent.moveRandomly();
    }
      
    // move anyway so that discovery is fostered
    agent.moveRandomly();
    
  },
  
  _addItemToDictionary: function(item){
    var dictionary = this._state.dictionary;
    var name = this._getRandomName();
    
    dictionary[item.getIndex()] = name;
    item.setName(this,name);
  },
  
  _getRandomName: function(){

    var options = ['rock','sand','stone','water','river','mountain','hill','grass','tree','animal','dog','cow','lion','sky','space','sun','moon','Mars','Venus','Pluto','Jupiter','Saturn','Mercury','Neptune','fish','tuna','boat','cloud','wind','air','plant','apple','pear','banana','tomato','onion','lettuce','snail','rat','creek','bread','milk','beer','bear','wolf','eagle','chicken','asteroid','planet','beach','paramount','cliff','reef','whale','shark','turtle','crab'];

    return options[Math.floor(Math.random()*options.length)];
  }
  
  
});