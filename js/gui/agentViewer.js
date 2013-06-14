var AgentViewer = Class.create({

  defaults: { },
  options: { },

  _$container: null,

  init: function (options) {
    this.options = $.extend({}, this.defaults, options);
    this._$container = $(options.container);
  },

});
