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
$.page.create([
	{url:"/", options:{
		urlEqual:false,
		title:"Титл",
		onshow:function(e) {
			console.log(this.title);
			$("#content").html("Главная страница.");
		}
	}},
	{url:"/catalog", options:{
		title:"Титлgg",
		onshow:function(e) {
			console.log(this.title);
			$("#content").html("Каталог.<div id='catalog_id'></div><p id='catalog_preloader_id'></p>");
		},
		onupdate:function(e) {
			$("#catalog_preloader_id").html("load"+e.url);
		}
	}},
	{url:"/catalog/e", options:{
		urlEqual:false,
		title:"Категория е",
		parent:"/catalog",
		onshow:function(e) {
			console.log(this.title);
			$("#catalog_id").html("Категория е"+e.options.overURL+".<div id='catalog_e_id'></div>");
		},
		onupdate:function(e) {
			$("#catalog_id").text("Категория е"+e.options.overURL+".");
		},
		onhide:function(e) {
			$("#catalog_id").html("");
		}
	}},
	{url:"/catalog/e/moi", options:{
		title:"moi",
		parent:"/catalog/e",
		onshow:function(e) {
			console.log(this.title);
			$("#catalog_e_id").html("moi");
		},
		onhide:function(e) {
			console.log("hide"+e.url);
		}
	}},
	{url:"/catalog/e/tvoi", options:{
		title:"tvoi",
		parent:"/catalog/e",
		onshow:function(e) {
			$("#catalog_e_id").html("tvoi");
		},
		onhide:function(e) {
			console.log("hide"+e.url);
		}
	}}
]);
$.page.init();