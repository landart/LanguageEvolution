var Map = Class.create({

  options: null,
  'default': {
    size: 200,
  },

  _$target: null,
  _cells: [],


  init: function (target, options) {
    var that = this;

    this._$target = $(target);
    this.options = jQuery.extend(this['default'], options || {});

    this._buildStructure();

    this._$target.on('click', 'td', function () {
      if (this.element && this.element.userInteraction) {
        this.element.userInteraction();
      }
    });
  },


  _buildStructure: function () {
    var size = this.options.size,
        table = this._$target,
        body = $(document.createElement('tbody')),
        row,
        cell;

    for (var y = 0; y < size; y++) {
      row = $(document.createElement('tr'));
      for (var x = 0; x < size; x++) {
        cell = document.createElement('td');
        cell.element = null;
        cell.coordinates = { x: x, y: y };
        this._cells.push(cell);
        row.append(cell);
      }
      body.append(row);
    }
    table.append(body);
  },

  _randomCoorindate: function () {
    return Math.floor((Math.random() * this.options.size));
  },

  _bounds: function (coordinate, range) {
    return {
      min: Math.max(0, coordinate - range),
      max: Math.min(this.options.size - 1, coordinate + range)
    };
  },


  placeAtRandomCoordinates: function (element) {
    var cells = this._cells.slice(0);

    for (var i = cells.length - 1; i >= 0; i--) {
      if (cells[i].element !== null) {
        cells.splice(i, 1);
      }
    }

    return this.placeAtRandomCell(element,cells);
  },
  
  placeAtRandomCell: function(element, cells) {    
    var cell = null;
    
    if (cells.length) {
      cell = cells[Math.floor((Math.random() * cells.length))];
      cell.element = element;
      element.setCoordinates(cell.coordinates);
      return true;
    }
    
    return false;      
  },
  
  placeAtRandomCoordinatesNearBorder: function(element, border){
    switch (border) {
      case 'right':
      case 'left':
      case 'bottom':
      case 'up':
      default:
        var cells = [];
        var x = this.options.size-1;
        
        for (var y = 0; y < this.options.size; y++){
          var coordinates = {x:x,y:y};
          if (this.isCoordinatesEmpty(coordinates)){
            cells.push(this.getCellAtCoordinates(coordinates));
          }
        }
        
        return this.placeAtRandomCell(element,cells);
    }
  },

  updateAtCoordinates: function (coordinates, element) {
    this.getCellAtCoordinates(coordinates).element = element;
  },

  isCoordinatesEmpty: function (coordinates) {
    return this.getCellAtCoordinates(coordinates).element === null;
  },
  
  getCellAtCoordinates: function(coordinates) {
    return this._cells[coordinates.y * this.options.size + coordinates.x]
  },
  
  getJQueryCellAtCoordinates: function (coordinates) {
    return $(this.getCellAtCoordinates(coordinates));
  },
  
  getCellsAround: function(coordinates, range){
    range = range || 1;

    var xBounds = this._bounds(coordinates.x, range),
        yBounds = this._bounds(coordinates.y, range),
        cells = [];
    
    for (var x = xBounds.min; x <= xBounds.max; x++) {
      for (var y = yBounds.min; y <= yBounds.max; y++) {    
        if (x === coordinates.x && y === coordinates.y) continue;
        cells.push(this.getCellAtCoordinates({x:x,y:y}));
      }
    }
    
    return cells;
  },

  freeCoordinatesAround: function (coordinates, range) {    
    
    freeCoordinates = this.allFreeCoordinatesAround(coordinates, range);

    if (freeCoordinates.length) {
      return freeCoordinates[Math.floor(Math.random() * freeCoordinates.length)];
    }

    return coordinates;
  },
  
  allFreeCoordinatesAround: function(coordinates, range){
    var cells = this.getCellsAround(coordinates, range);
    var freeCoordinates = [];
    
    for (var i in cells){
      if (this.isCoordinatesEmpty(cells[i].coordinates)){
        freeCoordinates.push(cells[i].coordinates);
      }
    }
    
    return freeCoordinates;
  },
  
  freeCoordinatesFromDirection: function(coordinates, direction){
    var allFreeCoords = this.allFreeCoordinatesAround(coordinates);
    
    var freeCoordinates = [];
    
    for (var i in allFreeCoords){
      if ( $.inArray(direction,this.getRelativePositionOfCoordinates(allFreeCoords[i], coordinates)) == -1) {
        freeCoordinates.push(allFreeCoords[i]);
      }
    }
        
    if (freeCoordinates.length) {
      return freeCoordinates[Math.floor(Math.random() * freeCoordinates.length)];
    }

    return coordinates;
  },
  
  getRelativePositionOfCoordinates: function(target, reference){
    var position = [];
     
    if(target.y > reference.y){
      position.push('bottom');
    }
    if (target.y < reference.y){
      position.push('top');
    }
    if (target.x > reference.x){
      position.push('right');
    }
    if (target.x < reference.x){
      position.push('left');
    }
    
    return position;
  },

  elementsAround: function (coordinates, range) {
    var elements = [];
    var cells = this.getCellsAround(coordinates, range);
    
    for (var i in cells){
      var element = this.elementAtCoordinates(cells[i].coordinates);
      if (element) {
        elements.push(element);
      }
    }

    return elements;
  },
  
  elementAtCoordinates: function (coordinates) {
    return this._cells[coordinates.y * this.options.size + coordinates.x].element;
  },
  
  areCoordinatesInTheBorder: function(coordinates, border){
    switch (border) {
      case 'right':
      case 'left':
      case 'bottom':
      case 'up':
      default:
        if (coordinates.x == 0){
          return true;
        }
        return false;
    }
  }

});