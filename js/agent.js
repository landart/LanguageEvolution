var Agent = Class.create({
  className: 'Agent', 

  behavior: null,

  _state: null,
  _coordinates: null,
  _$cell: null,  
  _index: 0,      
  _dictionary: null,  
  
  similarityThreshold: 0.25,

  init: function (behavior, state) {
    this.behavior = behavior;
    this._state = state;
    this._dictionary = {};
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
    this._$cell = this._state.map.getJQueryCellAtCoordinates(coordinates);
  },
  
  getCoordinates: function() {
    return this._coordinates;
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
    return this.getAllUnknownItemsInRange().length == 0 || this.getAllItemsInRange().length == 0;
  },
  
  isItemInDictionary: function(item){
    return this._dictionary[item.getGenoma()] ? true : false;
  },
  
  addItemToDictionary: function(item){
    this._dictionary[item.getGenoma()] = this.nameItemByGenoma(item.getGenoma());  
  },
  
  nameItemByGenoma: function(itemGenoma){
    for (var genoma in this._dictionary){
     
      if (genomicSimilarity(genoma,itemGenoma) < this.similarityThreshold){
        return this._dictionary[genoma];
      }
    }
    return getRandomName();
  },
  
  getAllItemsInRange: function(){
    var elements = this._state.map.elementsAround(this.getCoordinates(),this.behavior.range);    
    return filterElementsByClassName(elements,'Item');
  },
  
  getAllUnknownItemsInRange: function(){
    var items = this.getAllItemsInRange();
    
    var results = [];    
    for (var i in items){
      if (!this._dictionary[items[i].getGenoma()]){
        results.push(items[i])
      }
    }
    
    return results;
  },
  
  getRandomUnknownItemInRange: function(){
    var items = this.getAllUnknownItemsInRange();
    return items[Math.floor(Math.random()*items.length)];   
  }
}); 