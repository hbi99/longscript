
sys.bank = {
	guid: 0,
	vault: {},
	init: function() {
		
	},
	dispose: function() {
		
	},
	flushAll: function(el) {
		if (!el) return;
		var id = el[sys.id];
		delete this.vault[id];
		delete el[sys.id];
	},
	empty: function(el, name) {
		var id = el[sys.id],
			safe = this.vault[id],
			content = safe ? safe[name] : el.dataset[name] ;
		if (safe) {
			delete safe[name];
		}
		el.removeAttribute('data-'+ name);
		return content;
	},
	balance: function(el, name) {
		var id = el[sys.id],
			safe = this.vault[id];
		return safe ? safe[name] : el.dataset[name] ;
	},
	deposit: function(el, name, value) {
		var id = el[sys.id] = el[sys.id] || ++this.guid,
			safe = this.vault[id] = this.vault[id] || {};

		if (typeof(name) === 'object') {
			sys.extend(safe, name);
		} else {
			safe[name] = value;
		}
	}
};
