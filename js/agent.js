var Agent = Class.create({
  className: 'Agent', 

  behavior: null,

  _state: null,
  _coordinates: null,
  _$cell: null,
  
  _index: 0,    
  _genoma: '110000', // 6 bit, 110000 = general agent
  
  _dictionary: null,  

  init: function (behavior, state) {
    this.behavior = behavior;
    this._state = state;
  },

  tick: function () {
    this.behavior.behave(this);
    this._$cell.css({ 'background-color': 'red' });
  },

  setCoordinates: function (coordinates) {
    if (this._$cell) {
      this._$cell.css({ 'background-color': 'white' });
    }
    this._coordinates = coordinates || null;
    this._$cell = this._state.map.cellAtCoordinates(coordinates);
  },
  
  getCoordinates: function() {
    return this._coordinates;
  },
  
  _addRandomGene: function(index) {
    this._genoma += pad(new Number(index).toString(2),6);
  },  
   
  
  getDictionary: function(){
    return this._dictionary;
  },
  
  randomMove: function () {
    var newCoordinates = this._state.map.freeCoordinatesAround(this.getCoordinates());

    this._state.map.updateAtCoordinates(this.getCoordinates(), null);
    this._state.map.updateAtCoordinates(newCoordinates, this);
    this.setCoordinates(newCoordinates);
  },
  
  allItemsInRangeAreCatalogued: function(){
   
    var elements = this._state.map.elementsAround(this.getCoordinates(),this.behavior.range);
    
    items = filterElementsByClassName(elements,'Item');
    
    for (var i in items){
      if (!this._dictionary[elements[i].getIndex()]){
        return false;
      }
    }
    
    return true;
  }
}); 