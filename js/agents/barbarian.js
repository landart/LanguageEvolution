var Barbarian = Class.create(Agent.prototype,{

  className: 'Barbarian',
  
  _range: 3,
  _genoma: '111001', // 6 bit, 111001 = barbarian agent
  
  init: function(index,state) {
    this._addRandomGene(index);
    
    this._index = index;
    this._state = state;
    this._dictionary = [];
  },
  
  nextStep: function(){    
    var elements = this.getElementsInRange();
    
    var behavior = new BarbarianBehavior({
      agent: this,
      allItems: this._state.items,
      world: this._state.world,
      items: filterElementsByClassName(elements,'Item'),
      agents: filterElementsByClassName(elements,'Agent')
    })
    
    behavior.getAction();  
    
  },
  
  toString: function(){
    return '<span class="barbarian">B</span>';
  }
  
}); // Inherits!!