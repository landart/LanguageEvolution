var Item = Class.create({

  className: 'Item',

  _coordinates: null,
  _$cell: null,
  _$artifact: null,
  _state: null,

  _genoma: '',


  init: function (state,genomicLength) {
    this._state = state;
    this._genoma += getRandomGenoma(genomicLength);
    this._$artefact = $(document.createElement('div'))
      .css({ 'background-color': 'green' })
      .click($.proxy(this._onClick, this));
  },

  getCoordinates: function (){
    return this._coordinates;
  },
  
  setCoordinates: function(coordinates) {
    if (this._$cell) {
      this._state.map.updateAtCoordinates(this.getCoordinates(), null);
      this._$artefact.remove();
    }

    this._coordinates = coordinates || null;
    this._state.map.updateAtCoordinates(coordinates, this);
    this._$cell = this._state.map.getJQueryCellAtCoordinates(coordinates);
    
    if (this._$cell) {
      this._$cell.append(this._$artefact);
    }
  },
  
  getIndex: function(){
    return this._index;
  },
  
  getGenoma: function(){
    return this._genoma;
  }
    
}); 