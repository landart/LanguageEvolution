var Simulation = Class.create({
  
  // configurable params
  numAgents: 4,
  numItems: 10,
  worldSize: 5,
  console: '#console',
  map: '#map',
  dictionaries: '#dictionaries',

  // inner attributes
  _agents: [],  
  _world: null,  
  _items: [],  
  _kraken: null,
  _runInterval: null,
  _running: false,
  _clock: 0,
  _console: null,
  _$map: null,
  _$dictionaries: null,

  // constructor
  init: function() {
    this._initWorld();
    this._initItems();
    this._initAgents();
    this._initConsole();
  },
  
  _initWorld: function(){
    this._$map = $(this.map);
    this._$dictionaries = $(this.dictionaries);
    this._world = new World(this.worldSize);
  },
  
  _initItems: function(){
    for (var i =0; i<this.numItems; i++){
      this._items[i] = new Item(i);
      
      this._world.place(this._items[i]);
    }
  },
  
  _initAgents: function(){
    for (var i = 0; i<this.numAgents; i++){
      this._agents[i] = new Settler(i,this.getState());
      this._world.place(this._agents[i]);
    }
  },

  _initConsole: function () {
    this._console = new Console({ container: this.console });
  },
  
  releaseTheKraken: function(){
    console.log('Releasing the Kraken...');
    this._kraken =  new Kraken(this.getState());
    this._world.place(this._kraken);
    
    if (!this._running){
      this.start();
    }
    
    this._showLockKrakenMessage();
  },
  
  lockTheKraken: function(){
    this._world.setElementAtPosition(this._kraken.getCoordinates(),null);
    this._kraken = null;
    
    this._clearMessage();
  },
  
  getState: function(){
    return {
      items: this._items,
      world: this._world,
      agents: this._agents
    }
  },
  
  // execution
  run: function(){    
    this._initialDraw();
    this._launchInterval();
    this._running = true;
  },
  
  _launchInterval: function(){
    var that = this;
    this._runInterval = setInterval(function(){     
      that.nextStep();
      that._draw(); 
    },10);
  },
  
  stop: function(){
    clearInterval(this._runInterval);
    this._running = false;
    this._clock = 0;
  },
  
  start: function(){
    this._launchInterval();
    this._clearMessage();
    this._running = true;
  },
  
  nextStep: function(){
    for (var index in this._agents){
      this._agents[index].nextStep();
    }
    
    if (this._kraken){
      this._kraken.nextStep();
    }
    
    this._clock++;
    
    this._checkConvergence();
  },
  
  _checkConvergence: function(){
    convergence = true;
    
    for (var index=0; index<this._agents.length-1; index++){
      if(this._agents[index].getDictionary().toString() != this._agents[index+1].getDictionary().toString()){
        convergence = false;
        break;
      }      
    }
    
    if (convergence){
      this._showSuccessMessage();
      this.stop();
    }
  },
  
  _showLockKrakenMessage: function(){
    this._console.info('The Kraken has been released, producing chaos. <a id="lockTheKraken" href="#">Lock it!</a>');
    
    $("#lockTheKraken").click($.proxy(function () {
      this.lockTheKraken();
    },this));
  },
  
  _showSuccessMessage: function() {
    this._console.success('The simulation has converged in ' + this._clock + ' iterations. <a id="releaseTheKraken" href="#">Release the Kraken!</a>');

    $("#releaseTheKraken").click($.proxy(function () {
      this.releaseTheKraken();
    },this));
  },
  
  _clearMessage: function(){
    this._console.clear();
  },
  
  _initialDraw: function(){
    this._buildMap();
    this._buildDictionaries();
  },

  _buildMap: function () {
    var size = this.worldSize,
        table = this._$map,
        body = $(document.createElement('tbody')),
        row;

    for (var i = 0; i < size; i++) {
      row = $(document.createElement('tr'));
      for (var j = 0; j < size; j++) {
        row.append(document.createElement('td'));
      }
      body.append(row);
    }
    table.append(body);
  },

  _buildDictionaries: function () {
    var rows = this.numAgents,
        cells = this.numItems,
        table = this._$dictionaries,
        body = $(document.createElement('tbody')),
        row;

    for (var i = 0; i < rows; i++) {
      row = $(document.createElement('tr'));
      for (var j = 0; j < cells; j++) {
        row.append(document.createElement('td'));
      }
      body.append(row);
    }
    table.append(body);
  },
  
  _draw: function() {
    var mapCells = this._$map.find('td'),
        dictionariesRows = this._$dictionaries.find('tr'),
        elements = [].concat(this._items).concat(this._agents);

    if (this._kraken){
      elements = elements.concat(this._kraken);
    }

    mapCells.html('');
    
    for (var i in elements){
      var element = elements[i];   
      var position = element.getCoordinates();
      $(mapCells[position.x+position.y*this._world.getSize()]).html(element.toString());
    }
    
    for (var i in this._agents){
      var element = this._agents[i];  
      if (element.className == 'Settler'){
        for (var j in element._dictionary){
          var td = parseInt(j);
          var tr = parseInt(i);
          $(dictionariesRows[tr]).children().eq(td).html(element._dictionary[j]);  
        }        
      }
    }

  },
  
  _drawItems: function(){
    var html = '<ul id="items">';
    
    for (var index in this._items){
      html += '<li>'+this._items[index].toString()+'</li>';
    }
    
    html += '</ul>'
    
    return html;
  }
  
}); 

var evolution = new Simulation();
evolution.run();
