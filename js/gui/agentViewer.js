var AgentViewer = Class.create({

  defaults: { },
  options: { },

  _$container: null,
  _agentViews: [],
  
  _displayingAgent: null,
  _simulation: null,

  init: function (options, state, simulation) {

    this._simulation = simulation || null;
    this.options = $.extend({}, this.defaults, options);
    this._$container = $(options.container);

    // TODO: nasty glitch between redraws: cannot click on the element on that case
    this._$container.on('click', 'div', $.proxy(this._onAgentClick, this));

    for (var i in state.agents) {
      var agent = state.agents[i];
      var $div = $(document.createElement('div'));
      
      $div.css('background-color', agent.getColor());
      $div.data('agent', agent);
      
      this._agentViews.push($div);
      this._$container.append($div);
    }
    
  },

  _onAgentClick: function (event) {
    var agent = $(event.target).data('agent');    
    
    if (agent !== this._displayingAgent){
      agent.userInteraction();
      this._displayingAgent = agent;  
    }
    else {
      this._simulation.hideDictionaryTooltips();
      this._displayingAgent = null;
    }
    
  },
  
  refresh: function() {
    var $div,
        elements;

    for (var i in this._agentViews) {
      $div = this._agentViews[i];
      $div.css('background-color', $div.data('agent').getColor());  
    }
    
    if (this._displayingAgent){
      // I'd very much like it but it does a heck of an effect with the refreshing recreating everything
      this._displayingAgent.userInteraction();
    }

    // It's a bit confusing... visually appealing, but where is the last agent I just clicked on?
    /*elements = this._$container.children('div').detach();

    // http://stackoverflow.com/questions/11923659/javascript-sort-rgb-values
    elements.sort(function(a, b) {
      var aComparable = $(a).css('background-color');
      var bComparable = $(b).css('background-color');
      return pusher.color(aComparable).hue() - pusher.color(bComparable).hue();
    });

    this._$container.append(elements);*/
  },

});
