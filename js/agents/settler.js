var Settler = Class.create(Agent.prototype,{

  className: 'Settler',
  
  _range: 3,  
  _genoma: '110001', // 6 bit, 110001 = settler agent
 
  init: function(index,state) {
    this._addRandomGene(index);
    
    this._index = index;
    this._state = state;
    this._dictionary = [];
  },
  
  nextStep: function(){    
    var elements = this.getElementsInRange();
    
    var behavior = new SettlerBehavior({
      agent: this,
      items: filterElementsByClassName(elements,'Item'),
      allItems: this._state.items,
      world: this._state.world,
      allItemsCatalogued: this._allItemsCatalogued(elements),
      agents: filterElementsByClassName(elements,'Settler'),
      dictionary: this._dictionary
    })
    
    behavior.getAction();  
    
  },
  
  
  
  _allItemsCatalogued: function(elements){
    var allCatalogued = true; 
    
    elements = filterElementsByClassName(elements,'Item');
    
    for (var i in elements){
      if (!this._dictionary[elements[i].getIndex()]){
        allCatalogued = false;
      }
    }
    
    return allCatalogued;
  },
  
  toString: function(){
    return '<span class="agent">S'+this._index+'</span>';
  }
}); 