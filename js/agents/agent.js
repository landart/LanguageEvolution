var Agent = Class.create({
  className: 'Agent', 
  
  _index: 0,    
  _genoma: '110000', // 6 bit, 110000 = general agent
  
  _dictionary: null,   
  _coordinates: null,
  _state: null,
  
  // apparently, there is a bug preventing this function to execute when it is overriden in the child class
  init: function(){},
  
  _addRandomGene: function(index) {
    this._genoma += pad(new Number(index).toString(2),6);
  },  
  
  setCoordinates: function(coords){
    this._coordinates = coords || null;
  },
  
  getCoordinates: function(){
    return this._coordinates;
  },
  
  getDictionary: function(){
    return this._dictionary;
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
}); 