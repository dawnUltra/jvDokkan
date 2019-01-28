// ==UserScript==
// @name	Jv Dokkan
// @updateURL https://gist.github.com/dawnUltra/80e0813b999dc3c91be23049fa2943e0/raw/eb773f5d471362ef4f18f43fa25e65ce090cc53c/JvDokkan.user.js
// @version	0.2
// @description	Outil dokkan pour jvc
// @author	DawnUltraC
// @include	http://www.jeuxvideo.com/forums/42-3004142-*
// @include	http://www.jeuxvideo.com/forums/42-3012000-*
// @grant	GM_addStyle
// @grant	GM.xmlHttpRequest
// ==/UserScript==

// ---------- RESSOURCES ----------

// Script pour la requête princpal (si c'est une image c'est la seul requête sinon il y aura une deuxième requête)

function get(url,ind,callback) {

	url = url.replace(/_\(tous\)/i,"");

	GM.xmlHttpRequest({
		method: "GET",
		url: url,
		onload: function (response) {
			var responseHTML = null;
			if (!response.responseHTML) {
				responseHTML = new DOMParser().parseFromString(response.responseText, "text/html");
				var imgSrc;
				var isEvent = false;
				if(/dbz-dokkanbattle/i.test(url)) {
					// Wikia Anglais
					if(responseHTML.querySelectorAll('.page-header__categories')[0].children[1].children[0].innerText.match(/Events/gi)) {
						//Evenement Wikia Anglais
						isEvent = true;
						let urlM = "http://dbz-dokkanbattle.wikia.com/wiki/" + responseHTML.querySelectorAll('.page-header__categories .page-header__categories-links a:not([href="/wiki/Category:DBS_Events"])')[0].innerText.replace(" ","_").replace(/(.*)_(.*)/,'$2_$1');
						let urlO = url;
						getEventBanner(urlO,urlM,function(imgSrc) {
							callback(imgSrc,ind,isEvent);
						});
					}
					else {
						//Image Personnage Wikia Anglais
						imgSrc = responseHTML.querySelector('a[href^="https://vignette.wikia.nocookie.net/"]').href;
						callback(imgSrc,ind,isEvent);
					}
				}
				//
				else if(/fr.dokkanbattlefr/i.test(url)) {
					// Wikia français
					if(responseHTML.querySelectorAll('.page-header__categories')[0].children[1].children[0].innerText.match(/Battle Z suprême|Événement/gi)){
						//Evenement sur le Wikia français
						isEvent = true;
						let urlM = "http://fr.dokkanbattlefr.wikia.com/wiki/" + responseHTML.querySelectorAll('.page-header__categories')[0].children[1].children[0].innerText.replace(" ","_");
						let urlO = url;
						getEventBanner(urlO,urlM,function(imgSrc) {
							callback(imgSrc,ind,isEvent);
						});
					}
					else {
						// Image sur le Wikia français
						imgSrc = responseHTML.querySelector('.image.image-thumbnail').children[0].dataset.src;
						callback(imgSrc,ind,isEvent);
					}
				}
			}
		},
	});
}

// Requête pour récupérer les bannières (la deuxième requête)

function getEventBanner(urlO,urlM,callback){
	GM.xmlHttpRequest({
		method: "GET",
		url: urlM,
		onload: function (response) {
			var responseHTML = null;
			if (!response.responseHTML) {
				responseHTML = new DOMParser().parseFromString(response.responseText, "text/html");
				if(urlO.match(/http:\/\/dbz-dokkanbattle\.wikia\.com/)) {
					let imgSrc = responseHTML.querySelector('a[href="' + urlO.match(/\/wiki\/.*/) + '"]').previousElementSibling.children[0].dataset.src
					callback(imgSrc);
				}
				else {
					responseHTML = new DOMParser().parseFromString(response.responseText, "text/html");
					let imgSrc = responseHTML.querySelector('a[href="' + urlO + '"]').parentElement.parentElement.querySelector('img[width="400"]').dataset.src
					callback(imgSrc);
				}
			}
		},
	});
}

