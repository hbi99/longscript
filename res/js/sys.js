
// empty require cache
require('module')._cache = {};

(function(root, document) {
    'use strict';

	var sys = {
		isMac: /Mac/.test(navigator.userAgent),
		init: function() {
			var gui = require('nw.gui');
			this.appwin = gui.Window.get();
			//this.appwin.on('close', this.quit);
			// initate it all
			for (var name in this) {
				if (name === 'app') continue;
				if (typeof(this[name].init) === 'function') this[name].init(this);
			}
			this.app.init();
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
		quit: function() {
			window.close();
		},
		reload: function() {
			document.location.reload();
		},
		toggle_dev: function() {
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
