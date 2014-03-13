
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
	sizes: {
		init: function() {
			jr(sys.el.assets_slider).bind('mousedown', this.doEvent);
			//jr(document).on('contextmenu', 'body, *[data-context]', sys.context.doEvent);
		},
		doEvent: function(event) {
			var _app = sys.app,
				_el  = sys.el,
				self = _app.assets,
				_size = self.sizes,
				srcEl = event.target,
				dim,
				left;
			switch(event.type) {
				case 'mousedown':
					event.preventDefault();
					
					if (srcEl.nodeName.toLowerCase() === 'figure') {
						_size.drag     = jr(srcEl).addClass('active');
						_size.clickX   = event.clientX;
						_size.dragLeft = srcEl.offsetLeft;
						_size.dragMax  = _size.drag.parent().width() - 10;
						_size.onchange = sys.shell.exec(srcEl.getAttribute('data-onchange'), true);
						_size.drag.parents('.assets').addClass('active');

						jr(document).bind('mouseup mousemove', _size.doEvent);
					} else {
						// slide track is clicked
						dim = getDim(srcEl);
						left = Math.max(Math.min(event.clientX - dim.l - 10, dim.w + 2), 0) - 2;
						jr(srcEl)
							.find('figure')
							.addClass('animate200')
							.css({'left': left +'px'})
							.wait(220, function() {
								this.removeClass('animate200');
							});
					}
					break;
				case 'mousemove':
					if (!_size.drag) return;
					left = event.clientX - _size.clickX + _size.dragLeft;
					left = Math.max(Math.min(left, _size.dragMax), 0);
					_size.drag.css({'left': (left - 2) +'px'});

					_size.onchange(parseInt((left / _size.dragMax) * 100, 10));
					break;
				case 'mouseup':
					_size.drag.parents('.assets').removeClass('active');
					_size.drag.removeClass('active');
					_size.drag = false;

					jr(document).unbind('mouseup mousemove', _size.doEvent);
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
	}
};
