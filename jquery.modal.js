/*
    A simple jQuery modal (http://github.com/kylefox/jquery-modal)
    Version 0.3.1
*/
(function($) {

  var current_modal = null;

  var open_modal_from_link = function(event) {
    event.preventDefault();
    var target = $(this).attr('href');
    if(/^#/.test(target)) { // DOM id
      $(target).modal();
    } else { // AJAX
      $.get(target, {}, function(html) {
        $('<div/>')
          .html(html)
          .appendTo('body')
          .on($.modal.CLOSE, function(event, modal) { modal.elm.remove(); })
          .modal();
      });
    }
  };

  var center_modal = function(modal) {
    modal.elm.css({
      position: 'fixed',
      top: "50%",
      left: "50%",
      marginTop: - (modal.elm.outerHeight() / 2),
      marginLeft: - (modal.elm.outerWidth() / 2),
      zIndex: modal.options.zIndex + 1
    });
  };

  $.modal = function(el, options){
    var self = this;
    this.$elm = el;
    this.options = $.extend({},$.modal.defaults, options);
    
    if(this.$elm.attr('href')) {
      this.$elm.click(open_modal_from_link);
      return;
    }

    this.block = function() {
      current_modal.blocker = $('<div class="jquery-modal blocker"></div>').css({
        top: 0, right: 0, bottom: 0, left: 0,
        width: "100%", height: "100%",
        position: "fixed",
        zIndex: self.options.zIndex,
        background: self.options.overlay,
        opacity: self.options.opacity
      });
      if(self.options.escapeClose) {
        $(document).on('keydown.modal', function(event) {
          if(event.which == 27) { $.modal.close(); }
        });
      }
      if(self.options.clickClose) {
        current_modal.blocker.click($.modal.close);
      }
      $('body').append(current_modal.blocker);
      self.$elm.trigger($.modal.BLOCK, [current_modal]);
    };

    this.show = function() {
      center_modal(current_modal);
      if(self.options.showClose) {
        current_modal.closeButton = $('<a href="#close-modal" rel="modal:close" class="close-modal">' + self.options.closeText + '</a>');
        current_modal.elm.append(current_modal.closeButton);
      }
      self.$elm.addClass(self.options.modalClass + ' current').show();
      self.$elm.trigger($.modal.OPEN, [current_modal]);
    };

    current_modal = {elm: this.$elm, options: this.options};
    this.$elm.trigger($.modal.BEFORE_BLOCK, [current_modal]);
    this.block();
    this.$elm.trigger($.modal.BEFORE_OPEN, [current_modal]);
    this.show();
  };
    
  $.modal.defaults = {
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
  $.modal.BEFORE_BLOCK = 'modal:before-block';
  $.modal.BLOCK = 'modal:block';
  $.modal.BEFORE_OPEN = 'modal:before-open';
  $.modal.OPEN = 'modal:open';
  $.modal.BEFORE_CLOSE = 'modal:before-close';
  $.modal.CLOSE = 'modal:close';

  $.modal.close = function() {
    if(event) { event.preventDefault(); }
    if(!current_modal) { return; }
    current_modal.elm.trigger($.modal.BEFORE_CLOSE, [current_modal]);
    if(current_modal.closeButton) { current_modal.closeButton.remove(); }
    current_modal.blocker.remove();
    current_modal.elm.removeClass('current').hide();
    current_modal.elm.trigger($.modal.CLOSE, [current_modal]);
    current_modal = null;
    
    $(document).off('keydown.modal');
  };

  $.modal.resize = function() {
    center_modal(current_modal);
  };

  $.fn.modal = function(options){
    if(this.length > 0) { new $.modal(this, options); }
    return this;
  };

  // Automatically bind links with rel="modal:close" to, well, close the modal.
  $(document).on('click', 'a[rel="modal:open"]', open_modal_from_link);
  $(document).on('click', 'a[rel="modal:close"]', $.modal.close);
})(jQuery);