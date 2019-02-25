A simple & lightweight method of displaying modal windows with jQuery.

For quick examples and demos, head to [jquerymodal.com](http://jquerymodal.com/).

# Why another modal plugin?

Most plugins I've found try to do too much, and have specialized ways of handling photo galleries, iframes and video.  The resulting HTML & CSS is often bloated and difficult to customize.

By contrast, this plugin handles the two most common scenarios I run into

* displaying an existing DOM element
* loading a page with AJAX

and does so with as little HTML & CSS as possible.

# Installation

You can install [jquery-modal](https://www.npmjs.com/package/jquery-modal) with npm:

`npm install jquery-modal`

or with [Bower](http://bower.io/):

`bower install jquery-modal`

or use the hosted version from [cdnjs](https://cdnjs.com/libraries/jquery-modal):

```html
<!-- Remember to include jQuery :) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0/jquery.min.js"></script>

<!-- jQuery Modal -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-modal/0.9.1/jquery.modal.min.js"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery-modal/0.9.1/jquery.modal.min.css" />
```

**Using Rails?** Check out the [jquery-modal-rails plugin](https://github.com/dei79/jquery-modal-rails)!

**jQuery Requirements:** As of version 0.3.0, jQuery 1.7 is required. If you're using an earlier version of jQuery you can use the [v.0.2.5 tag.](https://github.com/kylefox/jquery-modal/tags)

**Naming conflict with Bootstrap:** Bootstrap's [modal](http://getbootstrap.com/javascript/#modals) uses the same `$.modal` namespace. If you want to use jquery-modal with Bootstrap, the simplest solution is to manually modify the name of this plugin.

# Opening

#### Method 1: Automatically attaching to links

The simplest approach is to add `rel="modal:open"` to your links and use the `href` attribute to specify what to open in the modal.

Open an existing DOM element by ID:

```html
<form id="login-form" class="modal">
  ...
</form>

<a href="#login-form" rel="modal:open">Login</a>
```

Load a remote URL with AJAX:

```html
<a href="login.html" rel="modal:open">Login</a>
```

#### Method 2: Manually

You can manually open a modal by calling the `.modal()` method on the element:

```html
<form id="login-form" class="modal">
  ...
</form>
```

```js
$('#login-form').modal();
```

You can also invoke `.modal()` directly on links:

```html
<a href="#ex5" data-modal>Open a DOM element</a>
<a href="ajax.html" data-modal>Open an AJAX modal</a>
```

```js
$('a[data-modal]').click(function(event) {
  $(this).modal();
  return false;
});
```

### Compatibility Fallback

You can provide a clean fallback for users who have JavaScript disabled by manually attaching the modal via the `data-modal` attribute. This allows you to write your links pointing to the `href` as normal (fallback) while enabling modals where JavaScript is enabled.

```html
<!-- By default link takes user to /login.html -->
<a href="/login.html" data-modal="#login-modal">Login</a>

<!-- Login modal embedded in page -->
<div id="login-modal" class="modal">
  ...
</div>

<!-- For browsers with JavaScript, open the modal. -->
<script>
  $(function() {
    $('a[data-modal]').on('click', function() {
      $($(this).data('modal')).modal();
      return false;
    });
  });
</script>
```

#### Fade Transitions

By default the overlay & window appear instantaneously, but you can enable a fade effect by specifying the `fadeDuration` option.

```js
$('a.open-modal').click(function(event) {
  $(this).modal({
    fadeDuration: 250
  });
  return false;
});
```

This will fade in the overlay and modal over 250 milliseconds _simultaneously._ If you want the effect of the overlay appearing _before_ the window, you can specify the `fadeDelay` option. This indicates at what point during the overlay transition the window transition should begin.

So if you wanted the window to fade in when the overlay's was 80% finished:

```js
$(elm).modal({
  fadeDuration: 250,
  fadeDelay: 0.80
});
```

Or, if you wanted the window to fade in a few moments after the overlay transition has completely finished:

```js
$(elm).modal({
  fadeDuration: 250,
  fadeDelay: 1.5
});
```

The `fadeDelay` option only applies when opening the modal. When closing the modal, both the modal and the overlay fade out simultaneously according to the `fadeDuration` setting.

Fading is the only supported transition.

# Closing

Because there can be only one modal active at a single time, there's no need to select which modal to close:

```js
$.modal.close();
```

Similar to how links can be automatically bound to open modals, they can be bound to close modals using `rel="modal:close"`:

```html
<a href="#close" rel="modal:close">Close window</a>
```

_(Note that modals loaded with AJAX are removed from the DOM when closed)._

# Checking current state

* Use `$.modal.isActive()` to check if a modal is currently being displayed.
* Use `$.modal.getCurrent()` to retrieve a reference to the currently active modal instance, if any.

# Options

These are the supported options and their default values:

```js
$.modal.defaults = {
  closeExisting: true,    // Close existing modals. Set this to false if you need to stack multiple modal instances.
  escapeClose: true,      // Allows the user to close the modal by pressing `ESC`
  clickClose: true,       // Allows the user to close the modal by clicking the overlay
  closeText: 'Close',     // Text content for the close <a> tag.
  closeClass: '',         // Add additional class(es) to the close <a> tag.
  showClose: true,        // Shows a (X) icon/link in the top-right corner
  modalClass: "modal",    // CSS class added to the element being displayed in the modal.
  blockerClass: "modal",  // CSS class added to the overlay (blocker).

  // HTML appended to the default spinner during AJAX requests.
  spinnerHtml: '<div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div>',

  showSpinner: true,      // Enable/disable the default spinner during AJAX requests.
  fadeDuration: null,     // Number of milliseconds the fade transition takes (null means no transition)
  fadeDelay: 1.0          // Point during the overlay's fade-in that the modal begins to fade in (.5 = 50%, 1.5 = 150%, etc.)
};
```

# Events

The following events are triggered on the modal element at various points in the open/close cycle (see below for AJAX events).

```javascript
$.modal.BEFORE_BLOCK = 'modal:before-block';    // Fires just before the overlay (blocker) appears.
$.modal.BLOCK = 'modal:block';                  // Fires after the overlay (block) is visible.
$.modal.BEFORE_OPEN = 'modal:before-open';      // Fires just before the modal opens.
$.modal.OPEN = 'modal:open';                    // Fires after the modal has finished opening.
$.modal.BEFORE_CLOSE = 'modal:before-close';    // Fires when the modal has been requested to close.
$.modal.CLOSE = 'modal:close';                  // Fires when the modal begins closing (including animations).
$.modal.AFTER_CLOSE = 'modal:after-close';      // Fires after the modal has fully closed (including animations).
```

The first and only argument passed to these event handlers is the `modal` object, which has four properties:

```js
modal.$elm;       // Original jQuery object upon which modal() was invoked.
modal.options;    // Options passed to the modal.
modal.$blocker;   // The overlay element.
modal.$anchor;    // Anchor element originating the event.
```

So, you could do something like this:

```js
$('#purchase-form').on($.modal.BEFORE_CLOSE, function(event, modal) {
  clear_shopping_cart();
});
```

# AJAX

## Basic support

jQuery Modal uses $.get for basic AJAX support. A simple spinner will be displayed by default (if you've included modal.css) and will have the class `modal-spinner`. If you've set the `modalClass` option, the spinner will be prefixed with that class name instead.

You can add text or additional HTML to the spinner with the `spinnerHtml` option, or disable the spinner entirely by setting `showSpinner: false`.

The default spinner is from the excellent [SpinKit](http://tobiasahlin.com/spinkit/) by [Tobias Ahlin](https://twitter.com/tobiasahlin) 👍

## Events

The following events are triggered when AJAX modals are requested.

```js
$.modal.AJAX_SEND = 'modal:ajax:send';
$.modal.AJAX_SUCCESS = 'modal:ajax:success';
$.modal.AJAX_FAIL = 'modal:ajax:fail';
$.modal.AJAX_COMPLETE = 'modal:ajax:complete';
```

The handlers receive no arguments. The events are triggered on the `<a>` element which initiated the AJAX modal.

## More advanced AJAX handling

It's a good idea to provide more robust AJAX handling -- error handling, in particular. Instead of accommodating the myriad [`$.ajax` options](http://api.jquery.com/jQuery.ajax/) jQuery provides, jquery-modal makes it possible to directly modify the AJAX request itself.

Simply bypass the default AJAX handling (i.e.: don't use `rel="modal"`)

```html
<a href="ajax.html" rel="ajax:modal">Click me!</a>
```

and make your AJAX request in the link's click handler. Note that you need to manually append the new HTML/modal in the `success` callback:

```js
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
```

Note that the AJAX response must be wrapped in a div with class <code>modal</code> when using the second (manual) method.

# Bugs & Feature Requests

### Found a bug? MEH!

![](http://drops.kylefox.ca/1cqGP+)

**Just kidding.** Please [create an issue](https://github.com/kylefox/jquery-modal/issues/new) and **include a publicly-accessible demonstration of the bug.** [Dropbox](https://www.dropbox.com) or [JSFiddle](http://jsfiddle.net/) work well for demonstrating reproducable bugs, but you can use anything as long as it's publicly accessible. Your issue is much more likely to be resolved/merged if it includes a fix & pull request.

**Have an idea that improves jquery-modal?** Awesome! Please fork this repository, implement your idea (including documentation, if necessary), and submit a pull request.

I don't use this library as frequently as I used to, so if you want to see a fix/improvement you're best off submitting a pull request. Bugs without a test case and/or improvements without a pull request will be shown no mercy and closed!

# Contributing

## Maintainers Wanted

![](https://img.shields.io/badge/maintainers-wanted-red.svg)

This library became more popular and active than I ever expected, and unfortunately I don't have time to maintain it myself.

If you are interested in helping me maintain this library, please let me know — **I would love your help!**

[**Read more about becoming a maintainer &raquo;**](https://github.com/kylefox/jquery-modal/issues/170)

_I'd especially like people who would be excited about working towards a brand new **jQuery Modal 2.0**. See my [Proposal for jQuery Modal 2.0](https://github.com/kylefox/jquery-modal/issues/169) for more details & discussion._

## How to contribute

I welcome improvements to this plugin, particularly with:

* Performance improvements
* Making the code as concise/efficient as possible
* Bug fixes & browser compatibility

Please fork and send pull requests, or create an [issue](https://github.com/kylefox/jquery-modal/issues). Keep in mind the spirit of this plugin is **minimalism** so I'm very picky about adding _new_ features.

## Tips for development/contributing

* Make sure dependencies are installed: `npm install`
* After modifying `jquery.modal.js` and/or `jquery.modal.css`, you can optionally regenerate the minified files with `gulp min` and `gulp css` respectively.
* Make sure you have updated documentation (`README.md` and/or `examples/index.html`) if necessary. **Pull requests without documentation updates will be rejected.**
* Maintainers should increment version numbers and run `gulp changelog` when cutting a new release.

# Support

Please post a question on [StackOverflow](http://stackoverflow.com/). Commercial support by email is also available — please contact kylefox@gmail.com for rates. Unfortunately I am unable to provide free email support.

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
