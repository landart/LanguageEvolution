var Agent = Class.create({

  _range: 2,  
  _dictionary: {},  
  _selectedItem: null,  
  _state: null,  
  _coordinates: null,
 
  init: function(state) {
    console.log('You instantiated an agent!');
    this._state = state;
  },
  
  itemsInRange: function(){
    console.log(state);
  },
  
  setCoordinates: function(coords){
    this._coordinates = coords || null;
  }
}); 