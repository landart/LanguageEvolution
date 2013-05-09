function makeBoundaries(coordinate,range,worldSize){
  return {
      min: Math.max(0,coordinate-range),
      max: Math.min(worldSize-1,coordinate+range)
  };
}
