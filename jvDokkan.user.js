// ==UserScript==
// @name	Jv Dokkan
// @updateURL	https://dawnultra.github.io/jvdokkan/jvDokkan.user.js
// @downloadURL	https://dawnultra.github.io/jvdokkan/jvDokkan.user.js
// @version	0.7
// @description	Script Dokkan Battle pour le forum JVC
// @author	DawnUltra
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
				var isCat = false;
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
						callback(imgSrc,ind);
					}
				}
				//
				else if(/dokkanbattlefr/i.test(url)) {
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
					else if(/Cat%C3%A9gorie/i.test(url)){
						isCat = true;
						imgSrc = responseHTML.querySelector('.page-header__title').innerText.replace(/(.*)- (.*)/i,"$2")
						callback(imgSrc,ind,isEvent,isCat);
					}
					else {
						// Image sur le Wikia français
						imgSrc = responseHTML.querySelector('.image.image-thumbnail').children[0].dataset.src;
						callback(imgSrc,ind);
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
				if(urlO.match(/dbz-dokkanbattle/i)) {
					//Wikia anglais
					if(urlO.charAt(urlO.length-1) == ".") {
						console.log(responseHTML.querySelector('a[href="' + urlO.match(/\/wiki\/.*/) + '"]'));
						let imgSrc = responseHTML.querySelector('a[href="' + urlO.match(/\/wiki\/.*/) + '"]').previousElementSibling.children[0].dataset.src
					}
					else {
						let imgSrc = responseHTML.querySelector('a[href="' + urlO.match(/\/wiki\/.*/) + '"]').previousElementSibling.children[0].dataset.src
					}
					callback(imgSrc);
				}
				else {
					//Wikia français
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

img[class^="icoDs"]{
	height:1.5em;
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

.categorie {
    display: inline-block;
	padding:5px;
    text-align: center;
    vertical-align: middle;
    border: 2px solid #5da03c;
    border-radius: 10px;
    background: linear-gradient(to bottom, #123d12, #090e09);
    box-shadow: #050000 0px 0px 0px 1px;
    font: italic normal normal 20px trebuchet ms;
    color: #d3b239!important;
    text-decoration: none;
	filter:brightness(85%);
	transition: all 0.2s;
}
.categorie:hover {
    filter:brightness(110%);
	color: #d3b239!important;
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

// DIVERS

// Rareté

var icoSsr = `https://i.imgur.com/hJFglO1.png"/>`;
var icoUr = `https://vignette.wikia.nocookie.net/dokkanbattlefr/images/5/53/UR.png/revision/latest?cb=20161227194041&path-prefix=fr`;
var icoTur = `https://vignette.wikia.nocookie.net/dbz-dokkanbattle/images/2/27/TUR_.png/revision/latest?cb=20160719232222"/>`;
var icoLr = `https://vignette.wikia.nocookie.net/dbz-dokkanbattle/images/b/bc/LR_logo.png/revision/latest?cb=20161223130945`;

// Spécial

var icoDs = `https://vignette.wikia.nocookie.net/dbz-dokkanbattle/images/2/27/DS_icon.png/revision/latest?cb=20150903084549`

var icoDsRouge = `https://vignette.wikia.nocookie.net/dbz-dokkanbattle/images/3/38/God_Stone.png/revision/latest?cb=20170716164559`;

// Tableaux

var tabTypeNormal = ["Agi|L'Agi", "Tec", "Int", "Pui", "End"];

var tabTypeSE = ["Super Agi","Ext Agi|Extreme Agi|Extrême Agi","Super Tec","Ext Tec|Extreme Tec|Extrême Tec","Super Int","Ext Int|Extreme Int|Extrême Int","Super Pui","Ext Pui|Extreme Pui|Extrême Pui","Super End","Ext End|Extreme End|Extrême End"]

var tabDivers = ["Ssr","Ur","Tur","Lr","Ds Rouge","Ds"];

var tabTypeSEFormat = ["icoSAgi","icoEAgi","icoSTec","icoETec","icoSInt","icoEInt","icoSPui","icoEPui","icoSEnd","icoEEnd"];

var tabTypeNormalFormat = ["icoAgi","icoTec","icoInt","icoPui","icoEnd"];

var tabDiversFormat = ["icoSsr","icoUr","icoTur","icoLr","icoDsRouge","icoDs",];

var tabCat = [""]

// ---------- SCRIPT ----------

function main() {
	var posts = document.querySelectorAll('.txt-msg.text-enrichi-forum');

	var linkTab = [];

	for (var i = 0; i < posts.length; i++) {
		var paragraphes = posts[i].querySelectorAll('p')
		paragraphes.forEach(function(element) {
			// fonction pour remplacer les icones
			icoPrepare(element,tabTypeNormal,tabTypeSE,tabDivers,tabTypeSEFormat,tabTypeNormalFormat,tabDiversFormat);
			// fonction pour recuperer tout les liens du wikia
			prepareWikia(element,linkTab);
			// fonction pour Afficher les catégories
			//displayCat(element);
		});
	}
	loadIco(tabTypeSEFormat,tabTypeNormalFormat,tabDiversFormat);
	requestImg(linkTab);
}

//<img class="ico` + strIco + `" src="">

function icoPrepare(element,tabTypeNormal,tabTypeSE,tabDivers,tabTypeSEFormat,tabTypeNormalFormat,tabDiversFormat) {
	for(var i=0;i<tabTypeSE.length;i++){
		let regex = new RegExp("(?<!week)(^|\\s|\\(|\")(" + tabTypeSE[i] + ")($|\\s|\\.|\\,)","gi");
		element.innerHTML = element.innerHTML.replace(regex,`$1<img class="`+ tabTypeSEFormat[i] + `" src="">$3`);
	}
	for(var j=0;j<tabTypeNormal.length;j++){
		let regex = new RegExp("(?<!week)(^|\\s|\\(|\")(" + tabTypeNormal[j] + ")($|\\s|\\.|\\,)","gi");
		element.innerHTML = element.innerHTML.replace(regex,`$1<img class="`+ tabTypeNormalFormat[j] + `" src="">$3`);
	}
	for(var k=0;k<tabDivers.length;k++){
		let regex = new RegExp("(?<!week)(^|\\s|\\(|\")(" + tabDivers[k] + ")($|\\s|\\.|\\,)","gi");
		element.innerHTML = element.innerHTML.replace(regex,`$1<img class="`+ tabDiversFormat[k] + `" src="">$3`);
	}
}

function prepareWikia(element,linkTab) {
	var regexWikiaLink = /(<a href="(https?:\/\/dokkanbattlefr\.fandom\.com\/fr\/wiki\/.*?|https?:\/\/dbz-dokkanbattle\.(wikia|fandom)\.com\/wiki\/.*?)".*?<\/a>)/gi
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

function requestImg(linkTab) {
	var nbLoaded=0;
	for(var i=0;i<linkTab.length;i++) {
		get(linkTab[i],i,function(imgSrc,ind,isEvent,isCat){
			var imgs = document.querySelectorAll(`.imgWikia.link-`+ ind + ``)
			imgs.forEach(function(img) {
				if(isEvent) {
					img.className = img.className.replace(/imgWikia/,"bannerWikia");
				}
				else if(isCat) {
					img.parentElement.className = "categorie";
					img.outerHTML = imgSrc
				}
				img.src = imgSrc;
			});
		});
	}
}

function loadIco(tabTypeSEFormat,tabTypeNormalFormat,tabDiversFormat){
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
	for(var k=0;k<tabDiversFormat.length;k++){
		let icos = document.querySelectorAll(`.`+ tabDiversFormat[k]);
		icos.forEach(function(ico) {
			ico.src = eval(tabDiversFormat[k]);
		});
	}
}

main();