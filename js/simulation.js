var Simulation = Class.create({

  options: {
    numAgents: 4,
    numItems: 10,
    speed: 50,                        // Ticks per second
    barbarianHordeSize: 2,
    worldSize: 40,
    console: '#console',
    map: '#map',
    dictionaries: '#dictionaries',
    actionReset: '#action-reset',
    actionPlay: '#action-play',
    actionPause: '#action-pause',
  },

  // inner attributes
  _agentClasses: null,
  _agents: [],   
  _items: [],  
  _runInterval: null,
  _running: false,
  _clock: 0,
  _console: null,
  _map: null,
  _$dictionaries: null,

  // constructor
  init: function (agents) {
    this._agentClasses = agents;

    this._initGui();
    this._initMap();
    this._initItems();
    this._initAgents();
    this._initConsole();
  },

  _onReset: function (event) {
    this.reset();
  },

  _onPlay: function (event) {
    this.play();
  },

  _onPause: function (event) {
    this.pause();
  },

  _keyHandler: function (event) {
    switch (event.keyCode) {
      case 80: // p
        this._onPlay(event);
        break;
      case 82: // r
        this._onReset(event);
        break;
      case 83: // s
        this._onPause(event);
        break;
    }
  },

  _initGui: function () {
    this._$map = $(this.options.map);
    this._$dictionaries = $(this.options.dictionaries);
    $(this.actionReset)
      .click($.proxy(this._onReset, this))
      .popover({ placement: 'bottom', trigger: 'hover', html: true, title: 'Reset', content: 'Shortcut <kbd>R</kbd>', container: 'body' });
    $(this.actionPlay)
      .click($.proxy(this._onPlay, this))
      .popover({ placement: 'bottom', trigger: 'hover', html: true, title: 'Play', content: 'Shortcut <kbd>P</kbd>', container: 'body' });
    $(this.actionPause)
      .click($.proxy(this._onPause, this))
      .popover({ placement: 'bottom', trigger: 'hover', html: true, title: 'Pause', content: 'Shortcut <kbd>S</kbd>', container: 'body' });
    $(window.document).bind('keyup', $.proxy(this._keyHandler, this));
    this._buildGui();
  },

  _buildGui: function() {
    this._buildDictionaries();
  },

  _buildDictionaries: function () {
    var rows = this.options.numAgents,
        cells = this.options.numItems,
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
  
  _initMap: function (){
    this._map = new Map(this.options.map, {
      size: this.options.worldSize,
    });
  },
  
  _initItems: function () {
    var item;

    for (var i =0; i < this.options.numItems; i++){
      item = new Item(this.getState());
      this._items[i] = item;
      this._map.placeAtRandomCoordinates(item);
    }
  },
  
  _initAgents: function () {
    var agent;

    for (var i = 0; i < this.options.numAgents; i++) {
      agent = new Agent(this._agentClasses[0], this.getState());
      this._agents.push(agent);
      this._map.placeAtRandomCoordinates(agent);
    }
  },

  _initConsole: function () {
    this._console = new Console({ container: this.options.console });
  },
  
  launchBarbarianHorde: function(size) {
    size = size || this.options.barbarianHordeSize;
    
    var entry = getRandomCardinalPoint();
    var exit = getRandomCardinalPoint();
    
    for (var i = 0; i < size; i++){
      var j = this._agents.length + i;
      
      this._agents[j] = new Barbarian(i, this.getState(), entry, exit);
      this._world.place(this._agents[j]);
    }
  },
  
  getState: function(){
    return {
      items: this._items,
      map: this._map,
      agents: this._agents
    }
  },
  
  reset: function () {
    this._clock = 0;
    this._clearMessage();
    this.stop();
    this.play();
  },

  play: function() {
    if (!this._running) {
      this._setupInterval();
      this._running = true;
    }
  },

  stop: function(){
    // something else about stop?
    this.pause();
  },

  pause: function () {
    this._removeInterval();
    this._running = false;
  },
  
  _setupInterval: function () {
    var that = this;
    this._runInterval = setInterval(function () {     
      that.tick();
    }, 1000/this.options.speed);
  },

  _removeInterval: function () {
    clearInterval(this._runInterval);
  },
  
  tick: function() {
    for (var i in this._agents) {
      this._agents[i].tick();
    }
    
    this._clock++;
    
    // this._checkConvergence();
  },
  
  _checkConvergence: function(){
    convergence = true;
    
    for (var index=0; index < this._agents.length-1; index++){
      if (this._agents[index].getDictionary().toString() != this._agents[index+1].getDictionary().toString()) {
        convergence = false;
        break;
      }      
    }
    
    if (convergence){
      this._showSuccessMessage();
    }
  },
    
  _showSuccessMessage: function() {
    this._console.success('The simulation has converged in ' + this._clock + ' iterations. <a id="launchBarbarianHorde" href="#">Launch a Barbarian Horde!</a>');

    $("#launchBarbarianHorde").click($.proxy(function () {
      this.launchBarbarianHorde();
    },this));
  },
  
  _clearMessage: function(){
    this._console.clear();
  },
  
}); 

var evolution = new Simulation([ Settler ]);