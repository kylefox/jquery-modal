# Installation

Include [jQuery](http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js) and `jquery.modal.min.js` scripts:

    <script src="jquery.min.js" type="text/javascript" charset="utf-8"></script>
    <script src="jquery.modal.min.js" type="text/javascript" charset="utf-8"></script>
    
Include the `jquery.modal.css` stylesheet:

    <link rel="stylesheet" href="jquery.modal.css" type="text/css" media="screen" />
    

# Opening modals

## Method 1: Manually

Basic usage is to embed your modal's HTML (with the 'modal' class) directly into the document.

    <form id="login-form" class="modal">
      ...
    </form>

and then invoke `modal()` on the element.

    $('#login-form').modal();
    

## Method 2: Automatically attaching to links

An even simpler way is to add `rel="modal:open"` to links.  When the link is clicked, the DOM element with an ID corresponding to the link's `href` attribute will be opened in a modal.

    <a href="#login-form" rel="modal:open">Login</a>
    
## AJAX

I know somebody is going to ask, so here's an example of how you could load content with AJAX:

    $.get('/login-form', {}, function(html) {
      $(html)
      
        // Append the resulting HTML to the document:
        .appendTo('body')
        
        // Completely remove the modal's DOM element when it's closed:
        .bind('modal:close', function(event, modal) { modal.elm.remove() })
        
        // Open them modal:
        .modal();
    });
    
Since you'll probably want to remove the modal from the DOM when it's closed:
    
# Closing modals

Because there can be only one modal active at a single time, there's no need to select which modal to close:

    $.fn.modal.close();
    
_TODO: this should be changed so that when called on a specific element, the element is returned (normal jQuery fashion)._

Similar to how links can be automatically bound to open modals, they can be bound to close modals using `rel="modal:close"`:

    <a href="#login-form" rel="modal:open">Login</a>
    
# Resizing

There's really no need to modals, since the default styles don't specify a fixed height; modals will expand vertically (like a normal HTML element) to fit their contents.

However, when this occurs, you will probably want to at least re-center the modal in the viewport:

    $.fn.modal.resize()
    
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

If you wish to remove the modal element from the DOM when it's closed, you must do so manually by binding to `modal:close` (see AJAX section).