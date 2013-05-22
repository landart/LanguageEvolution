var Item = Class.create({

  className: 'Item',

  _coordinates: null,
  _index: 0,
  _lastName: '',
  _lastAgent: null,
  _genoma: '101001', // 6 bit, 101001 = type item

  init: function(index) {
    this._index = index;
    this._genoma += pad(new Number(index).toString(2),6); // and 6 bit, random
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
  
  getLastName: function(){
    return this._lastName;
  },
  
  setLastName: function(name){
    this._lastName = name || this._lastName;    
  },
  
  setLastAgent: function(agent){
    this._lastAgent = agent || this._lastAgent;
  },
  
  getLastAgent: function(){
    return this._lastAgent; 
  },
    
  toString: function(){
    var name = this._lastName || 'I'+this._index;
    return '<span class="item">'+name+'</span>';
  }
}); 