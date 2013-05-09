var AgentBehavior = Class.create({
  
  _state: null,
  
  init: function(state){
    this._state = state;
  },
  
  getAction: function(){
    var agents = this._state.agents;
    var agent = this._state.agent;
    var items = this._state.items;
    var unknownItems = this._state.unknownItems;
    var dictionary = this._state.dictionary;
    
    // if there is any agent
    if (agents.length){
      console.log('there is an agent, we\'ll see it later');
    }
   
      // otherwise, if there is any item
      if (unknownItems.length){

        var item = unknownItems[Math.floor(Math.random(0)*unknownItems.length)]; 
        
        if (!dictionary[item.getIndex()]){
          this._addItemToDictionary(item);
        }
        else {
          console.log('I know the item: ',item.getIndex(),dictionary[item.getIndex()]);
        }
      }
      else {
        agent.moveRandomly();
      }        
    
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