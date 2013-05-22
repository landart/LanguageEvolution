var Settler = Class.create(Agent.prototype,{

  className: 'Settler',
  
  _range: 3,  
  _genoma: '110001', // 6 bit, 110001 = settler agent
 
  init: function(index,state) {
    this._addRandomGene(index);
    
    this._index = index;
    this._state = state;
    this._dictionary = [];
  },
  
  nextStep: function(){    
    var elements = this.getElementsInRange();
    
    var behavior = new SettlerBehavior({
      agent: this,
      items: filterElementsByClassName(elements,'Item'),
      allItems: this._state.items,
      world: this._state.world,
      allItemsCatalogued: this._allItemsCatalogued(elements),
      agents: filterElementsByClassName(elements,'Settler'),
      dictionary: this._dictionary
    })
    
    behavior.getAction();  
    
  },
  
  
  
  _allItemsCatalogued: function(elements){
    var allCatalogued = true; 
    
    elements = filterElementsByClassName(elements,'Item');
    
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
    return '<span class="agent">S'+this._index+'</span>';
  }
}); 