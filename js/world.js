var World = Class.create({  
  
  _size: 10,
  _cells: [],

  init: function(size) {
    this._size = size || this._size;
    
    this._initCells();
  },
  
  _initCells: function(){
    for (var x=0; x<this._size; x++){
      this._cells[x] = [] 
      for (var y=0; y<this._size; y++){
        this._cells[x][y] = null;
      }
    }
  },
  
  place: function(element){
    var coords = this._getRandomFreeCoordinates();
    
    if (!coords){
      console.warn('Could not assign a free place');
      return;
    }
    
    this._cells[coords.x][coords.y] = element;
    
    element.setCoordinates(coords);
    
  },
  
  _getRandomFreeCoordinates: function(){
    var x = this._getRandomCoordinate();
    var y = this._getRandomCoordinate();
    
    // loop until a free position 
    var counter = 10;
    while(this._cells[x][y]!=null && counter){
      x = this._getRandomCoordinate();
      y = this._getRandomCoordinate();
      
      counter--;
    }
    
    if (!counter){
      return null;
    }
    
    return {x:x,y:y};
  },
  
  _getRandomCoordinate: function(){
    return Math.floor((Math.random()*this._size));
  },
  
  getElementAtPosition: function(x,y){
    if (x === null || y===null){
      return null;
    }
    
    return this._cells[x][y];
  },
  
  setElementAtPosition: function(position,element){
    this._cells[position.x][position.y] = element;
  },
  
  getFreePositionAround: function(position){

    // copy object to avoid accidental tampering
    var center = {
      x: position.x,
      y: position.y
    };
    
    var free = [center];
     
    // calculate free positions around
    var xBoundary = this._makeBoundaries(center.x);
    var yBoundary = this._makeBoundaries(center.y);
        
    for (var x=xBoundary.min; x<=xBoundary.max; x++){
      for (var y=yBoundary.min; y<=yBoundary.max; y++){     
        if (this._cells[x][y] === null){
          free.push({x:x,y:y});
        }
      }
    }
    
    if (free.length){
      return free[Math.floor(Math.random()*free.length)];
    }
    
    console.warn('Cannot find a free position around',center.x,center.y);
    return center;
  },
  
  _makeBoundaries: function(coordinate){
    return makeBoundaries(coordinate,1,this._size);
  },
  
  getSize: function(){
    return this._size;
  }
}); 