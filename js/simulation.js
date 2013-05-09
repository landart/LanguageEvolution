var Simulation = Class.create({
  
  // configurable params
  numAgents: 5,
  numItems: 5,
  worldSize: 15,

  // inner attributes
  _agents: [],  
  _world: null,  
  _items: [],  

  // constructor
  init: function() {
    console.log('You instantiated a simulation!');
    
    this._initWorld();
    this._initItems();
    this._initAgents();
  },
  
  _initWorld: function(){
    this._world = new World(this.worldSize);
  },
  
  _initItems: function(){
    for (var i =0; i<this.numItems; i++){
      this._items[i] = new Item();
      
      this._world.place(this._items[i]);
    }
  },
  
  _initAgents: function(){
    for (var i = 0; i<this.numAgents; i++){
      this._agents[i] = new Agent();
      this._world.place(this._agents[i]);
    }
  },
  
  // execution
  run: function(){
    console.log('Simulation running');
  }
}); 

var evolution = new Simulation();
evolution.run();
