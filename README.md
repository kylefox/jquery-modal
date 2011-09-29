A simple & lightweight method of displaying modal windows with jQuery.

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
    

# Opening

**Method 1: Manually**

Basic usage is to embed your modal's HTML (with the 'modal' class) directly into the document.

    <form id="login-form" class="modal">
      ...
    </form>

and then invoke `modal()` on the element.

    $('#login-form').modal();
    

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

    $.fn.modal.close();
    
_TODO: this should be changed so that when called on a specific element, the element is returned (normal jQuery fashion)._

Similar to how links can be automatically bound to open modals, they can be bound to close modals using `rel="modal:close"`:

    <a href="#close" rel="modal:close">Close window</a>
    
_(Note that modals loaded with AJAX are removed from the DOM when closed)._
    
# Resizing

There's really no need to modals, since the default styles don't specify a fixed height; modals will expand vertically (like a normal HTML element) to fit their contents.

However, when this occurs, you will probably want to at least re-center the modal in the viewport:

    $.fn.modal.resize()
    
# Options

These are the supported options and their default values:

    $.fn.modal.defaults = {
      overlay: "#000",        // Overlay color
      opacity: 0.75,          // Overlay opacity
      zIndex: 1,              // Overlay z-index.
      escapeClose: true,      // Allows the user to close the modal by pressing `ESC`
      clickClose: true,       // Allows the user to close the modal by clicking the overlay
      closeText: 'Close',     // Text content for the close <a> tag.
      showClose: true         // Shows a (X) icon/link in the top-right corner
      modalClass: "modal",    // CSS class added to the element being displayed in the modal.
    };
    
# Events

The following events are triggered on the modal element at various points in the open/close cycle.  Hopefully the names are self-explanatory.

    $.fn.modal.BEFORE_BLOCK = 'modal:before-block';
    $.fn.modal.BLOCK = 'modal:block';
    $.fn.modal.BEFORE_OPEN = 'modal:before-open';
    $.fn.modal.OPEN = 'modal:open';
    $.fn.modal.BEFORE_CLOSE = 'modal:before-close';
    $.fn.modal.CLOSE = 'modal:close';
    
The first and only argument passed to these event handlers is the `modal` object, which has three properties:

    modal.elm;        // Original jQuery object upon which modal() was invoked.
    modal.options;    // Options passed to the modal.
    modal.blocker;    // The overlay element.

So, you could do something like this:

    $('#purchase-form').bind('modal:before-close', function(event, modal) {
      clear_shopping_cart();
    });


# Contributing

I would love help improving this plugin, particularly with:

* Performance improvements
* Making the code as concise/efficient as possible
* Bug fixes & browser compatibility

Please fork and send pull requests, or create an [issue](https://github.com/kylefox/jquery-modal/issues).