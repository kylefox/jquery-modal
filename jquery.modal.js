(function() {

  var current_modal = null;

  $.fn.modal = function(options) {

    var $elm = $(this);

    options = $.extend({}, $.fn.modal.defaults, options);

    function block() {
      current_modal.blocker = $('<div class="jquery-modal blocker"></div>').css({
        top: 0, right: 0, bottom: 0, left: 0,
        width: "100%", height: "100%",
        position: "fixed",
        zIndex: options.zIndex,
        background: options.overlay,
        opacity: options.opacity
      });
      if(options.escapeClose) {
        $(document).keydown(function(event) {
          if(event.which == 27) {$.fn.modal.close();}
        });
      }
      $('body').append(current_modal.blocker);
    }

    function show() {
      $elm.css({
        position: 'absolute',
        top: "50%",
        left: "50%",
        marginTop: - ($elm.height() / 2),
        marginLeft: - ($elm.outerWidth() / 2),
        zIndex: options.zIndex + 1
      });
      $elm.show();
    }

    current_modal = {elm: $elm};
    block();
    show();
  };

  $.fn.modal.defaults = {
    overlay: "#000",
    opacity: 0.75,
    zIndex: 100,
    escapeClose: true
  };

  $.fn.modal.close = function() {
    if(!current_modal) {
      return;
    }
    current_modal.blocker.remove();
    current_modal.elm.hide();
  };

})();