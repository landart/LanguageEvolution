var Console = Class.create({

  _defaults: { },
  _options: { },
  _$console: null,

  init: function (options) {
    this.options = $.extend({}, this._defaults, options)
    this._$console = $(options.container)
  },

  info: function (html) {
    this._buildAlert(html, 'alert alert-info');
  },

  success: function (html) {
    this._buildAlert(html, 'alert alert-success');
  },

  warning: function (html) {
    this._buildAlert(html, 'alert');
  },

  error: function (html) {
    this._buildAlert(html, 'alert alert-error');
  },

  clear: function () {
    this._$console.html('');
  },

  _buildAlert: function (html, classes) {
    var $alert = $(document.createElement('div')),
        $child = $(document.createElement('div'));
    $alert.addClass(classes);
    $child.html(html);
    $alert.append($child);
    this._$console.append($alert);
  }

});