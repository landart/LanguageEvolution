var Simulation = Class.create({

  options: {
    agents: {
      'settler': {
        'behavior': SettlerBehavior,
        'num': 35 // funny fact: increase a little bit and there is a critical mass: many influences, it will take ages to converge
      },
      'barbarian': {
        //'behavior': BarbarianBehavior,
        'num': 2
      },
      'item': {
        //'behavior': ItemBehavior,
        'num': 40
      }
    },

    genomicLenght: 32,
    speed: 50,             
    worldSize: 60,
    similarityThreshold: 0.25,
    neologismFactor: 0.00001, // very low, otherwise neologisms won't allow convergence
    
    console: '#console',
    map: '#map',
    actionReset: '#action-reset',
    actionPlay: '#action-play',
    actionPause: '#action-pause',
    speedSlider: '#speed-slider',
    iterationField: '#iterationField',
    ipsField: '#ipsField',    

    // The higher this value, the less the IPS will be affected by quick changes
    // Setting this to 1 will show you the IPS of the last sampled frame only
    // http://stackoverflow.com/questions/5078913/html5-canvas-performance-calculating-loops-frames-per-second
    ipsFilter: 10,
  },

  // inner attributes
  _agents: [],   
  _items: [],  
  _timeoutHandle: null,
  _running: false,
  _clock: 0,
  _ips: 0,
  _lastUpdate: null,
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
    this._$ipsField = $(this.options.ipsField);

    this._$iterationField
      .tooltip({ placement: 'bottom', trigger: 'hover', title: 'Number of iterations' });
    this._$ipsField
      .tooltip({ placement: 'bottom', trigger: 'hover', title: 'Number of iteration computed by seconds' });

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

    this._ips = 0;
    this._lastUpdate = (new Date)*1 - 1;
    setInterval(function(){
      that._$ipsField.text(that._ips.toFixed(1) + " ips");
    }, 1000);
    
    this._onTimeout();
  },

  _onTimeout: function () {
    var currentIps,
        now;

    this.tick();
    this._timeoutHandle = setTimeout($.proxy(this._onTimeout, this), Math.round(1000/this._speed));

    currentIps = 1000 / ((now = new Date) - this._lastUpdate);
    this._ips += (currentIps - this._ips) / this.options.ipsFilter;
    this._lastUpdate = now;
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
    
    /*if (this._checkConvergence()){
      this._showSuccessMessage();   
    }*/
  },
  
  _checkConvergence: function(){
    for (var index=0; index < this._agents.length-1; index++){
      if (!objectsAreEqual(this._agents[index].getDictionary(),this._agents[index+1].getDictionary())){
        return false;
      }      
    }
    
    return true;
  },
    
  _showSuccessMessage: function() {
    this._console.success('The simulation has converged in <strong><em>' + this._clock + '</em></strong> iterations!');
    
    
    /*$("#launchBarbarianHorde").click($.proxy(function () {
      this.launchBarbarianHorde();
    },this));*/
  },
  
  _clearMessage: function(){
    this._console.clear();
  },
  
}); 

var evolution = new Simulation();
