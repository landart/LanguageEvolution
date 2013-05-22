var Simulation = Class.create({
  
  // configurable params
  numAgents: 4,
  numItems: 10,
  worldSize: 5,
  canvas: 'canvas',

  // inner attributes
  _agents: [],  
  _world: null,  
  _items: [],  
  _kraken: null,
  _runInterval: null,
  _running: false,
  _clock: 0,

  // constructor
  init: function() {
    this._initWorld();
    this._initItems();
    this._initAgents();
  },
  
  _initWorld: function(){
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
    },1000);
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
    $('#results').html('<h3>The Kraken has been released, producing chaos. <a id="lockTheKraken" href="#">Lock it!</a></h3>');
    
    $("#lockTheKraken").click($.proxy(function () {
      this.lockTheKraken();
    },this));
  },
  
  _showSuccessMessage: function(){
    $('#results').html('<h3 class="success">The simulation has converged in '+this._clock+' iterations. <a id="releaseTheKraken" href="#">Release the Kraken!</a></h3>');
    
    $("#releaseTheKraken").click($.proxy(function () {
      this.releaseTheKraken();
    },this));
  },
  
  _clearMessage: function(){
    $('#results').html('');
  },
  
  _initialDraw: function(){
    var canvas = $('#'+this.canvas);
    canvas.html(this._drawBoard());  
  },
  
  _drawBoard: function(){
    var html = '<table id="board">';
    
    html += '<tr><th></th>';
    for (var h=0; h<this.worldSize; h++){
      html += '<th>'+h+'</th>';
    }
    html += '</tr>'
    
    for (var y=0; y<this.worldSize; y++){
      html+='<tr><th>'+y+'</th>';
      for (var x=0; x<this.worldSize; x++){
        html+='<td></td>';
      }
      html+='</tr>';
    }
    html+='</table>';
    
    html+='<table id="dictionaries">';
    html+='<tr>';
    for (var x=-1; x<this.numItems; x++){
      html+='<th>'+(x>=0?'I'+x:'')+'</th>';
    }
    html+='</tr>';
    
    for (var h=0; h<this.numAgents; h++){
      html += '<tr><th>A'+h+'</th>';
      for (var x=0; x<this.numItems; x++){
        html+='<td></td>';
      }
      html+='</tr>';
    }
    html+='</table>';
    
    return html;
  },
  
  _draw: function(){
    var cells = $('#'+this.canvas+' td');    
    var elements = [].concat(this._items).concat(this._agents);
    if (this._kraken){
      elements = elements.concat(this._kraken);
    }

    cells.html('');
    
    for (var i in elements){
      var element = elements[i];   
      var position = element.getCoordinates();

      $(cells[position.x+position.y*this._world.getSize()]).html(element.toString());
    }
    
    for (var i in this._agents){
      var element = this._agents[i];  
      if (element.className == 'Settler'){
        for (var j in element._dictionary){
          var td = parseInt(j)+1;
          var tr = parseInt(i)+1;
          $($('#dictionaries tr')[tr].children[td]).html(element._dictionary[j]);  
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
