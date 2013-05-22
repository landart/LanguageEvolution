function makeBoundaries(coordinate,range,worldSize){
  return {
      min: Math.max(0,coordinate-range),
      max: Math.min(worldSize-1,coordinate+range)
  };
}

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}
