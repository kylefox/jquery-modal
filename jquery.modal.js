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
      $elm.addClass(options.modalClass).addClass('current').show();
    }

    current_modal = {elm: $elm};
    block();
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

  $.fn.modal.close = function(event) {
    if(event) {
      event.preventDefault();
    }
    if(!current_modal) {
      return;
    }
    current_modal.blocker.remove();
    current_modal.elm.hide();
  };

  function open_modal_from_link(event) {
    event.preventDefault();
    $($(this).attr('href')).modal();
  }
  
  // Automatically bind links with rel="close-modal" to, well, close the modal.
  $('a[rel="open-modal"]').live('click', open_modal_from_link);
  $('a[rel="close-modal"]').live('click', $.fn.modal.close);
  
})();