var Map = Class.create({

  options: null,
  default: {
    size: 200,
  },

  _$target: null,
  _cells: [],


  init: function (target, options) {
    this._$target = $(target);
    this.options = jQuery.extend(this.default, options || {});
    this._buildStructure();
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
    var cells = this._cells.slice(0),
        randomCell;

    for (var i = cells.length - 1; i >= 0; i--) {
      if (cells[i].element !== null) {
        cells.splice(i, 1);
      }
    }

    if (cells.length) {
      randomCell = cells[Math.floor((Math.random() * cells.length))];
      randomCell.element = element;
      element.setCoordinates(randomCell.coordinates);
      return true;
    } else {
      return false;
    }
  },

  updateAtCoordinates: function (coordinates, element) {
    this._cells[coordinates.y * this.options.size + coordinates.x].element = element;
  },

  isCoordinatesEmpty: function (coordinates) {
    return this._cells[coordinates.y * this.options.size + coordinates.x].element === null;
  },

  freeCoordinatesAround: function (coordinates, range) {    
    range = range || 1;

    var xBounds = this._bounds(coordinates.x, range),
        yBounds = this._bounds(coordinates.y, range),
        freeCoordinates = [],
        localCoordinates;
    
    for (var x = xBounds.min; x <= xBounds.max; x++) {
      for (var y = yBounds.min; y <= yBounds.max; y++) {    
        if (x === coordinates.x && y === coordinates.y) continue;
        localCoordinates = { x:x, y:y };
        if (this.isCoordinatesEmpty(localCoordinates)) {
          freeCoordinates.push(localCoordinates);
        }
      }
    }

    if (freeCoordinates.length) {
      return freeCoordinates[Math.floor(Math.random() * freeCoordinates.length)];
    }

    return coordinates;
  },

  elementAtCoordinates: function (coordinates) {
    return this._cells[coordinates.y * this.options.size + coordinates.x].element;
  },

  elementsAround: function (coordinates, range) {
    range = range || 1;

    var xBounds = this._bounds(coordinates.x, range),
        yBounds = this._bounds(coordinates.y, range),
        elements = [],
        element;

    for (var x = xBounds.min; x <= xBounds.max; x++) {
      for (var y = yBounds.min; y <= yBounds.max; y++) {    
        if (x === coordinates.x && y === coordinates.y) continue; 
        element = this.elementAtCoordinates(coordinates);
        if (element) {
          elements.push(element);
        }
      }
    }

    return elements;
  },
  
  cellAtCoordinates: function (coordinates) {
    return $(this._cells[coordinates.y * this.options.size + coordinates.x]);
  },

});