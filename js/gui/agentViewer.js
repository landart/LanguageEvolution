var AgentViewer = Class.create({

  defaults: {
    noSelectionTemplate: '<a class="muted">No selection</a>'
  },
  options: null,

  _$mainPane: null,
  _$propertiesPane: null,
  _$propertiesList: null,
  _$identifierField: null,
  _$karmaField: null,
  _$languageField: null,
  _$displayedAgent: null,
  _simulation: null,
  _agentViews: [],
  _agentSorting: false,
  _displayedAgent: null,
  
  init: function (options, simulation) {

    this._simulation = simulation;
    this.options = $.extend({}, this.defaults, options);
    
    this._$mainPane = $(this.options.mainPane);
    this._$propertiesPane = $(this.options.propertiesPane);

    var agents = this._simulation.getAgents();

    this._setupTemplate();
    this._displayNoSelection();

    // TODO: nasty glitch between redraws: cannot click on the element on that case
    this._$mainPane.on('click', 'div', $.proxy(this._onAgentClick, this));

    for (var i in agents) {
      var agent = agents[i];
      var $div = $(document.createElement('div'));
      
      $div.css('background-color', agent.getColor());
      $div.data('agent', agent);
      
      this._agentViews.push($div);
      this._$mainPane.append($div);
    }
    
  },

  _onAgentClick: function (event) {
    var $target = $(event.target),
        target = $target.data('agent'),
        previous = this._displayedAgent,
        $previous = this._$displayedAgent;    

    this._displayedAgent = target;
    this._$displayedAgent = $target;

    if ($previous) {
      $previous.removeClass('selected');
    }

    if (target === previous) {
      this._simulation.clearDictionaryTooltips();
      this._displayNoSelection();
    } else {
      $target.addClass('selected');
      this._displayAgentProperties();
      target.userInteraction();
    }
  },

  _setupTemplate: function () {
    this._$propertiesList = $(document.createElement('dl')).addClass('dl-horizontal');

    this._$propertiesList.append($(document.createElement('dt'))
      .text('Identifier')
      .tooltip( { title: '' }));
    this._$propertiesList.append(this._$identifierField = $(document.createElement('dd')));

    this._$propertiesList.append($(document.createElement('dt'))
      .text('Karma')
      .tooltip( { title: '' }));
    this._$propertiesList.append(this._$karmaField = $(document.createElement('dd')));

    this._$propertiesList.append($(document.createElement('dt'))
      .text('Language')
      .tooltip( { title: '' }));
    this._$propertiesList.append(this._$languageField = $(document.createElement('dd')));
  },

  _displayNoSelection: function () {
    this._$propertiesPane.html(this.options.noSelectionTemplate);
  },

  _displayAgentProperties: function () {
    this._$identifierField.text('#' + this._displayedAgent.getIndex());
    this._$karmaField.text(Math.round(this._displayedAgent.getKarma() * 1000) / 1000);
    this._$languageField.text(this._displayedAgent.getDisplayLanguage());

    this._$propertiesPane.empty();
    this._$propertiesPane.append(this._$propertiesList);
  },
  
  refresh: function() {
    var $div,
        elements;

    for (var i in this._agentViews) {
      $div = this._agentViews[i];
      $div.css('background-color', $div.data('agent').getColor());
    }
    
    if (this._displayedAgent) {
      this._displayAgentProperties(this._displayedAgent);

      // TODO: only update new words tooltip
      //this._displayedAgent.userInteraction();
    }

    if (this._agentSorting) {
      elements = this._$mainPane.children('div').detach();

      // http://stackoverflow.com/questions/11923659/javascript-sort-rgb-values
      elements.sort(function(a, b) {
        var aComparable = $(a).css('background-color');
        var bComparable = $(b).css('background-color');
        return pusher.color(aComparable).hue() - pusher.color(bComparable).hue();
      });

      this._$mainPane.append(elements);
    }
  },

  setAgentSorting: function (value) {
    this._agentSorting = value;
    this.refresh();
  },

});
