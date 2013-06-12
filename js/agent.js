var Agent = Class.create({
  className: 'Agent', 

  description: null,

  _state: null,
  _coordinates: null,
  _$cell: null,
  
  _index: 0,    
  _genoma: '110000', // 6 bit, 110000 = general agent
  
  _dictionary: null,   
  
  

  init: function (description, state) {
    this.description = description;
    this._state = state;
  },

  tick: function () {
    var helper = new AgentHelper(this, this._state);
    this.description.behavior(helper);
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
  
}); 