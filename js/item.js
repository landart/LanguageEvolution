var Item = Class.create({

  className: 'Item',

  _coordinates: null,
  _index: 0,
  _lastName: '',
  _speaker: null,

  init: function(index) {
    this._index = index;
  },
  
  getCoordinates: function(){
    return this._coordinates;
  },
  
  setCoordinates: function(coords){
    this._coordinates = coords || null;
  },
  
  getIndex: function(){
    return this._index;
  },
  
  setName: function(speaker,name){
    this._lastName = name;
    this._speaker = speaker;
  },
    
  toString: function(){
    var name = this._lastName || 'I'+this._index;
    return '<span class="item">'+name+'</span>';
  }
}); 