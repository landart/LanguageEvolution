var Item = Class.create({

  _coordinates: null,

  init: function() {
    console.log('You instantiated an object!');
  },
  
  setCoordinates: function(coords){
    this._coordinates = coords || null;
  }
}); 