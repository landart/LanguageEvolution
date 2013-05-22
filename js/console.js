var Console = Class.create({

  _defaults: { },
  _options: { },
  _$console: null,

  init: function (options) {
    this.options = $.extend({}, this._defaults, options)
    this._$console = $(options.container)
  },

  info: function (html, params) {
    this._buildAlert(html, params, 'alert alert-info');
  },

  success: function (html, params) {
    this._buildAlert(html, params, 'alert alert-success');
  },

  warning: function (html, params) {
    this._buildAlert(html, params, 'alert');
  },

  error: function (html, params) {
    this._buildAlert(html, params, 'alert alert-error');
  },

  clear: function () {
    this._$console.html('');
  },

  _buildAlert: function (html, params, classes) {
   
    if (params && params.log){
      // do something so that messages are logged
      return; // ??
    }
    
    // avoid overwriting message if there is already one
    if (this._$console.html().trim() !== ""){
      return;
    }
    
    var $alert = $(document.createElement('div'));
    $alert.addClass(classes);
    $alert.html(html);
    this._$console.html($alert);
  }
});
