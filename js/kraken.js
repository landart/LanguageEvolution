var Kraken = Class.create(Agent.prototype,{

  className: 'Kraken',
  
  _range: 5,
  
  init: function(state) {
    this.sup();
    this._state = state;
  },
  
  nextStep: function(){    
    var elements = this.getElementsInRange();
    
    var behavior = new KrakenBehavior({
      agent: this,
      allItems: this._state.items,
      world: this._state.world,
      items: this._filterElementsByClassName(elements,'Item'),
      agents: this._filterElementsByClassName(elements,'Agent')
    })
    
    behavior.getAction();  
    
  },
  
  toString: function(){
    return '<span class="kraken">K</span>';
  }
  
}); // Inherits!!