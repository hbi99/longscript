
sys.app.assets = {
	active: false,
	init: function() {
		var _sys = sys,
			observer = _sys.observer;

		observer.on('file_loaded', this.doEvent);
		observer.on('file_unloaded', this.doEvent);
		observer.on('assets_size', this.doEvent);
		//observer.on('type_change', this.doEvent);
		//observer.on('font_loaded', this.doEvent);
		//observer.on('image_loaded', this.doEvent);
	},
	doEvent: function(event) {
		var _sys = sys,
			_app = _sys.app,
			_el  = _sys.el,
			_jr  = jr,
			self = _app.assets;
		switch(event.type) {
			// native events
			case 'click':
				jr(this.parentNode).find('.active').removeClass('active');
				jr(this).addClass('active');
				self.active = jr(this);
				self.activeLetter = self.active.html();
				sys.observer.trigger('active_letter', self);
				break;
			// custom events
			case 'assets_size':
				// TODO
				break;
			case 'file_loaded':
				var modeClass = (_app.type === 'font')? 'glyphs' : 'assets',
					box_title = _sys.language.getPhrase(modeClass),
					content;
				if (_app.type === 'font') {
					content = _app.font.fillChars();
				} else {
					content = transform({
						match: '//file',
						template: 'assets'
					}).xml;
				}
				// set asset box title
				_jr('.title', _el.box_assets).html(box_title);

				// Junior's html-method triggers scrollbar calculations
				_jr(_el.assetsList)
					.html(content)
					.removeClass('glyphs assets')
					.addClass(modeClass);
				
				_sys.observer.trigger('load_assets');
				break;
			case 'file_unloaded':
				_jr('.title', _el.box_assets).html('');
				_jr(_el.assetsList).html('');
				_sys.observer.trigger('unload_assets');
				break;
//			case 'font_loaded':
//				_el.assetsList.style.fontFamily = _app.font.info.family;
//				self.active.trigger('click');
//				break;
//			case 'mode_change':
//				var type = _app.type === 'font' ? 'glyphs' : 'assets',
//					box_title = _sys.language.getPhrase( type );
//				
//				jr('.title', _el.box_assets)
//					.html( box_title );
//
//				jr('.body', _el.box_assets)
//					.removeClass('glyphs assets')
//					.addClass(type);
//				break;
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
