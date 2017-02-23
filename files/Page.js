/* 
 * Copyright (c) 2017 Артем.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *    Артем - initial API and implementation and/or initial documentation
 */
import {$} from "./jquery.page.js"
import {History} from "./jquery.page.js"
import {PageNode} from "./PageNode.js"

let _nodelist = [];

class Page {
	/**
	 * @description  
	 * @param {String} url
	 * @param {Object} options
	 * @return {Boolean} if page nodes create success return true 
	 */
	static create(url, options) {
		if (typeof url==="object" && url instanceof Array) {
			for(var objI in url) {
				if (typeof url[objI].options!=="object" || typeof url[objI].url!=="string") {
					console.error(this, "$.page.create([{options:{}, url:''}]); options not Object or url not String");
					return false;
				}
				var node = new PageNode(url[objI].url, url[objI].options);
				if (node===undefined) {
					console.error(this, "$.page.create(url, options); property invalid attribute");
					return false;
				}
				_nodelist.push(node);
			}
			return true;
		}else if (typeof url === "string") {
			if (!(typeof options === "object")) {
				console.error(this, "$.page.create(url, options); options not Object");
				return false;
			}
			var node = new PageNode(url, options);
			if (node===undefined) {
				console.error(this, "$.page.create(url, options); options invalid attribute");
				return false;
			}
			_nodelist.push(node);
			return true;
		}else{
			console.error(this, "$.page.create(url); url not String\\Object");
			return false;
		}
	}
	static open(url, options) {
		if (_nodelist.lenght===0||(typeof options!=="object"&&options!==undefined)||typeof url!=="string") return false;
		
		if (options===undefined) options = {};
		options.fullURL = url;
		options.overURL = "";
		if (options.direction===undefined) options.direction = "next";
		var reg, maxLength = _nodelist[0].url.length, maxNode = _nodelist[0];
		for(var i in _nodelist) {
			if (_nodelist[i].url===url) return _nodelist[i].open(_nodelist[i], [], options, 0);
			if (!_nodelist[i].urlEqual) {
				reg = new RegExp('^'+_nodelist[i].url, 'i');
				if (reg.test(url)&&_nodelist[i].url.length>maxLength) {
					maxLength = _nodelist[i].url.length;
					maxNode = _nodelist[i];
				}
			}
		}
		options.overURL = url.substr(maxLength);
		return maxNode.open(maxNode, [], options, 0);
	}
	static init() {
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
		$("[data-page]").each(function() {
			$(this).on("click", ()=>{
				$.page.open(this.getAttribute("href"));
				return false;
			});
		});
		return maxNode.open(maxNode, [], config, 0);
	}
	static next() {
		History.forward();
	}
	static prev() {
		History.back();
	}
}
export {Page, _nodelist}