/*
    A simple jQuery modal (http://github.com/kylefox/jquery-modal)
    Version 0.2.4
*/
(function() {

  var current_modal = null;

  $.fn.modal = function(options) {
    
    var $elm = $(this);
    
    // If this is a link, bind to its click event.
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
        $(document).bind('keydown.modal', function(event) {
          if(event.which == 27) {$.fn.modal.close();}
        });
      }
      if(options.clickClose) {
        current_modal.blocker.click($.fn.modal.close);
      }
      $('body').append(current_modal.blocker);
      $elm.trigger($.fn.modal.BLOCK, [current_modal]);
    }

    function show() {
      center_modal(current_modal);
      if(options.showClose) {
        current_modal.closeButton = $('<a href="#close-modal" rel="modal:close" class="close-modal">' + options.closeText + '</a>');
        current_modal.elm.append(current_modal.closeButton);
      }
      $elm.addClass(options.modalClass + ' current').show();
      $elm.trigger($.fn.modal.OPEN, [current_modal]);
    }

    current_modal = {elm: $elm, options: options};
    $elm.trigger($.fn.modal.BEFORE_BLOCK, [current_modal]);
    block();
    $elm.trigger($.fn.modal.BEFORE_OPEN, [current_modal]);
    show();
  };

  $.fn.modal.defaults = {
    overlay: "#000",
    opacity: 0.75,
    zIndex: 1,
    escapeClose: true,
    clickClose: true,
    closeText: 'Close',
    modalClass: "modal",
    showClose: true
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
    
    current_modal.elm.trigger($.fn.modal.BEFORE_CLOSE, [current_modal]);
    if(current_modal.closeButton) {
      current_modal.closeButton.remove();
    }
    current_modal.blocker.remove();
    current_modal.elm.removeClass('current').hide();
    current_modal.elm.trigger($.fn.modal.CLOSE, [current_modal]);
    current_modal = null;
    
    $(document).unbind('keydown.modal');
  };
  
  $.fn.modal.resize = function() {
    center_modal(current_modal);
  };

  function open_modal_from_link(event) {
    event.preventDefault();
    var target = $(this).attr('href');
    if(/^#/.test(target)) { // DOM id
      $(target).modal();
    } else { // AJAX
      $.get(target, {}, function(html) {
        $('<div/>')
          .html(html)
          .appendTo('body')
          .bind('modal:close', function(event, modal) { modal.elm.remove(); })
          .modal();
      });
    }
  }
  
  function center_modal(modal) {
    modal.elm.css({
      position: 'fixed',
      top: "50%",
      left: "50%",
      marginTop: - (modal.elm.outerHeight() / 2),
      marginLeft: - (modal.elm.outerWidth() / 2),
      zIndex: modal.options.zIndex + 1
    });
  };
  
  // Automatically bind links with rel="modal:close" to, well, close the modal.
  $('a[rel="modal:open"]').live('click', open_modal_from_link);
  $('a[rel="modal:close"]').live('click', $.fn.modal.close);
  
})();