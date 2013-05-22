var Barbarian = Class.create(Agent.prototype,{

  className: 'Barbarian',
  
  _range: 5,
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
      items: this._filterElementsByClassName(elements,'Item'),
      agents: this._filterElementsByClassName(elements,'Agent')
    })
    
    behavior.getAction();  
    
  },
  
  toString: function(){
    return '<span class="barbarian">B</span>';
  }
  
}); // Inherits!!