//

// CSS

GM_addStyle(`

img[class^="ico"]{
height:3em;
}

.icoDs {
	height:1.5em!important;
}

.imgWikia {
	filter:brightness(75%);
	transition: all 0.2s;
	height:85px;
}

.imgWikia:hover {
	filter:brightness(100%);
}

.bannerWikia {
	filter:brightness(75%);
	transition: all 0.2s;
	height:90px;
}

.bannerWikia:hover {
	filter:brightness(100%);
}

`)

// Type Normal

var icoAgi = `https://vignette.wikia.nocookie.net/dokkanbattlefr/images/b/b7/AGI.png/revision/latest?cb=20161216233537&path-prefix=fr`;
var icoTec = `https://vignette.wikia.nocookie.net/dokkanbattlefr/images/b/b5/TEC.png/revision/latest?cb=20161216234359&path-prefix=fr`;
var icoInt = `https://vignette.wikia.nocookie.net/dokkanbattlefr/images/1/1e/INT.png/revision/latest?cb=20161216233930&path-prefix=fr`;
var icoPui = `https://vignette.wikia.nocookie.net/dokkanbattlefr/images/f/f2/PUI.png/revision/latest?cb=20161216234132&path-prefix=fr`;
var icoEnd = `https://vignette.wikia.nocookie.net/dokkanbattlefr/images/c/cd/END.png/revision/latest?cb=20161216234249&path-prefix=fr`;

// Type Super

var icoSAgi = `https://vignette.wikia.nocookie.net/dokkanbattlefr/images/9/9e/Superagi.png/revision/latest?cb=20161227181648&path-prefix=fr`;
var icoSTec = `https://vignette.wikia.nocookie.net/dokkanbattlefr/images/f/fa/Supertec.png/revision/latest?cb=20161227174310&path-prefix=fr`;
var icoSInt = `https://vignette.wikia.nocookie.net/dokkanbattlefr/images/f/ff/Superint.png/revision/latest?cb=20161228061305&path-prefix=fr`;
var icoSPui = `https://vignette.wikia.nocookie.net/dokkanbattlefr/images/4/4a/Superpui.png/revision/latest?cb=20161228092926&path-prefix=fr`;
var icoSEnd = `https://vignette.wikia.nocookie.net/dokkanbattlefr/images/d/d3/Superend.png/revision/latest?cb=20161228104850&path-prefix=fr`;

// Type Extreme

var icoEAgi = `https://vignette.wikia.nocookie.net/dokkanbattlefr/images/e/e6/Extr%C3%AAmeAGI.png/revision/latest?cb=20170129125124&path-prefix=fr`;
var icoETec = `https://vignette.wikia.nocookie.net/dokkanbattlefr/images/4/4b/Extr%C3%AAmetec.png/revision/latest?cb=20161228061231&path-prefix=fr`;
var icoEInt = `https://vignette.wikia.nocookie.net/dokkanbattlefr/images/3/31/Extr%C3%AAmeint.png/revision/latest?cb=20161231063154&path-prefix=fr`;
var icoEPui = `https://vignette.wikia.nocookie.net/dokkanbattlefr/images/f/f2/Extr%C3%AAmepui.png/revision/latest?cb=20170131143407&path-prefix=fr`;
var icoEEnd = `https://vignette.wikia.nocookie.net/dokkanbattlefr/images/6/6a/Extr%C3%AAmeEND.png/revision/latest?cb=20170129201227&path-prefix=fr`;

// Rareté

