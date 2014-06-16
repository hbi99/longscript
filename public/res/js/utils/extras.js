/* jshint unused:false*/

/***  COMMON  ***/
var observer = function() {
	var stack = {};
	return {
		on: function(type, fn) {
			if (!stack[type]) {
				stack[type] = [];
			}
			stack[type].push(fn);
		},
		off: function(type, fn) {
			if (!stack[type]) return;
			var i = stack[type].indexOf(fn);
			stack[type].splice(i,1);
		},
		trigger: function(type, detail) {
			if (!stack[type]) return;
			var event = {
					type : type,
					details : detail,
					isCanceled : false,
					cancelBubble : function() {
						this.isCanceled = true;
					}
				},
				i = 0,
				il = stack[type].length;
			for (; i<il; i++) {
				if (event.isCanceled) return;
				stack[type][i](event);
			}
		}
	};
};

var transform = function(options) {
	var fragment,
		ownerDocument,
		treeTemplate = sys.fs.xsl.selectSingleNode('//xsl:template[@name="'+ options.template +'"]'),
		xslPrc = new XSLTProcessor();

	if (options.template === 'menu') {
		var xMenu = sys.ledger.selectSingleNode( options.match );
		if (xMenu.getAttribute('invoke')) {
			options.match = '//context//*[@for=\''+ xMenu.getAttribute('invoke') +'\']';
		}
	}
	treeTemplate.setAttribute('match', options.match);
	xslPrc.importStylesheet(sys.fs.xsl);

	ownerDocument = document.implementation.createDocument('', '', null);
	fragment = xslPrc.transformToFragment(sys.ledger, ownerDocument);
	treeTemplate.removeAttribute('match');
	// trim fragment
	if (fragment.firstChild && fragment.firstChild.nodeType === 3) fragment.removeChild(fragment.firstChild);
	if (fragment.lastChild && fragment.lastChild.nodeType === 3) fragment.removeChild(fragment.lastChild);
	
	if (options.silent) return fragment;
	//else if (!options.target) return fragment.childNodes[0];
	else if (!options.target) return fragment;
	else jr(options.target).html(fragment.xml);
};

var matchesSelector = function(elem, selector) {
	var html = document.documentElement;
	return (html.matchesSelector ||
			html.webkitMatchesSelector ||
			html.mozMatchesSelector ||
			html.msMatchesSelector).call(elem, selector);
};
var fixStyleName = function(name) {
	return name.replace(/-([a-z]|[0-9])/ig, function(m, letter) {
		return (letter +"").toUpperCase();
	});
};
var getStyle = function(el, name) {
	name = name.replace(/([A-Z]|^ms)/g, "-$1" ).toLowerCase();

	var value = document.defaultView.getComputedStyle(el, null).getPropertyValue(name);
	if (name === 'opacity') {
		if (getStyle(el, 'display') === 'none') {
			el.style.display = 'block';
			el.style.opacity = '0';
			value = '0';
		}
	}
	if (value === 'auto') {
		switch (name) {
			case 'top': value = el.offsetTop; break;
			case 'left': value = el.offsetLeft; break;
			case 'width': value = el.offsetWidth; break;
			case 'height': value = el.offsetHeight; break;
		}
	}
	return value;
};
var getDim = function(el, a, v) {
	a = a || 'nodeName';
	v = v || 'BODY';
	var p = {w:el.offsetWidth, h:el.offsetHeight, t:0, l:0, obj:el};
	while (el && el[a] !== v && (el.getAttribute && el.getAttribute(a) !== v)) {
		if (el === document.firstChild) return null;
		p.t += el.offsetTop - el.scrollTop;
		p.l += el.offsetLeft - el.scrollLeft;
		if (el.scrollWidth > el.offsetWidth && el.style.overflow === 'hidden') {
			p.w = Math.min(p.w, p.w-(p.w + p.l - el.offsetWidth - el.scrollLeft));
		}
		el = el.offsetParent;
	}
	return p;
};
var isAdjacentSibling = function(el1, el2) {
	var currParentEl = el1.parentNode,
		currEl = el1,
		isAdjacent = false;
	if (!currParentEl || !el2.parentNode) return isAdjacent;
	while (!isAdjacent && currEl && currParentEl.firstChild !== currEl) {
		currEl = currEl.previousSibling;
		if (currEl.nodeType === 3) continue;
		if (currEl === el2) isAdjacent = -1;
		break;
	}
	currEl = el1;
	while (!isAdjacent && currEl && currParentEl.lastChild !== currEl) {
		currEl = currEl.nextSibling;
		if (currEl.nodeType === 3) continue;
		if (currEl === el2) isAdjacent = 1;
		break;
	}
	return isAdjacent;
};

