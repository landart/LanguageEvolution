var Simulation = Class.create({
  
  // configurable params
  numAgents: 5,
  numItems: 25,
  worldSize: 15,
  canvas: 'canvas',

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
      this._items[i] = new Item(i);
      
      this._world.place(this._items[i]);
    }
  },
  
  _initAgents: function(){
    for (var i = 0; i<this.numAgents; i++){
      this._agents[i] = new Agent(i);
      this._world.place(this._agents[i]);
    }
  },
  
  // execution
  run: function(){
    console.log('Simulation running');
    
    this._draw();
  },
  
  _draw: function(){
    var canvas = $('#'+this.canvas);
    canvas.html(this._drawBoard());//+this._drawItems());
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
        html+='<td>'+this._world.getElementAtPosition(x,y).toString()+'</td>';
      }
      html+='</tr>';
    }
    html+='</table>';
    
    return html;
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
