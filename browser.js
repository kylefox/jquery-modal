'use strict';

var loadCss = require('./css');

require('./jquery.modal.js');

loadCss(window);

// return a function so that it can be used platform-independent as a factory
// even though it's not an actual factory in the browser.
module.exports = function () {};
