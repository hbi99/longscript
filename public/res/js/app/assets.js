
sys.app.assets = {
	active: false,
	init: function() {
		sys.observer.on('mode_change', this.doEvent);
		sys.observer.on('font_loaded', this.doEvent);
		sys.observer.on('image_loaded', this.doEvent);
	},
	doEvent: function(event) {
		var _sys = sys,
			_app = _sys.app,
			_el  = _sys.el,
			self = _app.assets;
		switch(event.type) {
			case 'click':
				jr(this.parentNode).find('.active').removeClass('active');
				jr(this).addClass('active');
				self.active = jr(this);
				self.activeLetter = self.active.html();
				sys.observer.trigger('active_letter', self);
				break;
			case 'mode_change':
				var mode = _app.mode === 'font' ? 'glyphs' : 'assets',
					box_title = _sys.language.getPhrase( mode );
				
				jr('.title', _el.box_assets)
					.html( box_title );

				jr('.body', _el.box_assets)
					.removeClass('glyphs assets')
					.addClass(mode);
				break;
			case 'font_loaded':
				_el.assetsList.style.fontFamily = _app.font.info.family;
				self.active.trigger('click');
				break;
			case 'font_loaded':
				break;
		}
	},
	changeSize: function(step) {
		var min = 15,
			max = 37,
			fs  = min + ((max - min) * (step / 100)),
			lh = fs * 2.3;
		jr(sys.el.assetsList)
			.css({
				'fontSize': fs +'px',
				'linHeight': lh +'px'
			});
	}
};
