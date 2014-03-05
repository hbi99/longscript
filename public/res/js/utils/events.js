
var hotkeys = {
	specialKeys: {
		8: "backspace", 9: "tab", 13: "return", 16: "shift", 17: "ctrl", 18: "alt", 19: "pause",
		20: "capslock", 27: "esc", 32: "space", 33: "pageup", 34: "pagedown", 35: "end", 36: "home",
		37: "left", 38: "up", 39: "right", 40: "down", 45: "insert", 46: "del", 
		96: "0", 97: "1", 98: "2", 99: "3", 100: "4", 101: "5", 102: "6", 103: "7",
		104: "8", 105: "9", 106: "*", 107: "+", 109: "-", 110: ".", 111 : "/", 
		112: "f1", 113: "f2", 114: "f3", 115: "f4", 116: "f5", 117: "f6", 118: "f7", 119: "f8", 
		120: "f9", 121: "f10", 122: "f11", 123: "f12", 144: "numlock", 145: "scroll", 191: "/", 224: "meta"
	},
	shiftNums: {
		"`": "~", "1": "!", "2": "@", "3": "#", "4": "$", "5": "%", "6": "^", "7": "&", 
		"8": "*", "9": "(", "0": ")", "-": "_", "=": "+", ";": ": ", "'": "\"", ",": "<", 
		".": ">",  "/": "?",  "\\": "|"
	}
};

