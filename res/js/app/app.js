
sys.app = {
	init: function() {
		// initate app
		for (var n in this) {
			if (typeof(this[n].init) === 'function') this[n].init(this);
		}
	}
};