var icoSsr = `https://i.imgur.com/hJFglO1.png"/>`;
var icoUr = `https://vignette.wikia.nocookie.net/dokkanbattlefr/images/5/53/UR.png/revision/latest?cb=20161227194041&path-prefix=fr`;
var icoTur = `https://vignette.wikia.nocookie.net/dbz-dokkanbattle/images/2/27/TUR_.png/revision/latest?cb=20160719232222"/>`;
var icoLr = `https://vignette.wikia.nocookie.net/dbz-dokkanbattle/images/b/bc/LR_logo.png/revision/latest?cb=20161223130945`;

// Special

var icoDs = `https://vignette.wikia.nocookie.net/dbz-dokkanbattle/images/2/27/DS_icon.png/revision/latest?cb=20150903084549`

// Tableaux

var tabTypeNormal = ["Agi|L'Agi", "Tec", "Int", "Pui", "End"];

var tabTypeSE = ["Super Agi","Ext Agi|Extreme Agi|Extrême Agi","Super Tec","Ext Tec|Extreme Tec|Extrême Tec","Super Int","Ext Int|Extreme Int|Extrême Int","Super Pui","Ext Pui|Extreme Pui|Extrême Pui","Super End","Ext End|Extreme End|Extrême End"]

var tabRare = ["Ssr","Ur","Tur","Lr","Ds"];

var tabTypeSEFormat = ["icoSAgi","icoEAgi","icoSTec","icoETec","icoSInt","icoEInt","icoSPui","icoEPui","icoSEnd","icoEEnd"];

var tabTypeNormalFormat = ["icoAgi","icoTec","icoInt","icoPui","icoEnd"];

var tabRareFormat = ["icoSsr","icoUr","icoTur","icoLr","icoDs"];

var tabCat = [""]

// ---------- SCRIPT ----------

function main() {
	var posts = document.querySelectorAll('.txt-msg.text-enrichi-forum');

	var linkTab = [];

	for (var i = 0; i < posts.length; i++) {
		var paragraphes = posts[i].querySelectorAll('p')
		paragraphes.forEach(function(element) {
			// fonction pour remplacer les icones
			icoPrepare(element,tabTypeNormal,tabTypeSE,tabRare,tabTypeSEFormat,tabTypeNormalFormat,tabRareFormat);
			// fonction pour recuperer tout les liens du wikia
			prepareWikia(element,linkTab);
			// fonction pour Afficher les catégories
			//displayCat(element);
		});
	}
	loadIco(tabTypeSEFormat,tabTypeNormalFormat,tabRareFormat);
	requestImg(linkTab);
}

//<img class="ico` + strIco + `" src="">

function icoPrepare(element,tabTypeNormal,tabTypeSE,tabRare,tabTypeSEFormat,tabTypeNormalFormat,tabRareFormat) {
	for(var i=0;i<tabTypeSE.length;i++){
		let regex = new RegExp("(?:^|\\s|\\()(" + tabTypeSE[i] + ")(?:$|\\s|\\.|\\,)","gi");
		element.innerHTML = element.innerHTML.replace(regex,` <img class="`+ tabTypeSEFormat[i] + `" src=""> `);
	}
	for(var j=0;j<tabTypeNormal.length;j++){
		let regex = new RegExp("(?:^|\\s|\\()(" + tabTypeNormal[j] + ")(?:$|\\s|\\.|\\,)","gi");
		element.innerHTML = element.innerHTML.replace(regex,` <img class="`+ tabTypeNormalFormat[j] + `" src=""> `);
	}
	for(var k=0;k<tabRare.length;k++){
		let regex = new RegExp("(?:^|\\s|\\()(" + tabRare[k] + ")(?:$|\\s|\\.|\\,)","gi");
		element.innerHTML = element.innerHTML.replace(regex,` <img class="`+ tabRareFormat[k] + `" src=""> `);
	}
}

