
sys.popup = {
	init: function() {
		sys.alert = this.alert;
		sys.confirm = this.confirm;
	},
	dispose: function() {},
	alert: function(msg) {
		var message = sys.language.getPhrase.apply(null, arguments) || msg;
		sys.popup.multi({text: message});
	},
	confirm: function(obj) {
		obj.type = 'confirm';
		sys.popup.multi(obj);	
	},
	multi: function(obj) {
		var _jr = jr,
			els = sys.app.el,
			dlgType = obj.type || 'alert',
			btn,
			btnCount = 1;

		if (!obj.context) {
			obj.context = this;
		}

		_jr(els.multi_title).html(obj.title || sys.language.getPhrase('app_says'));
		_jr(els.multi_text).html(obj.text);

		for (btn in obj.buttons) {
			if (btnCount > 2) break;
			_jr('.btn-0'+ btnCount, els.multi).html(btn);
			btnCount++;
		}

		_jr(els.layout).addClass('blur');
		_jr(els.app_cover).removeClass('hideMe');
		_jr(els.multi).css({'display': 'block'}).addClass(dlgType).wait(1, function() {
			this.addClass('active');
		});

		this.active = els.multi;
		this.activeObject = obj;
	},
	open: function(name) {
		var els = sys.app.el,
			active = els[name];

		jr(els.layout).addClass('blur');
		jr(els.app_cover).removeClass('hideMe');
		jr(active).css({'display': 'block'}).wait(1, function() {
			this.addClass('active');
		});

		this.active = active;
	},
	close: function(callback) {
		var self = sys.popup,
			els = sys.app.el;
		
		jr(els.layout).removeClass('blur');
		jr(els.app_cover).addClass('hideMe');
		jr(this.active).removeClass('active').wait(320, function() {
			this.css({'display': 'none'}).removeClass('about alert confirm');
			if (typeof(callback) === 'function') {
				callback();
				self.activeObject = false;
			}
		});
	},
	btnClick: function(type, btnEl, event) {
		var obj = this.activeObject,
			text = btnEl.innerHTML;
		if (obj && typeof(obj.buttons[text]) === 'function') {
			obj.buttons[text].apply(obj.context);
		}
		this.close();
	}
};