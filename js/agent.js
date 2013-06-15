var Agent = Class.create({
  className: 'Agent', 

  _behavior: null,
  _karma: 0,
  _range: 1,
  _karmaWeight: 100,
  _minKarma: 0.01,

  _state: null,
  _coordinates: null,
  _color: null,
  _$artefact: null,
  _$cell: null,  
  _index: 0,      
  _dictionary: null,  
  
  _language: 0,
  _numLanguages: 15,
  
  _options: null,
  _simulation: null,

  init: function (behavior, state, options, simulation, index) {
    this._options = options || null;
    this._behavior = behavior || null;
    this._simulation = simulation || null;
    this._karma = behavior.karma || 0;
    this._range = behavior.range || 1;
    this._state = state || null;
    this._color = behavior.defaultColor || 'hsl(0, 90%, 90%)';
    this._$artefact = $(document.createElement('div')).css('background', this._color);
    this._index = index || 0;
    
    this._initializeDictionary();    
  },

  _initializeDictionary: function(){
    this._dictionary = {};

    if (this._behavior.randomDictionary){
      for (var i in this._state.items){
        var item = this._state.items[i];        
        this._dictionary[item.getGenoma()] = getRandomName();        
      }

    }
  }, 

  userInteraction: function () {
    var allItems = this._state.items;
    var item = null;

    this._simulation.hideDictionaryTooltips();

    for (var dictionaryGenoma in this._dictionary) {
      for (var i in allItems) {
        var item = allItems[i];
        if (genomicSimilarity(dictionaryGenoma, item.getGenoma()) < this._options.similarityThreshold) {
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
  
  getIndex: function(){
    return this._index;
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
  
  randomMoveFromDirection: function(direction){
    var newCoordinates = this._state.map.freeCoordinatesFromDirection(this.getCoordinates(),direction);
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
      if (genomicSimilarity(genoma,itemGenoma) < this._options.similarityThreshold){
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
  
  shareDictionariesWith: function(otherAgent){
    thisDic = this.getDictionary();
    otherDic = otherAgent.getDictionary();
      
    for (var i in otherDic) {
      var chance = 0;

      // case 1: this agent does not know, foreigner does
      if (!thisDic[i] && otherDic[i]) {
        chance = 1;
      }

      // case 2: both agents know
      if (thisDic[i] && otherDic[i]) {
        chance = 0.5;
      }

      // add karma
      chance = chance + Math.log(otherAgent.getKarma()/this.getKarma())/this._karmaWeight;

      if (Math.random() < chance) {
        
        // do not affect if language is blocked
        if (this._behavior.canChangeLanguage !== false){
          // risk of mutation in transfer (neologism)
          if (Math.random() < this.getNeologismFactor()){
            thisDic[i] = getRandomName(); 
          }
          else {
            thisDic[i] = otherDic[i];  
          }        

          // adjust karma values
          this.decreaseKarma();
          otherAgent.increaseKarma();
        }
          
      } 
      else {
        // one gains, the other loses
        this.increaseKarma();
        otherAgent.decreaseKarma();
      }
    }

  },
   
  checkIfWeSpeakTheSame: function(otherAgent){
    
    var thisLanguage = this.getLanguage();
    var otherLanguage = otherAgent.getLanguage();
    var language = getRandomLanguage(this._numLanguages);
    
    if (dictionarySimilarity(this.getDictionary(), otherAgent.getDictionary()) < this._options.dictionarySimilarityThreshold){
      
      // accept other's
      if (!thisLanguage && otherLanguage){
        language = otherLanguage;    
      } 

      // accept this one
      else if (!otherLanguage && thisLanguage){
        language = thisLanguage;
      }  
      
      // it might be any of both
      else if (thisLanguage && otherLanguage){
        var factor = Math.log(this.getKarma()/otherAgent.getKarma())/this._karmaWeight;
        language = Math.random() < 0.5 * factor ? thisLanguage : otherLanguage;
      }
      
      // if any of them has a language, then the random one

      this.setLanguage(language);
      otherAgent.setLanguage(language)

    }
    else {
      // break equality since dictionaries are not equal and agents have a language assigned
      if (thisLanguage == otherLanguage){
        this.setLanguage(language);
      }
    }
        
  },
  
  getKarma: function(){
    return this._karma;
  },

  increaseKarma: function(){
    this._increaseValue("_karma");
  },
  
  decreaseKarma: function(){
    this._decreaseValue("_karma");
  },
  
  _increaseValue: function(index){
    this[index] *= 1.001;
    if (this[index] > 1){
      this[index] = 1;
    }
  },
  
  _decreaseValue: function(index) {
    this[index] /= 1.001;
    if (this[index] < this._minKarma){
      this[index] = this._minKarma;
    }
  },
  
  getLanguage: function(){
    return this._language;
  },
  
  getDisplayLanguage: function(){
    return this._language/this._numLanguages;
  },
  
  setLanguage: function(language) {
    
    if (this._behavior.canChangeLanguage === false){
      return;
    }
    
    this._language = language;
    this._color = 'hsl(' + language + ', 90%, 25%)';
    this._$artefact.css('background', this._color);
  },

  getColor: function () {
    return this._color;
  },
  
  getNeologismFactor: function(){
    return this._options.neologismFactor;
  },
  
  hasReachedBorder: function(border){
    return this._state.map.areCoordinatesInTheBorder(this.getCoordinates(),border);
  },
  
  die: function(){
    this._state.map.getCellAtCoordinates(this.getCoordinates()).element = null;
    this._$artefact.remove();
    this._simulation.destroyAgent(this);
  }
  
}); 