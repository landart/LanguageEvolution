var Item = Class.create({

  className: 'Item',

  _coordinates: null,
  _$cell: null,
  _state: null,

  
  _lastName: '',
  _lastAgent: null,
  _genoma: '101001', // 6 bit, 101001 = type item


  init: function (state) {
    this._state = state;
    //this._genoma += pad(new Number(index).toString(2),6); // and 6 bit, random
  },


  getCoordinates: function (){
    return this._coordinates;
  },
  
  setCoordinates: function(coordinates) {
    if (this._$cell) {
      this._$cell.css({ 'background-color': 'white' });
    }
    this._coordinates = coordinates || null;
    this._$cell = this._state.map.cellAtCoordinates(coordinates);
    this._$cell.css({ 'background-color': 'green' });
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