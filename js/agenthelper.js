var AgentHelper = Class.create({

  _agent: null,
  _state: null,

  init: function (agent, state) {
    this._agent = agent;
    this._state = state;
  },

  randomMove: function (probability) {
    if (Math.random() > probability) return;

    var newCoordinates = this._state.map.freeCoordinatesAround(this._agent.getCoordinates());

    this._state.map.updateAtCoordinates(this._agent.getCoordinates(), null);
    this._state.map.updateAtCoordinates(newCoordinates, this._agent);
    this._agent.setCoordinates(newCoordinates);
  }

});