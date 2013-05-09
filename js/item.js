var Item = Class.create({

  _coordinates: null,
  _index: 0,

  init: function(index) {
    console.log('You instantiated an object!');
    this._index = index;
  },
  
  setCoordinates: function(coords){
    this._coordinates = coords || null;
  },
  
  toString: function(){
    return '<span class="item">I'+this._index+'</span>';
  }
}); 