sys.events = {
	init: function() {
		this.guid = 1;
		this.nativeEvents = 'blur focus focusin focusout load resize scroll unload click dblclick '+
							'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave '+
							'change select submit keydown keypress keyup error contextmenu'.split(' ');

		this.addEvent(window, 'unload', sys.dispose.bind(sys));
		this.addEvent(window, 'DOMNodeRemoved', this.flushHandlers.bind(this));
		this.addEvent(document, 'mouseover '+
								'mouseout '+
								'mouseup '+
								'mousedown '+
								'mousemove', this.mouseOudo, '.LIVE, .TOGGLE, .RADIO');
		this.addEvent(document, 'keyup '+
								'keydown '+
								'keypress', this.keyDup.bind(this));
		//document.onselectstart = function () {return false;};
	},
	dispose: function() {
		this.flushHandlers(document);
	},
	registerHotkeys: function() {
		var _sys = sys,
			hotkeys = _sys.fs.xml.selectNodes('//hotkeys/*');
		if (hotkeys.length > 0) {
			var keys = {};
			for (var i=0, il=hotkeys.length; i<il; i++) {
				var hk = (!_sys.isMac && hotkeys[i].getAttribute('pc_keys'))? hotkeys[i].getAttribute('pc_keys') : hotkeys[i].getAttribute('keys') ;
				keys[hk] = hotkeys[i].getAttribute('action');
			}
			_sys.shell.doCmd.keys = keys;
			jr(document).bind('hotkey', _sys.shell.doCmd);
		}
	},
	flushHandlers: function(e) {
		var elem = (e.nodeType)? e : e.target;
		if (!elem.getElementsByTagName) return;
		var children = elem.getElementsByTagName('*'),
			sysId = sys.id,
			i = 0,
			il = children.length;
		for (; i<il; i++) {
			this.removeEvent(children[i]);
			sys.bank.flushAll(children[i]);
			delete children[i][sysId];
		}
		sys.bank.flushAll(elem[sysId]);
		delete elem[sysId];
		this.removeEvent(elem);
	},
	addEvent: function(elem, types, handler, selector) {
		var type = types.split(/\s+/),
			i = 0,
			il = type.length,
			obj,
			guid;
		handler._guid = handler._guid || ++this.guid;
		obj = {};

		for (; i<il; i++) {
			guid = ++this.guid;
			obj[type[i]] = {};
			obj[type[i]][guid] = {
				guid: guid,
				handler: handler,
				selector: selector
			};
		}
		sys.bank.deposit(elem, {events : obj});

		for (i=0; i<il; i++) {
			if (elem['on'+ type[i]] && elem['on'+ type[i]] !== this.handleEvent) {
				obj[type[i]][0] = {
					handler: elem['on'+ type[i]]
				};
				sys.bank.deposit(elem, {events : obj});
			}
			if (type[i] === 'mousewheel') {
				elem.addEventListener(type[i], this.handleEvent, false);
			} else {
				elem['on'+ type[i]] = this.handleEvent;
			}
		}
	},
	removeEvent: function(elem, types, handler, selector) {
		if (arguments.length === 1) {
			sys.bank.flushAll(elem);
			return;
		}
		var type = types.split(/\s+/),
			i = 0,
			il = type.length,
			vault = sys.bank.vault,
			shelf,
			safe,
			key,
			content;

		if (types.indexOf('DOM') > -1 && elem.removeEventListener) {
			elem.removeEventListener(types, handler, false);
		} else if (types && handler) {
			shelf = vault[elem[sys.id]];
			for (; i<il; i++) {
				safe = shelf.events[type[i]];
				for (key in safe) {
					content = safe[key];
					if (content.handler._guid === handler._guid && content.selector === selector) {
						delete safe[key];
						break;
					}
				}
			}
			//delete vault[elem[sys.id]];
		}
	},
	handleEvent: function(event) {
		var returnValue = true,
			type = event.type,
			target = event.target,
			handlers = sys.bank.balance(this, 'events'),
			_handlers,
			_name,
			_eventHandler,
			_handleSelector,
			_fbHandler;
		if (type === 'mousedown' && event.button === 0) {
			if (target.getAttribute('data-context') !== 'exception') sys.context.clear( target );
			_fbHandler = target.getAttribute('data-event_fb');
			if (_fbHandler) {
				sys.events.focusEl = target;
				return sys.shell.exec(_fbHandler +' focus');
			}
			if (sys.events.focusEl) {
				if (jr(target).parents('*[data-focus_none]').length > 0) return;
				_fbHandler = sys.events.focusEl.getAttribute('data-event_fb');
				sys.events.focusEl = false;
				return sys.shell.exec(_fbHandler +' blur');
			}
		}
		if (!handlers) return returnValue;
		_handlers = handlers[type];
		event.stopPropagation = function() {
			this.isBubblingCanceled = true;
		};
		while (target !== null && target !== this) {
			for (_name in _handlers) {
				_eventHandler = _handlers[_name];
				_handleSelector = _eventHandler.selector;
				if (_handleSelector && matchesSelector(target, _handleSelector)) {
					if (_eventHandler.handler.call(target, event) === false) {
						returnValue = false;
					}
					if (event.isBubblingCanceled) {
						return returnValue;
					}
				}
			}
			target = target.parentNode;
		}
		if (!event.isBubblingCanceled) {
			for (_name in _handlers) {
				_eventHandler = _handlers[_name];
				if (_eventHandler.selector) continue;
				if (_eventHandler.handler.call(this, event) === false) {
					returnValue = false;
				}
			}
		}
	},
	mouseOudo: function(event) {
		var type = event.type,
			el = event.target,
			dom = jr(),
			fn_hasClass = dom.hasClass,
			fn_addClass = dom.addClass,
			fn_removeClass = dom.removeClass,
			addCn;
		if (fn_hasClass('disabled', this)) return;
		switch (type) {
			case 'mousemove': break;
			case 'mouseout': addCn = ' '; break;
			case 'mouseover': addCn = 'over'; break;
			case 'mouseup': addCn = 'over'; break;
			case 'mousedown':
				addCn = 'down';
				if (fn_hasClass('TOGGLE', this)) {
					if (fn_hasClass('toggle_on', this)) {
						fn_removeClass('toggle_on', this);
						fn_addClass('toggle_off', this);
					} else {
						fn_removeClass('toggle_off', this);
						fn_addClass('toggle_on', this);
					}
				} else if (fn_hasClass('RADIO', this)) {
					dom.find('.RADIO', el.parentNode).removeClass('active');
					addCn += ' active';
				}
				break;
		}
		if (addCn) {
			fn_removeClass('down up over', this);
			fn_addClass(addCn, this);
		}
	},
	keyDup: function(event) {
		var type = event.type, el = event.target, handlers, hotKey,
			special = event.type !== "keypress" && hotkeys.specialKeys[ event.which ],
			character = String.fromCharCode(event.which).toLowerCase(),
			etype,
			fn,
			elAttr,
			modif = '',
			possible = {};
		while (el) {
			elAttr = el.getAttribute;
			if (el.nodeType) {
				handlers = sys.bank.balance(el, 'events');
				if (handlers && handlers.hotkey) {
					if (event.altKey && special !== "alt") {
						modif += "alt+";
					}
					if (event.ctrlKey && special !== "ctrl") {
						modif += "ctrl+";
					}
					if (event.metaKey && !event.ctrlKey && special !== "meta") {
						modif += "meta+";
					}
					if (event.shiftKey && special !== "shift") {
						modif += "shift+";
					}
					if (special) {
						possible[ modif + special ] = true;
					} else {
						possible[ modif + character ] = true;
						possible[ modif + hotkeys.shiftNums[ character ] ] = true;
						if ( modif === "shift+" ) {
							possible[ hotkeys.shiftNums[ character ] ] = true;
						}
					}
					for (etype in handlers) {
						if (etype !== type) continue;
						var h = handlers.hotkey;
						for (fn in h) {
							if (!h[fn].handler.keys) continue;
							for (hotKey in h[fn].handler.keys) {
								if (possible[hotKey]) {
									if (type === 'keydown') {
										event.run73 = {
											keys : hotKey,
											property : h[fn].handler.keys[hotKey]
										};
										return h[fn].handler.call(el, event);
									}
								}
							}
						}
					}
				}
			}
			el = el.parentNode;
		}
	}
};