/***  EASING FUNCTIONS  ***/
/* jshint ignore:start */
var Tween = {
	linear: function(t,b,c,d) {return c*t/d+b;},
	easeIn: function(t,b,c,d) {return c*(t/=d)*t*t+b;},
	easeOut: function(t,b,c,d) {return c*((t=t/d-1)*t*t+1)+b;},
	easeInOut: function(t,b,c,d) {return ((t/=d/2)<1)? c/2*t*t*t+b : c/2*((t-=2)*t*t+2)+b;}
};
/* jshint ignore:end */

/***  REQUEST ANIMATION FRAME  ***/
if (!window.requestAnimationFrame) {
	window.requestAnimationFrame = (function() {
		return	window.requestAnimationFrame || 
				window.webkitRequestAnimationFrame || 
				window.mozRequestAnimationFrame || 
				window.oRequestAnimationFrame || 
				window.msRequestAnimationFrame || 
				function(callback) {
					window.setTimeout(callback, 1000 / 60);
				};
	})();
}

if (!Function.prototype.hasOwnProperty('bind')) {
	Function.prototype.bind = function (obj) {
		var self = this;
		return function () {
			return self.apply(obj, arguments);
		};
	};
}
// selectNodes & selectSingleNode
if (!Element.prototype.hasOwnProperty('selectNodes')) {
	Document.prototype.selectNodes = function(XPath, XNode) {
		var res = [],
			i=0;
		XNode = XNode || this;
		this.ns = this.createNSResolver(this.documentElement);
		this.qI = this.evaluate(XPath, XNode, this.ns, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		for(; i<this.qI.snapshotLength; i++) {
			res[i] = this.qI.snapshotItem(i);
		}
		return res;
	};
	Document.prototype.selectSingleNode = function(XPath, XNode) {
		this.ns = this.createNSResolver(this.documentElement);
		this.xI = this.selectNodes(XPath, XNode);
		return (this.xI.length > 0)? this.xI[0] : null ;
	};
	Element.prototype.selectNodes = function(XPath) {
		return this.ownerDocument.selectNodes(XPath, this);
	};
	Element.prototype.selectSingleNode = function(XPath) {
		return this.ownerDocument.selectSingleNode(XPath, this);
	};
}

if (!Node.xml) {
	Node.prototype.__defineGetter__('xml', function() {return (new XMLSerializer()).serializeToString(this);});
}

/***  EXTEND CANVAS  ***/
CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius) {
	this.beginPath();
	this.moveTo(x + radius, y);
	this.lineTo(x + width - radius, y);
	this.quadraticCurveTo(x + width, y, x + width, y + radius);
	this.lineTo(x + width, y + height - radius);
	this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
	this.lineTo(x + radius, y + height);
	this.quadraticCurveTo(x, y + height, x, y + height - radius);
	this.lineTo(x, y + radius);
	this.quadraticCurveTo(x, y, x + radius, y);
	this.closePath();
	return this;
};

/***  EXTEND ARRAY  ***/
if (!Array.prototype.hasOwnProperty('remove')) {
	Array.prototype.remove = function(obj) {
		var i = this.length;
		while (i--) {
			if (this[i] === obj) this.splice(i, 1);
		}
	};
}
if (!Array.prototype.hasOwnProperty('shuffle')) {
	Array.prototype.shuffle = function() {
		var s = [];
		while (this.length) {
			s.push(this.splice(Math.random() * this.length, 1)[0]);
		}
		while (s.length) {
			this.push(s.pop());
		}
		return this;
	};
}
if (!Array.prototype.hasOwnProperty('removeDuplicates')) {
	Array.prototype.removeDuplicates = function() {
		var unique = [];
		this.forEach(function(value) {
			if (unique.indexOf(value) === -1) {
				unique.push(value);
			}
		});
		return unique;
	};
}
if (!Array.prototype.hasOwnProperty('difference')) {
	Array.prototype.difference = function(a) {
		return this.filter(function(i) {return (a.indexOf(i) === -1);});
	};
}
if(!Array.prototype.hasOwnProperty('sortInt')) {
	Array.prototype.sortInt = function() {
		this.sort(function(a,b) {
			return a - b;
		});
	};
}
if(!Array.hasOwnProperty('isArray')) {
	Array.isArray = function(arg) {
		return Object.prototype.toString.call(arg) === '[object Array]';
	};
}

/***  EXTEND MATH  ***/
if (!Math.clamp) {
	Math.clamp = function(value, min, max) {
		return Math.min(Math.max(value, min), max);
	};
}

/***  EXTEND STRING  ***/
String.prototype.fill = function(i, c) {
	var s = this;
	c = c || ' ';
	for (; s.length<i; s+=c);
	return s;
};
String.prototype.pad = function(i, c) {
	var s = this;
	c = c || ' ';
	for (; s.length<i; s=c+s);
	return s;
};

/***  EXTEND NUMBER  ***/
Number.prototype.pad = function(i, c) {
	return this.toString().pad(i, c);
};
Number.prototype.fixed = function(d) {
	return +this.toFixed(d);
};
