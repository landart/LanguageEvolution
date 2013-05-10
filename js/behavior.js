var Behavior = Class.create({
  
  _state: null,
  _speed: 1,
  
  init: function(state){
    this._state = state;
  },
  
  getAction: function(){},

  _moveAgent: function() {
    var world = this._state.world;
    var agent = this._state.agent;

    var position = world.getFreePositionAround(agent.getCoordinates(),this._speed);
    world.setElementAtPosition(agent.getCoordinates(), null);

    agent.setCoordinates(position);
    world.setElementAtPosition(position, agent);

  },
  
  _getRandomName: function(){

    var options = ['rock','sand','stone','water','river','mountain','hill','grass','tree','animal','dog','cow','lion','sky','space','sun','moon','Mars','Venus','Pluto','Jupiter','Saturn','Mercury','Neptune','fish','tuna','boat','cloud','wind','air','plant','apple','pear','banana','tomato','onion','lettuce','snail','rat','creek','bread','milk','beer','bear','wolf','eagle','chicken','asteroid','planet','beach','paramount','cliff','reef','whale','shark','turtle','crab'];

    return options[Math.floor(Math.random()*options.length)];
  }
  
  
});