var Agent = Class.create({
  className: 'Agent', 
  
  _index: 0,    
  _genoma: '110000', // 6 bit, 110000 = general agent
  
  // apparently, there is a bug preventing this function to execute when it is overriden in the child class
  init: function(){},
  
  addRandomGene: function(index) {
    this._genoma += pad(new Number(index).toString(2),6);
  },  
}); 