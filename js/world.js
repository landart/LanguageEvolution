var World = Class.create({  
  
  _size: 10,
  _cells: [],

  init: function(size) {
    this._size = size || this._size;
    console.log('You instantiated a world of size '+this._size+'!');
    
    this._initCells();
  },
  
  _initCells: function(){
    for (var x=0; x<this._size; x++){
      this._cells[x] = [] 
      for (var y=0; y<this._size; y++){
        this._cells[x][y] = null;
      }
    }
    console.log(this._cells);
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
  }
}); 