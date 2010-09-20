(function() {

  var current_modal = null;

  $.fn.modal = function(options) {
    
    var $elm = $(this);
    
    // If this is a link, bind to the click event.
    if($elm.attr('href')) {
      $elm.click(open_modal_from_link);
      return;
    }

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
      if(options.clickClose) {
        current_modal.blocker.click($.fn.modal.close);
      }
      $('body').append(current_modal.blocker);
      $(document).trigger($.fn.modal.BLOCK, [current_modal]);
    }

    function show() {
      $elm.css({
        position: 'fixed',
        top: "50%",
        left: "50%",
        marginTop: - ($elm.height() / 2),
        marginLeft: - ($elm.outerWidth() / 2),
        zIndex: options.zIndex + 1
      });
      $elm.addClass(options.modalClass).addClass('current').show();
      $(document).trigger($.fn.modal.OPEN, [current_modal]);
    }

    current_modal = {elm: $elm};
    $(document).trigger($.fn.modal.BEFORE_BLOCK, [current_modal]);
    block();
    $(document).trigger($.fn.modal.BEFORE_OPEN, [current_modal]);
    show();
  };

  $.fn.modal.defaults = {
    overlay: "#000",
    opacity: 0.75,
    zIndex: 1,
    escapeClose: true,
    clickClose: true,
    modalClass: "modal"
  };

  // Event constants:
  $.fn.modal.BEFORE_BLOCK = 'modal:before-block';
  $.fn.modal.BLOCK = 'modal:block';
  $.fn.modal.BEFORE_OPEN = 'modal:before-open';
  $.fn.modal.OPEN = 'modal:open';
  $.fn.modal.BEFORE_CLOSE = 'modal:before-close';
  $.fn.modal.CLOSE = 'modal:close';

  $.fn.modal.close = function(event) {
    if(event) {
      event.preventDefault();
    }
    if(!current_modal) {
      return;
    }
    $(document).trigger($.fn.modal.BEFORE_CLOSE, [current_modal]);
    current_modal.blocker.remove();
    current_modal.elm.hide();
    $(document).trigger($.fn.modal.CLOSE, [null]);
  };

  function open_modal_from_link(event) {
    event.preventDefault();
    $($(this).attr('href')).modal();
  }
  
  // Automatically bind links with rel="close-modal" to, well, close the modal.
  $('a[rel="open-modal"]').live('click', open_modal_from_link);
  $('a[rel="close-modal"]').live('click', $.fn.modal.close);
  
})();