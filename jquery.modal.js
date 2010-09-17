(function() {

  var current_modal = null;

  $.fn.modal = function(options) {

    var $elm = $(this);

    options = $.extend({}, $.fn.modal.defaults, options);

    function block() {
      current_modal.blocker = $('<div class="jquery-modal"></div>').css({
        top: 0, right: 0, bottom: 0, left: 0,
        width: "100%", height: "100%",
        position: "fixed",
        zIndex: 100,
        background: "#000",
        opacity: options.opacity
      });
      $('body').append(current_modal.blocker);
    }

    function show() {
      $elm.css({
        position: 'absolute',
        top: 35,
        left: "50%",
        marginLeft: - ($elm.outerWidth() / 2),
        zIndex: 101
      });
      $elm.show();
    }

    current_modal = {elm: $elm};
    block();
    show();
  };

  $.fn.modal.defaults = {
    opacity: 0.75,
    zIndex: 100
  };

  $.fn.modal.close = function() {
    if(!current_modal) {
      return;
    }
    current_modal.blocker.remove();
    current_modal.elm.hide();
  };

})();