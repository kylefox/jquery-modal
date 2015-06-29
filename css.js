'use strict';

var fs = require('fs');

var insertCssFactory = function ($) {
  return function (css) {
    return $('<style/>').html(css).appendTo('head');
  };
};

module.exports = function (window) {
  var $ = window.jQuery;
  var insertCss = insertCssFactory($);
  var css = fs.readFileSync(__dirname + '/jquery.modal.css', 'utf8');
  insertCss(css);
};
