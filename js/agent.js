var Agent = Class.create({
  className: 'Agent', 

  _behavior: null,
  _karma: 0,
  _criticism: 0,
  _range: 1,

  _state: null,
  _coordinates: null,
  _$artefact: null,
  _$cell: null,  
  _index: 0,      
  _dictionary: null,  
  
  _language: 0,
  
  similarityThreshold: 0.25,

  init: function (behavior, state) {
    this._behavior = behavior;
    this._karma = behavior.karma || 0;
    this._criticism = behavior.criticism || 0;
    this._range = behavior.range || 1;
    this._state = state;
    this._dictionary = {};
    this._$artefact = $(document.createElement('div'))
      .css({ 'background-color': 'red' });
  },

  userInteraction: function () {
    var allItems = this._state.items,
        item;

    for (var i in allItems) {
      allItems[i].$getCell().tooltip('destroy');
    }

    for (var dictionaryGenoma in this._dictionary) {
      for (var i in allItems) {
        var item = allItems[i];
        if (genomicSimilarity(dictionaryGenoma, item.getGenoma()) < this.similarityThreshold) {
          item.$getCell()
            .tooltip({
              container: 'body',
              title: this._dictionary[item.getGenoma()],
              trigger: 'manual' })
            .tooltip('show');
          break;
        }
      }
    }
  },

  tick: function () {
    // basic behavior
    this._behavior.behave(this);
    
    this._processEvents();
  },
  
  _processEvents: function(){
    
    // find unknown item
    if (this.thereAreUnknownItemsInRange()){ 
      if (typeof this._behavior.whenFindItem == "function"){
        var items = this.getAllUnknownItemsInRange();
        for (var i in items){
          this._behavior.whenFindItem(this,items[i]);
        }
      } 
    }
    
    // meet other agents
    if (this.thereAreAgentsInRange()){
      if (typeof this._behavior.whenMeetAgent == "function"){
        var agents = this.getAllAgentsInRange();
        for (var i in agents){
          this._behavior.whenMeetAgent(this,agents[i]);  
        }        
      } 
    }
    
    
  },

  setCoordinates: function (coordinates) {
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
  
  getCoordinates: function() {
    return this._coordinates;
  },   
  
  getDictionary: function(){
    return this._dictionary;
  },
  
  randomMove: function () {
    var newCoordinates = this._state.map.freeCoordinatesAround(this.getCoordinates());
    this.setCoordinates(newCoordinates);
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
    var elements = this._state.map.elementsAround(this.getCoordinates(),this._range);    
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

  getAllAgentsInRange: function(){
    var elements = this._state.map.elementsAround(this.getCoordinates(),this._range);    
    return filterElementsByClassName(elements,'Agent');
  },
  
  thereAreUnknownItemsInRange: function(){
    return this.getAllUnknownItemsInRange().length != 0;
  },
  
  thereAreAgentsInRange: function(){    
    return this.getAllAgentsInRange().length != 0;
  },
  
  getRandomUnknownItemInRange: function(){
    var items = this.getAllUnknownItemsInRange();
    
    if (items.length){
      return items[Math.floor(Math.random()*items.length)];  
    }
    
    return null;       
  },
  
  getCriticism: function(){
    return this._criticism;
  },
  
  getKarma: function(){
    return this._karma;
  },
  
  increaseCriticism: function(){
    this._increaseValue("_criticism");
  },
  
  decreaseCriticism: function(){
    this._decreaseValue("_criticism");
  },
  
  increaseKarma: function(){
    this._increaseValue("_karma");
  },
  
  decreaseKarma: function(){
    this._decreaseValue("_karma");
  },
  
  _increaseValue: function(index){
    this[index] += 0.01;
    if (this[index] > 1){
      this[index] = 1;
    }
  },
  
  _decreaseValue: function(index){
    this[index] -= 0.01;
    if (this[index] < 0.01){
      this[index] = 0.01;
    }
  },
  
  getLanguage: function(){
    return this.language;
  },
  
  setLanguage: function(language){
    this.language = language;
    this._$artefact.css("background","hsl("+language+",50%,50%)");
  }
  
}); 