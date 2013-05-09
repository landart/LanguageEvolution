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
    
    console.log('Nearby unknown items',unknownItems);
    console.log('Nearby agents',agents);
    
    // if there is any agent
    if (agents.length){
      console.log('there is an agent, we\'ll see it later');
    }
   
      // otherwise, if there is any item
      if (unknownItems.length){

        var item = unknownItems[Math.floor(Math.random(0)*unknownItems.length)];
        console.log('picked unknown item',item);   
        
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
    
    
    console.log('I found an item:',item.getIndex(),dictionary[item.getIndex()]);
  },
  
  _getRandomName: function(){
    var name = "";
    var options = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 6; i++ ){
        name += options.charAt(Math.floor(Math.random() * options.length));
    }      

    return name;
  }
  
  
});