var Item = Class.create({

  className: 'Item',

  _coordinates: null,
  _$cell: null,
  _state: null,

  _genoma: '',


  init: function (state,genomicLength) {
    this._state = state;
    this._genoma += getRandomGenoma(genomicLength);
  },

  getCoordinates: function (){
    return this._coordinates;
  },
  
  setCoordinates: function(coordinates) {
    if (this._$cell) {
      this._$cell.css({ 'background-color': 'white' });
    }
    this._coordinates = coordinates || null;
    this._$cell = this._state.map.getJQueryCellAtCoordinates(coordinates);
    this._$cell.css({ 'background-color': 'green' });
  },
  
  getIndex: function(){
    return this._index;
  },
  
  getGenoma: function(){
    return this._genoma;
  }
    
}); 