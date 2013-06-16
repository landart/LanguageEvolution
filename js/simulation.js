var Simulation = Class.create({

  options: {
    agents: {
      'settler': {
        'behavior': SettlerBehavior,
        // Funny fact: increase a little this value and there is a critical mass
        // many influences, it will take ages to converge
        'num': 50
      },
      'barbarian': {
        'behavior': BarbarianBehavior,
        'num': 20
      },
      'item': {
        'num': 50
      }
    },

    genomicLenght: 32,
    speed: 10,             
    worldSize: 60,
    similarityThreshold: 0.25,
    dictionarySimilarityThreshold: 0.05,
    neologismFactor: 0.00001, // very low, otherwise neologisms won't allow convergence
    
    console: '#console',
    map: '#map',
    agentViewerPane: '#agent-viewer',
    agentPropertiesPane: '#agent-properties',
    actionReset: '#action-reset',
    actionPlay: '#action-play',
    actionPause: '#action-pause',
    actionHorde: '#action-horde',
    speedSlider: '#speed-slider',
    sortAgentSwitch: '#sort-agent-switch',
    iterationField: '#iterationField',
    ipsField: '#ipsField',    
    populationField: '#populationField',

    // The higher this value, the less the IPS will be affected by quick changes
    // Setting this to 1 will show you the IPS of the last sampled frame only
    // http://stackoverflow.com/questions/5078913/html5-canvas-performance-calculating-loops-frames-per-second
    ipsFilter: 10,

    ipsRefreshRate: 200,          // ms
    populationRefreshRate: 5000,  // ms
    agentViewerRefreshRate: 500,  // ms
  },

  // inner attributes
  _agents: [],   
  _items: [],  
  _simulationTimeout: null,
  _refreshPopulationInterval: null,
  _refreshIpsInterval: null,
  _refreshAgentViewInterval: null,
  _running: false,
  _clock: 0,
  _ips: 0,
  _lastUpdate: null,
  _speed: 0,
  _lastPopulationCount: 0,
  _console: null,
  _map: null,
  _agentViewer: null,
  _$speedSlider: null,
  _$sortAgentSwitch: null,
  _$iterationField: null,
  _$ipsField: null,
  _$populationField: null,

  // constructor
  init: function () {
    this._speed = this.options.speed;

    this._initGui();
    this._initMap();
    this._initItems();
    this._initAgents();
    this._initConsole();
    this._initAgentViewer();
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

  _onSortAgent: function (event, data) {
    this._agentViewer.setAgentSorting(data.value);
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
      case 66: // b
        this._launchBarbarianHorde();
        break;
      case 65: // a
        this._$sortAgentSwitch.bootstrapSwitch('toggleState');
        break;
    }
  },

  _initGui: function () {
    var that = this;

    this._$speedSlider = $(this.options.speedSlider);
    this._$sortAgentSwitch = $(this.options.sortAgentSwitch);
    this._$iterationField = $(this.options.iterationField);
    this._$ipsField = $(this.options.ipsField);
    this._$populationField = $(this.options.populationField);

    this._$iterationField
      .tooltip({ placement: 'bottom', trigger: 'hover', title: 'Number of iterations' });
    this._$ipsField
      .tooltip({ placement: 'bottom', trigger: 'hover', title: 'Number of iteration computed by seconds' });
    this._$populationField
      .tooltip({
        placement: 'bottom',
        trigger: 'hover',
        title: 'Current population and changes over last ' + this.options.populationRefreshRate / 1000 + ' seconds' });

    $(this.options.actionReset)
      .click($.proxy(this._onReset, this))
      .popover({
        placement: 'bottom',
        trigger: 'hover',
        html: true,
        title: 'Reset',
        content: 'Shortcut <kbd>R</kbd>',
        container: 'body' });
        
    $(this.options.actionPlay)
      .click($.proxy(this._onPlay, this))
      .popover({
        placement: 'bottom',
        trigger: 'hover',
        html: true,
        title: 'Play',
        content: 'Shortcut <kbd>P</kbd>',
        container: 'body' });
        
    $(this.options.actionPause)
      .click($.proxy(this._onPause, this))
      .popover({
        placement: 'bottom',
        trigger: 'hover',
        html: true,
        title: 'Pause',
        content: 'Shortcut <kbd>S</kbd>',
        container: 'body' });
    
    $(this.options.actionHorde)
      .click($.proxy(this._launchBarbarianHorde, this))
      .popover({
        placement: 'bottom',
        trigger: 'hover',
        html: true,
        title: 'Barbarian Horde',
        content: 'Shortcut <kbd>B</kbd>',
        container: 'body' });
        
    $(window.document).bind('keyup', $.proxy(this._keyHandler, this)); 

    this._$speedSlider
      .slider({ min: 1, max: 100, value: this._speed || 1 })
      .on('slide', $.proxy(this._onSpeed, this));

    this._$sortAgentSwitch
      .bootstrapSwitch()
      .on('switch-change', $.proxy(this._onSortAgent, this))
      .popover({
        placement: 'right',
        trigger: 'hover',
        html: true,
        title: 'Sort agent by language',
        content: 'Shortcut <kbd>A</kbd>',
        container: 'body' });
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
    for (var i = 0; i < this.options.agents.settler.num; i++) {
      var agent = new Agent(this.options.agents.settler.behavior, this.getState(), this.options, this, i);
      this._agents.push(agent);
      this._map.placeAtRandomCoordinates(agent);
    }
  },

  _initConsole: function () {
    this._console = new Console({ container: this.options.console });
  },

  _initAgentViewer: function () {
    this._agentViewer = new AgentViewer({
      mainPane: this.options.agentViewerPane,
      propertiesPane: this.options.agentPropertiesPane
    }, this);
  },
  
  _launchBarbarianHorde: function() {
    var size = this.options.agents.barbarian.num;
    
    for (var i = 0; i < size; i++) {
      var barbarian = new Agent(this.options.agents.barbarian.behavior, this.getState(), this.options, this);
      this._agents.push(barbarian);
      this._map.placeAtRandomCoordinatesNearBorder(barbarian,"right");
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
      this._setupSimulationTiming();
      this._running = true;
    }
  },

  stop: function(){
    // something else about stop?
    this.pause();
  },

  pause: function () {
    this._clearSimulationTiming();
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
  
  _setupSimulationTiming: function () {
    this._ips = 0;
    this._lastUpdate = (new Date)*1 - 1;
    this._onRefreshIps();
    this._refreshIpsInterval = setInterval($.proxy(this._onRefreshIps, this), this.options.ipsRefreshRate);

    this._onRefreshPopulation();
    this._refreshPopulationInterval = setInterval($.proxy(this._onRefreshPopulation, this), this.options.populationRefreshRate);
    
    this._agentViewer.refresh();
    this._refreshAgentViewInterval = setInterval($.proxy(this._agentViewer.refresh, this._agentViewer), this.options.agentViewerRefreshRate);

    this._onSimulationTick();
  },

  _onRefreshPopulation: function () {
    var populationCount = this._agents.length,
        populationDiff = populationCount - this._lastPopulationCount,
        diffCss;

    if (populationDiff >= 0) {
      diffCss = 'color: green';
    } else {
      diffCss = 'color: red';
    }

    this._$populationField.html(populationCount + ' <span style="' + diffCss + '">(' + (populationDiff >= 0 ? '+' : '-') + (populationDiff) + ')</span>');
    this._lastPopulationCount = populationCount;
  },

  _onRefreshIps: function () {
    this._$ipsField.text(this._ips.toFixed(1) + " ips");
  },

  _onSimulationTick: function () {
    var currentIps,
        now;

    this.tick();
    this._simulationTimeout = setTimeout($.proxy(this._onSimulationTick, this), Math.round(1000/this._speed));

    currentIps = 1000 / ((now = new Date) - this._lastUpdate);
    this._ips += (currentIps - this._ips) / this.options.ipsFilter;
    this._lastUpdate = now;
  },

  _clearSimulationTiming: function () {
    clearTimeout(this._simulationTimeout);
    clearInterval(this._onRefreshPopulation);
    clearInterval(this._refreshIpsInterval);
    clearInterval(this._refreshAgentViewInterval);
  },
  
  tick: function() {
    for (var i in this._agents) {
      if (this._agents[i]){
        this._agents[i].tick();
      }      
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
  
  destroyAgent: function(agent){    
    this._agents = $.grep(this._agents, function(value) {
      return value !== agent;
    });
    
    delete agent;    
  },

  clearDictionaryTooltips: function() {
    var allItems = this._items;

    for (var i in allItems) {
      allItems[i].$getCell().tooltip('destroy');
    }
  },

  getAgents: function () {
    return this._agents;
  }
  
}); 

var evolution = new Simulation();
