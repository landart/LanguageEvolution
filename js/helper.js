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