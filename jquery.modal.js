/*
    A simple jQuery modal (http://github.com/kylefox/jquery-modal)
    Version 0.5.4
*/
(function(global) {
  'use strict';
  
  var defaults = {
    overlay: "#000",
    opacity: 0.75,
    zIndex: 1,
    escapeClose: true,
    clickClose: true,
    closeText: 'Close',
    modalClass: "modal",
    spinnerHtml: null,
    showSpinner: true,
    showClose: true,
    fadeDuration: null,   // Number of milliseconds the fade animation takes.
    fadeDelay: 1.0        // Point during the overlay's fade-in that the modal begins to fade in (.5 = 50%, 1.5 = 150%, etc.)
  };

  //Wrapper function that allows us to pass it to define later
  var wrap = function($) {

    var current = null;

    $.modal = function(el, options) {
      $.modal.close(); // Close any open modals.
      var remove, target;
      this.$body = $('body');
      this.options = $.extend({}, defaults, options);
      this.options.doFade = !isNaN(parseInt(this.options.fadeDuration, 10));
      if (el.is('a')) {
        target = el.attr('href');
        //Select element by id from href
        if (/^#/.test(target)) {
          this.$elm = $(target);
          if (this.$elm.length !== 1) return null;
            this.open();
            //AJAX
          } else {
            this.$elm = $('<div>');
            this.$body.append(this.$elm);
            remove = function(event, modal) { modal.elm.remove(); };
            this.showSpinner();
            el.trigger($.modal.AJAX_SEND);
            $.get(target).done(function(html) {
            if (!current) return;
              el.trigger($.modal.AJAX_SUCCESS);
              current.$elm.empty().append(html).on($.modal.CLOSE, remove);
              current.hideSpinner();
              current.open();
              el.trigger($.modal.AJAX_COMPLETE);
            }).fail(function() {
              el.trigger($.modal.AJAX_FAIL);
              current.hideSpinner();
              el.trigger($.modal.AJAX_COMPLETE);
          });
        }
      } else {
        this.$elm = el;
        this.open();
      }
    };

    $.modal.prototype = {
      constructor: $.modal,

      open: function() {
        var m = this;
        if(this.options.doFade) {
          this.block();
          setTimeout(function() {
            m.show();
          }, this.options.fadeDuration * this.options.fadeDelay);
        } else {
          this.block();
          this.show();
        }
        if (this.options.escapeClose) {
          $(document).on('keydown.modal', function(event) {
            if (event.which == 27) $.modal.close();
         });
        }
        if (this.options.clickClose) this.blocker.click($.modal.close);
      },

      close: function() {
        this.unblock();
        this.hide();
        $(document).off('keydown.modal');
      },

	    block: function() {
	      var initialOpacity = this.options.doFade ? 0 : this.options.opacity;
	      this.$elm.trigger($.modal.BEFORE_BLOCK, [this._ctx()]);
	      this.blocker = $('<div class="jquery-modal blocker"></div>').css({
	        top: 0, right: 0, bottom: 0, left: 0,
	        width: "100%", height: "100%",
	        position: "fixed",
	        zIndex: this.options.zIndex,
	        background: this.options.overlay,
	        opacity: initialOpacity
	      });
	      this.$body.append(this.blocker);
	      if(this.options.doFade) {
	        this.blocker.animate({opacity: this.options.opacity}, this.options.fadeDuration);
	      }
	      this.$elm.trigger($.modal.BLOCK, [this._ctx()]);
	    },

	    unblock: function() {
	      if(this.options.doFade) {
	        this.blocker.fadeOut(this.options.fadeDuration, function() {
	          this.remove();
	        });
	      } else {
	        this.blocker.remove();
	      }
	    },

	    show: function() {
	      this.$elm.trigger($.modal.BEFORE_OPEN, [this._ctx()]);
	      if (this.options.showClose) {
	        this.closeButton = $('<a href="#close-modal" rel="modal:close" class="close-modal">' + this.options.closeText + '</a>');
	        this.$elm.append(this.closeButton);
	      }
	      this.$elm.addClass(this.options.modalClass + ' current');
	      this.center();
	      if(this.options.doFade) {
	        this.$elm.fadeIn(this.options.fadeDuration);
	      } else {
	        this.$elm.show();
	      }
	      this.$elm.trigger($.modal.OPEN, [this._ctx()]);
	    },

	    hide: function() {
	      this.$elm.trigger($.modal.BEFORE_CLOSE, [this._ctx()]);
	      if (this.closeButton) this.closeButton.remove();
	      this.$elm.removeClass('current');

	      if(this.options.doFade) {
	        this.$elm.fadeOut(this.options.fadeDuration);
	      } else {
	        this.$elm.hide();
	      }
	      this.$elm.trigger($.modal.CLOSE, [this._ctx()]);
	    },

	    showSpinner: function() {
	      if (!this.options.showSpinner) return;
	      this.spinner = this.spinner || $('<div class="' + this.options.modalClass + '-spinner"></div>')
	        .append(this.options.spinnerHtml);
	      this.$body.append(this.spinner);
	      this.spinner.show();
	    },

	    hideSpinner: function() {
	      if (this.spinner) this.spinner.remove();
	    },

	    center: function() {
	      this.$elm.css({
	        position: 'fixed',
	        top: "50%",
	        left: "50%",
	        marginTop: - (this.$elm.outerHeight() / 2),
	        marginLeft: - (this.$elm.outerWidth() / 2),
	        zIndex: this.options.zIndex + 1
	      });
	    },

	    //Return context for custom events
	    _ctx: function() {
	      return { elm: this.$elm, blocker: this.blocker, options: this.options };
	    }
	  };

	  //resize is alias for center for now
	  $.modal.prototype.resize = $.modal.prototype.center;

	  $.modal.close = function(event) {
	    if (!current) return;
	    if (event) event.preventDefault();
	    current.close();
	    var that = current.$elm;
	    current = null;
	    return that;
	  };

	  $.modal.resize = function() {
	    if (!current) return;
	    current.resize();
	  };
		  
    // Returns if there currently is an active modal
    $.modal.isActive = function () {
      return current ? true : false;
    }  

    // Event constants
    $.modal.BEFORE_BLOCK = 'modal:before-block';
    $.modal.BLOCK = 'modal:block';
    $.modal.BEFORE_OPEN = 'modal:before-open';
    $.modal.OPEN = 'modal:open';
    $.modal.BEFORE_CLOSE = 'modal:before-close';
    $.modal.CLOSE = 'modal:close';
    $.modal.AJAX_SEND = 'modal:ajax:send';
    $.modal.AJAX_SUCCESS = 'modal:ajax:success';
    $.modal.AJAX_FAIL = 'modal:ajax:fail';
    $.modal.AJAX_COMPLETE = 'modal:ajax:complete';

    $.fn.modal = function(options){
		  options = $.extend(true, {}, defaults, options);
		
		  return this.each(function() {
	      var $this = $(this);
	      current = new $.modal($this, options);

	      // Assign the instance to a data property so the methods can 
	      // be used
	      $this.data('modal', current);

	      // Automatically bind links with rel="modal:close" to, well, close the modal.
			  $(document).on('click.modal', 'a[rel="modal:close"]', $.modal.close);
	    });
	  };
  }
  
  //Check for the presence of an AMD loader and if so pass the wrap function to define
  // We can safely assume 'jquery' is the module name as it is a named module already - http://goo.gl/PWyOV
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], wrap, function(){
    	//handle opening modals w/ links w/ amd
	    $(document).on('click.modal', 'a[rel="modal:open"]', function(event) {
		    event.preventDefault();
		    $(this).modal();
		  });
    });
  } else {
    // Otherwise we assume jQuery was loaded the old fashioned way and just pass the jQuery object to wrap
    wrap(global.jQuery);

    //handle opening modals w/ links w/o amd
	  global.jQuery(document).on('click.modal', 'a[rel="modal:open"]', function(event) {
	    event.preventDefault();
	    $(this).modal();
	  });
  }
})(this);
