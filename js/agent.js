var Agent = Class.create({

  className: 'Agent',
  
  _range: 2,  
  _dictionary: [],  
  _selectedItem: null,  
  _index: 0,  
  _coordinates: null,
  _state: null,
 
  init: function(index,state) {
    console.log('You instantiated an agent!');
    this._index = index;
    this._state = state;
  },
  
  setCoordinates: function(coords){
    this._coordinates = coords || null;
  },
  
  nextStep: function(){
    console.log('Agent',this._index,'is calculating next step');
    var elements = this.getElementsInRange();
    
    var behavior = new AgentBehavior({
      items: this._filterElementsByClassName(elements,'Item'),
      agents: this._filterElementsByClassName(elements,'Agent'),
      dictionary: this._dictionary
    })
    
    behavior.getAction();  
    
  },
  
  _filterElementsByClassName: function(elements,className){
    var result = []; 
    
    for (var i in elements){
      if (elements[i].className == className){
        result.push(elements[i])
      }
    }
    
    return result;
  },
  
  getElementsInRange: function(){
    var xBoundary = {
      min: Math.max(0,this._coordinates.x-this._range),
      max: Math.min(this._state.world.getSize()-1,this._coordinates.x+this._range)
    };
    
    var yBoundary = {
      min: Math.max(0,this._coordinates.y-this._range),
      max: Math.min(this._state.world.getSize()-1,this._coordinates.y+this._range)
    };
    
    var items = [];
    
    for (var x=xBoundary.min; x<=xBoundary.max; x++){
      for (var y=yBoundary.min; y<=yBoundary.max; y++){
        var element = this._state.world.getElementAtPosition(x,y);
        
        if (element && element != this){
          items.push(element);
        }
      }
    }
    
    return items;
  },
  
  toString: function(){
    return '<span class="agent">A'+this._index+'</span>';
  }
}); 