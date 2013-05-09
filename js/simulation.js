var Simulation = Class.create({
  
  // configurable params
  numAgents: 6,
  numItems: 10,
  worldSize: 10,
  canvas: 'canvas',

  // inner attributes
  _agents: [],  
  _world: null,  
  _items: [],  
  _runInterval: null,

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
      this._agents[i] = new Agent(i,this.getState());
      this._world.place(this._agents[i]);
    }
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
    var that = this;
    
    that._initialDraw();
    
    this._runInterval = setInterval(function(){     
      that.nextStep();
      that._draw(); 
    },1000);
  },
  
  stop: function(){
    clearInterval(this._runInterval);
  },
  
  start: function(){
    this.run();
  },
  
  nextStep: function(){
    for (var index in this._agents){
      this._agents[index].nextStep();
    }
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
    
    cells.html('');
    
    for (var i in elements){
      var element = elements[i];   
      var position = element.getCoordinates();

      $(cells[position.x+position.y*this._world.getSize()]).html(element.toString());
    }
    
    for (var i in this._agents){
      var element = this._agents[i];  
      if (element.className == 'Agent'){
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
