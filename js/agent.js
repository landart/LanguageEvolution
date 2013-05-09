var Agent = Class.create({

  _range: 2,  
  _dictionary: {},  
  _selectedItem: null,  
  _index: 0,  
  _coordinates: null,
 
  init: function(index) {
    console.log('You instantiated an agent!');
    this._index = index;
  },
  
  itemsInRange: function(){
    console.log(state);
  },
  
  setCoordinates: function(coords){
    this._coordinates = coords || null;
  },
  
  toString: function(){
    return '<span class="agent">A'+this._index+'</span>';
  }
}); 