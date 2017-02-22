//(require("jquery"), require("History"), window, document
//(function($, History, window, document, undefined) {
/*
 * 
 * $.page.create(url, options:{
 * * extend {}
 * * urlEqual true|false
 * * historyName String
 * * title String
 * * onhide, onhide, onshow(e:{url, extend, options:{
 * * * pushHistoryState:false|true
 * * * fullURL:String
 * * * overURL:String
 * * * direction:"next"|"prev"
 * * }})
 * * parent url
 * });
 * $.page.open();
 * $.page.init();
 * $.page.next();
 * $.page.prev();
 * 
 * @param {type} factory
 * @returns {undefined}
 * 
 * 
 * 
 * 
 */

require('jquery');
require('History');

export {$}
export {History}
import {Page} from "./Page.js"

$.page = Page;
	
window.addEventListener('popstate', function() {
	var state = History.getState(),
		config = state.data.options;
	config.pushHistoryState = false;
	config.direction = "prev";
	$.page.open(state.data.url, state.data.options);
});
