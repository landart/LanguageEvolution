var AgentBehavior = Class.create({
  
  _state: null,
  
  init: function(state){
    this._state = state;
  },
  
  getAction: function(){
    var agents = this._state.agents;
    var items = this._state.items;
    var dictionary = this._state.dictionary;
    
    console.log('Nearby items',items);
    console.log('Nearby agents',agents);
    
    // if there is any agent
    if (agents.length){
      console.log('there is an agent, we\'ll see it later');
    }
    else {
      // otherwise, if there is any item
      if (items.length){
        console.log(items.length);
        var item = items[Math.floor(Math.random(0)*items.length)];
        console.log('picked item',item);   
        
        if (!dictionary[item.getIndex()]){
          this._addItemToDictionary(item);
        }
        else {
          console.log('I know the item: ',item.getIndex(),dictionary[item.getIndex()]);
        }
      }
      else {
        console.log('cannot find items, moving randomly');
      }   
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