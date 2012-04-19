A simple & lightweight method of displaying modal windows with jQuery.

You probably want [a demo](http://kylefox.ca/jquery-modal/examples/index.html), don't you?

# Why another modal plugin?

Most plugins I've found try to do too much, and have specialized ways of handling photo galleries, iframes and video.  The resulting HTML & CSS is often bloated and difficult to customize.

By contrast, this plugin handles the two most common scenarios I run into

* displaying an existing DOM element
* loading a page with AJAX

and does so with as little HTML & CSS as possible.

# Installation

Include [jQuery](http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js) and `jquery.modal.min.js` scripts:

    <script src="jquery.min.js" type="text/javascript" charset="utf-8"></script>
    <script src="jquery.modal.min.js" type="text/javascript" charset="utf-8"></script>
    
Include the `jquery.modal.css` stylesheet:

    <link rel="stylesheet" href="jquery.modal.css" type="text/css" media="screen" />
    
As of version 0.3.0, jQuery 1.7 is required. If you're using an earlier version of jQuery you can use the [v.0.2.5 tag.](https://github.com/kylefox/jquery-modal/tags)

# Opening

**Method 1: Manually**

Basic usage is to embed your modal's HTML (with the 'modal' class) directly into the document.

    <form id="login-form" class="modal">
      ...
    </form>

and then invoke `modal()` on the element.

    $('#login-form').modal();

You can also invoke `modal()` on links.

    <a href="#ex5"> Open modal by getting the dom id from href</a>
    <a href="ajax.html"> Open modal by making an AJAX call</a>

    $(a).click(function(event) {
      event.preventDefault();
      $(this).modal();
    });

**Method 2: Automatically attaching to links**

An even simpler way is to add `rel="modal:open"` to links.  When the link is clicked, the link's `href` is loaded into a modal.

Open an existing DOM element:

    <a href="#login-form" rel="modal:open">Login</a>
    
Load a remote URL with AJAX:

    <a href="login.html" rel="modal:open">Login</a>
    
You should apply a width to all your modal elements using normal CSS.

    #login-form.modal { width: 400px; }

The modal doesn't have a fixed height, and thus will expand & contract vertically to fit the content.

# Closing

Because there can be only one modal active at a single time, there's no need to select which modal to close:

    $.modal.close();
    
_TODO: this should be changed so that when called on a specific element, the element is returned (normal jQuery fashion)._

Similar to how links can be automatically bound to open modals, they can be bound to close modals using `rel="modal:close"`:

    <a href="#close" rel="modal:close">Close window</a>
    
_(Note that modals loaded with AJAX are removed from the DOM when closed)._
    
# Resizing

There's really no need to modals, since the default styles don't specify a fixed height; modals will expand vertically (like a normal HTML element) to fit their contents.

However, when this occurs, you will probably want to at least re-center the modal in the viewport:

    $.modal.resize()
    
# Options

These are the supported options and their default values:

    $.modal.defaults = {
      overlay: "#000",        // Overlay color
      opacity: 0.75,          // Overlay opacity
      zIndex: 1,              // Overlay z-index.
      escapeClose: true,      // Allows the user to close the modal by pressing `ESC`
      clickClose: true,       // Allows the user to close the modal by clicking the overlay
      closeText: 'Close',     // Text content for the close <a> tag.
      showClose: true,         // Shows a (X) icon/link in the top-right corner
      modalClass: "modal",    // CSS class added to the element being displayed in the modal.
    };
    
# Events

The following events are triggered on the modal element at various points in the open/close cycle (see below for AJAX events).  Hopefully the names are self-explanatory.

    $.modal.BEFORE_BLOCK = 'modal:before-block';
    $.modal.BLOCK = 'modal:block';
    $.modal.BEFORE_OPEN = 'modal:before-open';
    $.modal.OPEN = 'modal:open';
    $.modal.BEFORE_CLOSE = 'modal:before-close';
    $.modal.CLOSE = 'modal:close';
    
The first and only argument passed to these event handlers is the `modal` object, which has three properties:

    modal.elm;        // Original jQuery object upon which modal() was invoked.
    modal.options;    // Options passed to the modal.
    modal.blocker;    // The overlay element.

So, you could do something like this:

    $('#purchase-form').on($.modal.BEFORE_CLOSE, function(event, modal) {
      clear_shopping_cart();
    });

# AJAX

## Basic support

The following additional events are triggered for AJAX modals:

    $.modal.AJAX_BEFORE_SEND = 'modal:ajax:before-send';
    $.modal.AJAX_SUCCESS = 'modal:ajax:success';
    
The `AJAX_BEFORE_SEND` handler receives no arguments. The `AJAX_SUCCESS` handler receives a single argument, which is the HTML returned by the server. These handlers do not receive the modal object as a parameter because it does not exist until _after_ `AJAX_SUCCESS` is fired.

You can use this functionality to show & hide visual feedback. jquery-modal comes with a couple basic spinner widgets.

Add the spinner to your markup:

    <div class="modal-spinner"></div>

Bind to AJAX events to show/hide:

    $(document).on($.modal.AJAX_BEFORE_SEND, function() {
      $('.modal-spinner').show();
    });
  
    $(document).on($.modal.AJAX_SUCCESS, function() {
      $('.modal-spinner').hide();
    });
    
## More advanced AJAX handling

It's a good idea to provide more robust AJAX handling -- error handling, in particular. Instead of accommodating the myriad [`$.ajax` options](http://api.jquery.com/jQuery.ajax/) jQuery provides, jquery-modal makes it possible to directly modify the AJAX request itself.

Simply bypass the default AJAX handling (i.e.: don't use `rel="modal"`)

    <a href="ajax.html" rel="ajax:modal">Click me!</a>

and make your AJAX request in the link's click handler. Note that you need to manually append the new HTML/modal in the `success` callback:

    $('a[rel="ajax:modal"]').click(function(event) {

      $.ajax({
        
        url: $(this).attr('href'),
        
        success: function(newHTML, textStatus, jqXHR) {
          $(newHTML).appendTo('body').modal();      
        },
        
        error: function(jqXHR, textStatus, errorThrown) {
          // Handle AJAX errors
        }
        
        // More AJAX customization goes here.
        
      });
  
      return false;
    });

# Contributing

I would love help improving this plugin, particularly with:

* Performance improvements
* Making the code as concise/efficient as possible
* Bug fixes & browser compatibility

Please fork and send pull requests, or create an [issue](https://github.com/kylefox/jquery-modal/issues).