
sys.popup = {
	init: function() {
		sys.alert = this.alert;
	},
	dispose: function() {},
	alert: function(msg) {
		var message = sys.language.getPhrase.apply(null, arguments) || msg;
		sys.popup.multi({text: message});
	},
	multi: function(obj) {
		var els = sys.app.el,
			dlgType = obj.type || 'alert';
		jr(els.multi_title).html(obj.title || sys.language.getPhrase('app_says'));
		jr(els.multi_text).html(obj.text);

		jr(els.layout).addClass('blur');
		jr(els.app_cover).removeClass('hideMe');
		jr(els.multi).css({'display': 'block'}).removeClass('hideMe').addClass(dlgType);

		this.active = els.multi;
		this.activeObject = obj;
	},
	open: function(name) {
		var els = sys.app.el,
			file = sys.fs,
			active = els[name];

		jr(els.layout).addClass('blur');
		jr(els.app_cover).removeClass('hideMe');
		jr(active).css({'display': 'block'}).wait(1, function() {
			this.removeClass('hideMe');
		});

		this.active = active;
	},
	close: function(callback) {
		var els = sys.app.el;
		
		jr(els.layout).removeClass('blur');
		jr(els.app_cover).addClass('hideMe');
		jr(this.active).addClass('hideMe').wait(320, function() {
			this.css({'display': 'none'}).removeClass('about alert confirm');
			if (typeof(callback) === 'function') {
				callback();
			}
		});
	},
	btnClick: function(type) {
		var obj = this.activeObject;
		switch(type) {
			case 'ok':
				if (obj && typeof(obj.onOK) === 'function') {
					obj.onOK.apply(obj);
				}
				break;
			case 'cancel':
				if (obj && typeof(obj.onCancel) === 'function') {
					obj.onOK.apply(obj);
				}
				break;
		}
		this.close();
	}
};