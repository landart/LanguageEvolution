var Agent = Class.create({

  className: 'Agent',
  
  _range: 2,  
  _dictionary: null,  
  _selectedItem: null,  
  _index: 0,  
  _coordinates: null,
  _state: null,
 
  init: function(index,state) {
    this._index = index;
    this._state = state;
    this._dictionary = [];
  },
  
  setCoordinates: function(coords){
    this._coordinates = coords || null;
  },
  
  nextStep: function(){    
    var elements = this.getElementsInRange();
    
    var behavior = new AgentBehavior({
      agent: this,
      items: this._filterElementsByClassName(elements,'Item'),
      allItems: this._state.items,
      world: this._state.world,
      allItemsCatalogued: this._allItemsCatalogued(elements),
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
  
  _allItemsCatalogued: function(elements){
    var allCatalogued = true; 
    
    elements = this._filterElementsByClassName(elements,'Item');
    
    for (var i in elements){
      if (!this._dictionary[elements[i].getIndex()]){
        allCatalogued = false;
      }
    }
    
    return allCatalogued;
  },
  
  getElementsInRange: function(){
    var xBoundary = this._makeBoundaries(this._coordinates.x);
    var yBoundary = this._makeBoundaries(this._coordinates.y);
    
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
  
  _makeBoundaries: function(coordinate){
    return makeBoundaries(coordinate,this._range,this._state.world.getSize());
  },
  
  getCoordinates: function(){
    return this._coordinates;
  },
  
  setCoordinates: function(coords){
    this._coordinates = coords;
  },
  
  getDictionary: function(){
    return this._dictionary;
  },
  
  toString: function(){
    return '<span class="agent">A'+this._index+'</span>';
  }
}); 