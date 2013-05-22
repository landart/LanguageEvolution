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
}); 