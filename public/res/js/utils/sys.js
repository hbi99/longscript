
// empty require cache
require('module')._cache = {};

(function(root, document) {
    'use strict';

	var sys = {
		el: {},
		isMac: /Mac/.test(navigator.userAgent),
		init: function() {
			var gui = require('nw.gui');
			this.appwin = gui.Window.get();
			//this.appwin.on('close', this.quit);

			// initiate observer
			this.observer = observer();
			this.id = 'run73'+ (+new Date());

			// collection for fast access
			var el = this.el,
				appEls = jr('*[data-el]');
			for (var i=0, il=appEls.length; i<il; i++) {
				el[ appEls[i].getAttribute('data-el') ] = appEls[i];
			}
			// initate it all
			for (var name in this) {
				if (name === 'app') continue;
				if (typeof(this[name].init) === 'function') this[name].init(this);
			}

			this.app.init();
			//this.toggle_dev();

			jr(window).bind('resize', this.doEvent);
		},
		// stuff to do 'onclose'
		dispose: function() {
			// trigger dispose all over
			for (var n in sys) {
				if (typeof( sys[n].dispose ) === 'function') {
					sys[n].dispose();
				}
			}
			setTimeout(function() {sys = false;},0);
		},
		doEvent: function(event) {
			var _sys = sys,
				el   = _sys.el,
				cmd  = (typeof(event) === 'string')? event : event.type;
			switch (cmd) {
				case 'toggle_hotzones':
					if (el.layout.className.indexOf('show_hotzones') > -1) {
						el.layout.classList.remove('show_hotzones');
					} else {
						el.layout.classList.add('show_hotzones');
					}
					break;
				case 'resize':
					_sys.observer.trigger('app.resize', {
						target : this,
						width  : this.innerWidth,
						height : this.innerHeight
					});
					break;
			}
		},
		quit: function() {
			window.close();
		},
		reload: function() {
			document.location.reload();
		},
		toggleDev: function() {
			this.appwin.showDevTools();
		},
		extend: function(safe, deposit) {
			var content;
			for (content in deposit) {
				if (!safe[content] || typeof(deposit[content]) !== 'object') {
					safe[content] = deposit[content];
				} else {
					this.extend(safe[content], deposit[content]);
				}
			}
			return safe;
		}
	};

	/***  INIT SYSTEM  ***/
	document.addEventListener('DOMContentLoaded', function() {
		sys.init();
	}, false);

	root.sys = sys;

})(window, document);
