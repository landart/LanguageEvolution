var Barbarian = Class.create(Agent.prototype,{

  className: 'Barbarian',
  
  _range: 5,
  
  init: function(state) {
    this.sup();
    this._state = state;
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