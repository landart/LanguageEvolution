var Simulation = Class.create({

  options: {
    agents: {
      'settler': {
        'behavior': SettlerBehavior,
        'num': 25
      },
      'barbarian': {
        //'behavior': BarbarianBehavior,
        'num': 2
      },
      'item': {
        //'behavior': ItemBehavior,
        'num': 50
      }
    },

    genomicLenght: 32,
    speed: 50,                        // Ticks per second
    worldSize: 50,
    similarityThreshold: 0.25,
    neologismFactor: 0.05,
    
    console: '#console',
    map: '#map',
    actionReset: '#action-reset',
    actionPlay: '#action-play',
    actionPause: '#action-pause',
    speedSlider: '#speed-slider',
    iterationField: '#iterationField'    
  },

  // inner attributes
  _agents: [],   
  _items: [],  
  _timeoutHandle: null,
  _running: false,
  _clock: 0,
  _speed: 0,
  _console: null,
  _map: null,
  _$speedSlider: null,
  _$iterationField: null,

  // constructor
  init: function () {
    this._speed = this.options.speed;

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

  _onSpeed: function (event) {
    this._speed = this._$speedSlider.data('value') || this._speed;
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
    var that = this;

    this._$map = $(this.options.map);
    this._$speedSlider = $(this.options.speedSlider);
    this._$iterationField = $(this.options.iterationField);

    $(this.options.actionReset)
      .click($.proxy(this._onReset, this))
      .popover({ placement: 'bottom', trigger: 'hover', html: true, title: 'Reset', content: 'Shortcut <kbd>R</kbd>', container: 'body' });
    $(this.options.actionPlay)
      .click($.proxy(this._onPlay, this))
      .popover({ placement: 'bottom', trigger: 'hover', html: true, title: 'Play', content: 'Shortcut <kbd>P</kbd>', container: 'body' });
    $(this.options.actionPause)
      .click($.proxy(this._onPause, this))
      .popover({ placement: 'bottom', trigger: 'hover', html: true, title: 'Pause', content: 'Shortcut <kbd>S</kbd>', container: 'body' });
    $(window.document).bind('keyup', $.proxy(this._keyHandler, this));

    this._$speedSlider
      .slider({ min: 1, max: 100, value: this._speed || 1 })
      .on('slide', $.proxy(this._onSpeed, this))
  },
  
  _initMap: function (){
    this._map = new Map(this.options.map, {
      size: this.options.worldSize,
    });
  },
  
  _initItems: function () {
    var item;

    for (var i =0; i < this.options.agents.item.num; i++){
      item = new Item(this.getState(),this.options.genomicLenght);
      this._items[i] = item;
      this._map.placeAtRandomCoordinates(item);
    }
  },
  
  _initAgents: function () {
    var agent;

    for (var i = 0; i < this.options.agents.settler.num; i++) {
      agent = new Agent(this.options.agents.settler.behavior, this.getState(), this.options);
      this._agents.push(agent);
      this._map.placeAtRandomCoordinates(agent);
    }
  },

  _initConsole: function () {
    this._console = new Console({ container: this.options.console });
  },
  
  launchBarbarianHorde: function(size) {
    size = size || this.options.agents.barbarian.num;
    
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
    this._clearMessage();
    this.stop();
    this._clearCanvas();
    this._clearInnerData();    
    
    this._speed = this.options.speed;

    this._initItems();
    this._initAgents();
    
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
  
  _clearInnerData: function(){
    for (var i in this._items){
      this._items[i] = null;
    }
    
    for (var i in this._agents){
      this._agents[i] = null;
    }
    
    this._agents = [];   
    this._items = [];  
    this._timeoutHandle = null;
    this._running = false;
    this._clock = 0;
    this._speed = 0;
  },
  
  _clearCanvas: function() {
    for (var i in this._items){
      this._items[i]._$cell.html("");
    }
    
    for (var i in this._agents){
      this._agents[i]._$cell.html("");
    }
  },
  
  _setupInterval: function () {
    var that = this;
    this._onTimeout();
  },

  _onTimeout: function () {
    this.tick();
    this._timeoutHandle = setTimeout($.proxy(this._onTimeout, this), Math.round(1000/this._speed));
  },

  _removeInterval: function () {
    clearInterval(this._timeoutHandle);
  },
  
  tick: function() {
    for (var i in this._agents) {
      this._agents[i].tick();
    }
    
    this._clock++;
    this._$iterationField.text(this._clock);
    
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

var evolution = new Simulation();
