A simple & lightweight method of displaying modal windows with jQuery.

You probably want [a demo](http://kylefox.ca/jquery-modal/examples/index.html), don't you?

**Using Rails?** Check out the [jquery-modal-rails plugin](https://github.com/dei79/jquery-modal-rails)!

# Why another modal plugin?

Most plugins I've found try to do too much, and have specialized ways of handling photo galleries, iframes and video.  The resulting HTML & CSS is often bloated and difficult to customize.

By contrast, this plugin handles the two most common scenarios I run into

* displaying an existing DOM element
* loading a page with AJAX

and does so with as little HTML & CSS as possible.

## Bug Reports & Improvements

**Found a bug?** Please [create an issue](https://github.com/kylefox/jquery-modal/issues/new) and **include a publicly-accessible demonstration of the bug.** [Dropbox](https://www.dropbox.com) or [JSFiddle](http://jsfiddle.net/) work well for demonstrating reproducable bugs, but you can use anything as long as it's publicly accessible. Your issue is much more likely to be resolved/merged if it includes a fix & pull request.

**Have an idea that improves jquery-modal?** Awesome! Please fork this repository, implement your idea (including documentation, if necessary), and submit a pull request.

I don't use this library as frequently as I used to, so if you want to see a fix/improvement you're best off submitting a pull request. Bugs without a test case and/or improvements without a pull request will be shown no mercy and closed!

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

    $('a').click(function(event) {
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

## Fade Transitions

By default the overlay & window appear instantaneously, but you can enable a fade effect by specifying the `fadeDuration` option.

    $('a.open-modal').click(function(event) {
      $(this).modal({
        fadeDuration: 250
      });
      return false;
    });

This will fade in the overlay and modal over 250 milliseconds _simultaneously._ If you want the effect of the overlay appearing _before_ the window, you can specify the `fadeDelay` option. This indicates at what point during the overlay transition the window transition should begin.

So if you wanted the window to fade in when the overlay's was 80% finished:

      $(elm).modal({
        fadeDuration: 250,
        fadeDelay: 0.80
      });

Or, if you wanted the window to fade in a few moments after the overlay transition has completely finished:

      $(elm).modal({
        fadeDuration: 250,
        fadeDelay: 1.5
      });

Fading is the only supported transition. Also, there are no transitions when closing the modal.

# Closing

Because there can be only one modal active at a single time, there's no need to select which modal to close:

    $.modal.close();

Similar to how links can be automatically bound to open modals, they can be bound to close modals using `rel="modal:close"`:

    <a href="#close" rel="modal:close">Close window</a>

_(Note that modals loaded with AJAX are removed from the DOM when closed)._

# Resizing

There's really no need to manually resize modals, since the default styles don't specify a fixed height; modals will expand vertically (like a normal HTML element) to fit their contents.

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
      closeClass: '',         // Add additional class(es) to the close <a> tag.
      showClose: true,        // Shows a (X) icon/link in the top-right corner
      modalClass: "modal",    // CSS class added to the element being displayed in the modal.
      spinnerHtml: null,      // HTML appended to the default spinner during AJAX requests.
      showSpinner: true,      // Enable/disable the default spinner during AJAX requests.
      fadeDuration: null,     // Number of milliseconds the fade transition takes (null means no transition)
      fadeDelay: 1.0          // Point during the overlay's fade-in that the modal begins to fade in (.5 = 50%, 1.5 = 150%, etc.)
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

jQuery Modal uses $.get for basic AJAX support. A simple spinner will be displayed by default (if you've included modal.css) and will have the class `modal-spinner`. If you've set the `modalClass` option, the spinner will be prefixed with that class name instead.

You can add text or additional HTML to the spinner with the `spinnerHtml` option, or disable the spinner entirely by setting `showSpinner: false`.

## Events

The following events are triggered when AJAX modals are requested.

    $.modal.AJAX_SEND = 'modal:ajax:send';
    $.modal.AJAX_SUCCESS = 'modal:ajax:success';
    $.modal.AJAX_FAIL = 'modal:ajax:fail';
    $.modal.AJAX_COMPLETE = 'modal:ajax:complete';

The handlers receive no arguments. The events are triggered on the `<a>` element which initiated the AJAX modal.

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

Note that the AJAX response must be wrapped in a div with class <code>modal</code> when using the second (manual) method.

# Contributing

I would love help improving this plugin, particularly with:

* Performance improvements
* Making the code as concise/efficient as possible
* Bug fixes & browser compatibility
* Minify JavaScript with [Closure Compiler](http://closure-compiler.appspot.com/home) (default options)

Please fork and send pull requests, or create an [issue](https://github.com/kylefox/jquery-modal/issues).

# License (MIT)

jQuery Modal is distributed under the [MIT License](Learn more at http://opensource.org/licenses/mit-license.php):

    Copyright (c) 2012 Kyle Fox

    Permission is hereby granted, free of charge, to any person obtaining
    a copy of this software and associated documentation files (the
    "Software"), to deal in the Software without restriction, including
    without limitation the rights to use, copy, modify, merge, publish,
    distribute, sublicense, and/or sell copies of the Software, and to
    permit persons to whom the Software is furnished to do so, subject to
    the following conditions:

    The above copyright notice and this permission notice shall be
    included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
    LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
    OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
    WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
