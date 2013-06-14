var AgentViewer = Class.create({

  defaults: { },
  options: { },

  _$container: null,
  _agentViews: [],

  init: function (options, state) {
    this.options = $.extend({}, this.defaults, options);
    this._$container = $(options.container);

    this._$container.on('click', 'div', $.proxy(this._onAgentClick, this));

    for (var i in state.agents) {
      var $div = $(document.createElement('div'));
      $div.data('agent', state.agents[i]);
      this._agentViews.push($div);
      this._$container.append($div);
    }
  },

  _onAgentClick: function (event) {
    var $target = $(event.target);
  },

  refresh: function() {
    var $div,
        elements;

    for (var i in this._agentViews) {
      $div = this._agentViews[i];
      $div.css('background-color', $div.data('agent').getColor());  
    }

    elements = this._$container.children('div').detach();

    // http://stackoverflow.com/questions/11923659/javascript-sort-rgb-values
    elements.sort(function(a, b) {
      var aComparable = $(a).css('background-color');
      var bComparable = $(b).css('background-color');
      return pusher.color(aComparable).hue() - pusher.color(bComparable).hue();
    });

    this._$container.append(elements);
  },

});
