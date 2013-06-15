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
  var diff = 0;
  for (var i =0; i<gen1.length; i++){
    if (gen1[i] != gen2[i]) diff ++;  
  }
  
  return diff/gen1.length;
}

function getRandomName(){
  var options = ['rock','sand','stone','water','river','mountain','hill','grass','tree','animal','dog','cow','lion','sky','space','sun','moon','Mars','Venus','Pluto','Jupiter','Saturn','Mercury','Neptune','fish','tuna','boat','cloud','wind','air','plant','apple','pear','banana','tomato','onion','lettuce','snail','rat','creek','bread','milk','beer','bear','wolf','eagle','chicken','asteroid','planet','beach','paramount','cliff','reef','whale','shark','turtle','crab'];

  return options[Math.floor(Math.random()*options.length)];
}

function getRandomLanguage(step){
  step = step || 15;
  return Math.ceil(Math.random()*Math.round(360/step)) *step; // 0 is reserved
}

function dictionarySimilarity(dic1, dic2){
  var diff = 0;
  
  var allKeys = $.unique($.merge(Object.keys(dic1), Object.keys(dic2)));
  
  for (var i in allKeys){
    var key = allKeys[i];
    if (dic1[key] != dic2[key]) diff ++;
  }
   
  return diff/allKeys.length;
}