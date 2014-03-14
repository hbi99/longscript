
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
			var _sys = sys,
				_app = _sys.app,
				self = _app.assets,
				size = self.sizes,
				target = event.target,
				dim,
				left;
			switch(event.type) {
				case 'mousedown':
					event.preventDefault();
					
					if (target.nodeName.toLowerCase() === 'figure') {
						size.drag     = jr(target).addClass('active');
						size.clickX   = event.clientX;
						size.dragLeft = target.offsetLeft;
						size.dragMax  = size.drag.parent().width() - 10;
						size.onchange = _sys.shell.exec(target.getAttribute('data-onchange'), true);
						size.drag.parents('.assets').addClass('active');

						jr(document).bind('mouseup mousemove', size.doEvent);
					} else {
						// slide track is clicked
						dim = getDim(target);
						left = Math.max(Math.min(event.clientX - dim.l - 10, dim.w + 2), 0) - 2;
						jr(target)
							.find('figure')
							.addClass('animate200')
							.css({'left': left +'px'})
							.wait(220, function() {
								this.removeClass('animate200');
							});
					}
					break;
				case 'mousemove':
					if (!size.drag) return;
					left = event.clientX - size.clickX + size.dragLeft;
					left = Math.max(Math.min(left, size.dragMax), 0);
					size.drag.css({'left': (left - 2) +'px'});

					size.onchange(parseInt((left / size.dragMax) * 100, 10));
					break;
				case 'mouseup':
					size.drag.parents('.assets').removeClass('active');
					size.drag.removeClass('active');
					size.drag = false;

					jr(document).unbind('mouseup mousemove', size.doEvent);
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
