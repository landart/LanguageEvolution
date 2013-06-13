function makeBoundaries(coordinate, range, worldSize) {
  return {
    min: Math.max(0, coordinate - range),
    max: Math.min(worldSize - 1, coordinate + range)
  };
}

function pad(num, size) {
  var s = num + "";
  while (s.length < size)
  s = "0" + s;
  return s;
}

function filterElementsByClassName(elements, className) {
  var result = [];

  for (var i in elements) {
    if (elements[i].className == className) {
      result.push(elements[i])
    }
  }

  return result;
};

function getRandomCardinalPoint(){
  var cardinalPoints = ['north','east','south','west'];
  return cardinalPoints[Math.round(Math.random()*4)];
}

function getRandomGenoma(length){
  return pad(new Number((Math.random()*Math.pow(2,length))).toString(2),length);
}

function genomicSimilarity(gen1, gen2){
  diff = 0;
  for (var i =0; i<gen1.length; i++){
    if (gen1[i] != gen2[i]) diff ++;  
  }
  
  return diff/gen1.length;
}

function getRandomName(){
  var options = ['rock','sand','stone','water','river','mountain','hill','grass','tree','animal','dog','cow','lion','sky','space','sun','moon','Mars','Venus','Pluto','Jupiter','Saturn','Mercury','Neptune','fish','tuna','boat','cloud','wind','air','plant','apple','pear','banana','tomato','onion','lettuce','snail','rat','creek','bread','milk','beer','bear','wolf','eagle','chicken','asteroid','planet','beach','paramount','cliff','reef','whale','shark','turtle','crab'];

  return options[Math.floor(Math.random()*options.length)];
}


Array.prototype.compare = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;

    for (var i = 0; i < this.length; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].compare(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}