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
import {_nodelist} from "./Page.js"

const MAX_TREE_DEEP = 255;

let noop = function(){},
	_nodeVisible = [];



class PageNode {
	constructor(url, options) {
		this.url = url;
		this.extend			= (typeof options.extend==="object")	? options.extend : {};
		this.urlEqual		= (typeof options.urlEqual==="boolean") ? options.urlEqual : true;
		this.historyName	= (typeof options.historyName==="string") ? options.historyName : "";
		this.title			= (typeof options.title==="string")		? options.title : "";
		this.onshow			= (typeof options.onshow==="function")	? options.onshow : noop;
		this.onhide			= (typeof options.onhide==="function")	? options.onhide : noop;
		this.onupdate		= (typeof options.onupdate==="function") ? options.onupdate : noop;
		
		if (typeof options.parent==="string") {
			var parent = _nodelist.find(e => e.url===options.parent);
			this.parent = parent===undefined ? options.parent : parent;
		}
	}
	open(node, newNodeVisible, options, itr) {
		if (itr<=MAX_TREE_DEEP) {
			if (typeof this.parent === "string") {
				var parent = _nodelist.find(e => e.url===this.parent);
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
}
export {PageNode}