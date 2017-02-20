//(require("jquery"), require("History"), window, document
//(function($, History, window, document, undefined) {
(function (factory) {
	if (typeof define==='function' && define.amd) {
		define(['jquery', 'History'], factory);
	}else if (typeof exports==='object' && typeof require==='function') {
		factory(require('jquery'), require('History'));
	}else{
		factory(jQuery, History);
	}
}(function($, _History, undefined) {
	"use strict";
	var noop = function(){},
		_nodelist = [],
		_nodeVisible = [],
		MAX_TREE_DEEP = 255;
	function Node(url, options) {
		this.url = url;
		if (typeof options.extend==="object")		this.extend = options.extend;
		if (typeof options.urlEqual==="boolean")	this.urlEqual = options.urlEqual;
		if (typeof options.historyName==="string")	this.historyName = options.historyName;
		if (typeof options.title==="string")		this.title = options.title;
		if (typeof options.onshow==="function")		this.onshow = options.onshow;
		if (typeof options.onhide==="function")		this.onhide = options.onhide;
		if (typeof options.onupdate==="function")	this.onupdate = options.onupdate;
		
		if (typeof options.parent==="string") {
			var parent = _nodelist.find(function(e){return e.url===options.parent;});
			this.parent = parent===undefined?options.parent:parent;
		}
	};
	Node.prototype = {
		url:"",
		urlEqual:true,
		historyName:"",
		title:"",
		parent:undefined,
		onshow:noop,
		onhide:noop,
		onupdate:noop,
		open:function (node, newNodeVisible, options, itr) {
		var that = this;
		if (itr<=MAX_TREE_DEEP) {
			if (typeof this.parent === "string") {
				var parent = _nodelist.find(function(e){return e.url===that.parent;});
				if (parent === undefined) {
					console.error(this, "URL:"+this.parent+" not found/"); 
				}else{
					this.parent = parent;
					parent.open(node, newNodeVisible, options, itr+1);
				}
			}else if (typeof this.parent === "object") {
				this.parent.open(node, newNodeVisible, options, itr+1);
			}
		}
		newNodeVisible.push(this);
		if (node===this) {
			var nodeEQid = -1;
			if (options.pushHistoryState!==false) History.pushState({url:options.fullURL, options:options}, this.title, options.fullURL);
			newNodeVisible.find(function(item){
				return item===_nodeVisible.find(function(item2, id){
					if (item2===item) {
						nodeEQid = id;
						return true;
					}
					return false;
				});
			});
			for(var i=nodeEQid+1; i<_nodeVisible.length; ++i) {
				_nodeVisible[i].onhide({
					url:this.url,
					extend:this.extend,
					options:options
				});
			}
			i = 0;
			++nodeEQid;
			if (nodeEQid>0) while(i<newNodeVisible.length) {
				if (i===nodeEQid) break;
				newNodeVisible[i].onupdate({
					url:this.url,
					extend:this.extend,
					options:options
				});
				++i;
			}
			while(i<newNodeVisible.length) {
				newNodeVisible[i].onshow({
					url:this.url,
					extend:this.extend,
					options:options
				});
				++i;
			}
			_nodeVisible = newNodeVisible;
			document.title = this.title;
			$(document).trigger("page.change", options.fullURL);
		}
	}
	};
	$.page = {};
	Object.defineProperties($.page, {
		"create":{
			configurable:false,
			enumerable:false,
			writable:false,
			value:function(url, property) {
				if (typeof url === "object"&&url instanceof Array) {
					for(var objI in url) {
						if (!(typeof url[objI].property === "object")||!(typeof url[objI].url === "string")) {
							console.error(this, "$.page.create([{property:{}, url:''}]); property not Object or url not String");
							return false;
						}
						var node = new Node(url[objI].url, url[objI].property);
						if (node===undefined) {
							console.error(this, "$.page.create(url, property); property invalid attribute");
							return false;
						}
						_nodelist.push(node);
					}
					return true;
				}else if (typeof url === "string") {
					if (!(typeof property === "object")) {
						console.error(this, "$.page.create(url, property); property not Object");
						return false;
					}
					var node = new Node(url, property);
					if (node===undefined) {
						console.error(this, "$.page.create(url, property); property invalid attribute");
						return false;
					}
					_nodelist.push(node);
					return true;
				}else{
					console.error(this, "$.page.create(url); url not String\\Object");
					return false;
				}
			}
		},
		"open":{
			configurable:false,
			enumerable:false,
			writable:false,
			value:function(url, config) {
				if (_nodelist.lenght===0||(typeof config!=="object"&&config!==undefined)||typeof url!=="string") return false;
				
				if (config===undefined) config = {};
				config.fullURL = url;
				config.overURL = "";
				var reg, maxLength = _nodelist[0].url.length, maxNode = _nodelist[0];
				for(var i in _nodelist) {
					if (_nodelist[i].url===url) return _nodelist[i].open(_nodelist[i], [], config, 0);
					if (!_nodelist[i].urlEqual) {
						reg = new RegExp('^'+_nodelist[i].url, 'i');
						if (reg.test(url)&&_nodelist[i].url.length>maxLength) {
							maxLength = _nodelist[i].url.length;
							maxNode = _nodelist[i];
						}
					}
				}
				config.overURL = url.substr(maxLength);
				return maxNode.open(maxNode, [], config, 0);
			}
		},
		"init":{
			configurable:false,
			enumerable:false,
			writable:false,
			value:function() {
				var url = window.location.pathname, config = History.getState();
				if (typeof config.data==="object") {
					config = config.data;
				}else{
					config = {};
				}
				config.overURL = "";
				var reg, maxLength = _nodelist[0].url.length, maxNode = _nodelist[0];
				for(var i in _nodelist) {
					if (_nodelist[i].url===url) return _nodelist[i].open(_nodelist[i], [], config, 0);
					if (!_nodelist[i].urlEqual) {
						reg = new RegExp('^'+_nodelist[i].url, 'i');
						if (reg.test(url)&&_nodelist[i].url.length>maxLength) {
							maxLength = _nodelist[i].url.length;
							maxNode = _nodelist[i];
						}
					}
				}
				config.overURL = url.substr(maxLength);
				return maxNode.open(maxNode, [], config, 0);
			}
		},
		"next":{
			configurable:false,
			enumerable:false,
			writable:false,
			value:function(){History.forward();}
		},
		"prev":{
			configurable:false,
			enumerable:false,
			writable:false,
			value:function(){History.back();}
		}
	});
	window.addEventListener('popstate', function() {
		var state = History.getState();
		state.data.options.pushHistoryState = false;
		$.page.open(state.data.url, state.data.options);
	});
}));