function prepareWikia(element,linkTab) {
	var regexWikiaLink = /(<a href="(https?:\/\/fr\.dokkanbattlefr\.wikia\.com\/wiki\/.*?|https?:\/\/dbz-dokkanbattle\.fandom\.com\/wiki\/.*?)".*?<\/a>)/gi
	var matches, output = [[]];
	while (matches = regexWikiaLink.exec(element.innerHTML)) {
		output.push(matches);
	}
	if(output.length>1){
		for(var i=1;i<output.length;i++) {
			var canAdd=true
			var ind;
			for(var j=0;j<linkTab.length;j++){
				if(output[i][2] == linkTab[j]){
					canAdd=false;
					ind = j;
				}
			}
			if(canAdd){
				linkTab.push(output[i][2]);
				element.innerHTML = element.innerHTML.replace(output[i][1],`<a href="`+ output[i][2] +`"><img class="imgWikia link-` + (linkTab.length-1) + `" src="https://samherbert.net/svg-loaders/svg-loaders/oval.svg"</a>`);
			}
			else {
				element.innerHTML = element.innerHTML.replace(output[i][1],`<a href="`+ output[i][2] +`"><img class="imgWikia link-` + ind + `" src="https://samherbert.net/svg-loaders/svg-loaders/oval.svg"</a>`);
			}
		}
	}
}

//function displayCat(element) { EN CONSTRUCTION
//	var regexWikiaLink = /(<a href="(http:\/\/fr\.dokkanbattlefr\.wikia\.com\/wiki\/.*?|http:\/\/dbz-dokkanbattle\.wikia\.com\/wiki\/.*?)".*?<\/a>)/gi
//	var matches, output = [[]];
//	while (matches = regexWikiaLink.exec(element.innerHTML)) {
//		output.push(matches);
//	}
//	if(output.length>1){
//		for(var i=1;i<output.length;i++) {
//			var canAdd=true
//			var ind;
//			for(var j=0;j<linkTab.length;j++){
//				if(output[i][2] == linkTab[j]){
//					canAdd=false;
//					ind = j;
//				}
//			}
//			if(canAdd){
//				linkTab.push(output[i][2]);
//				element.innerHTML = element.innerHTML.replace(output[i][1],`<a href="`+ output[i][2] +`"><img class="imgWikia link-` + (linkTab.length-1) + `" src="https://samherbert.net/svg-loaders/svg-loaders/oval.svg"</a>`);
//			}
//			else {
//				element.innerHTML = element.innerHTML.replace(output[i][1],`<a href="`+ output[i][2] +`"><img class="imgWikia link-` + ind + `" src="https://samherbert.net/svg-loaders/svg-loaders/oval.svg"</a>`);
//			}
//		}
//	}
//}

function requestImg(linkTab) {
	var nbLoaded=0;
	for(var i=0;i<linkTab.length;i++) {
		get(linkTab[i],i,function(imgSrc,ind,isEvent){
			var imgs = document.querySelectorAll(`.imgWikia.link-`+ ind + ``)
			imgs.forEach(function(img) {
				if(isEvent) {
					img.className = img.className.replace(/imgWikia/,"bannerWikia");
				}
				img.src = imgSrc;
			});
		});
	}
}

function loadIco(tabTypeSEFormat,tabTypeNormalFormat,tabRareFormat){
	for(var i=0;i<tabTypeSEFormat.length;i++){
		let icos = document.querySelectorAll(`.`+ tabTypeSEFormat[i]);
		icos.forEach(function(ico) {
			ico.src = eval(tabTypeSEFormat[i]);
		});
	}
	for(var j=0;j<tabTypeNormalFormat.length;j++){
		let icos = document.querySelectorAll(`.`+ tabTypeNormalFormat[j]);
		icos.forEach(function(ico) {
			ico.src = eval(tabTypeNormalFormat[j]);
		});
	}
	for(var k=0;k<tabRareFormat.length;k++){
		let icos = document.querySelectorAll(`.`+ tabRareFormat[k]);
		icos.forEach(function(ico) {
			ico.src = eval(tabRareFormat[k]);
		});
	}
}

main();
