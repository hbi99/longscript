
sys.scrollbar = {
	init: function() {
		//this.sb = jr('.scroll_bg');
		//console.log( this.sb );

		jr(document).on('mousedown', '.scroll_bg', this.doEvent);
		jr(document).on('mousewheel', '.content', this.doEvent);
	},
	dispose: function() {

	},
	doEvent: function(event) {
		var _scroll = sys.scrollbar,
			srcEl   = event.target,
			sEl     = jr(srcEl),
			cCss    = {},
			oCss    = {},
			content = {},
			isVertical,
			trkEl,
			hndlEl,
			srcDim,
			val;
		switch(event.type) {
			case 'mousewheel':
				var bEl    = jr(this).find('.body'),
					sEl    = bEl.parent(),
					trkEl  = sEl.find('.scroll_bg'),
					hndlEl = trkEl.find('.scroll_bar'),
					delta  = ((event.wheelDelta? event.wheelDelta / 40 : event.detail) * 10) * -1,
					val    = Math.min(Math.max(bEl[0].offsetTop - delta, this.offsetHeight - bEl[0].offsetHeight), 0);
				
				bEl.css({'top': val +'px'});
				break;
			case 'mousedown':
				event.preventDefault();
				
				if (sEl.hasClass('scroll_bar')) {
					trkEl = sEl.parent().addClass('active');
					isVertical =
					_scroll.isVertical = trkEl.hasClass('vertical');
					content.el   = trkEl.parent('.panel').find('.content .body');
					content.bh   = content.el[0][ isVertical ? 'offsetHeight' : 'offsetWidth' ];
					content.hMax = content.el.parent()[0][ isVertical ? 'offsetHeight' : 'offsetWidth' ] - content.bh;

					_scroll.content = content;
					_scroll.drag    = sEl;
					_scroll.prop    = isVertical ? 'top' : 'left';
					_scroll.clickV  = isVertical ? 'clientY' : 'clientX';
					_scroll.click   = event[_scroll.clickV];
					_scroll.dragVal = srcEl[ isVertical ? 'offsetTop' : 'offsetLeft' ];
					_scroll.dragMax = trkEl[ isVertical ? 'height' : 'width' ]() - srcEl[ isVertical ? 'offsetHeight' : 'offsetWidth' ] - 6;

					jr(document).bind('mouseup mousemove', _scroll.doEvent);
				} else {
					// scroll track is clicked
					hndlEl      = sEl.find('.scroll_bar');
					isVertical  = sEl.hasClass('vertical');
					content.el  = sEl.parent('.panel').find('.content .body');
					content.bh  = content.el[0][ isVertical ? 'offsetHeight' : 'offsetWidth' ];
					content.oh  = content.el.parent()[0][ isVertical ? 'offsetHeight' : 'offsetWidth' ];
					if ( content.bh <= content.oh ) return;
					srcDim      = getDim(sEl[0]);
					hndlSize    = hndlEl[0][ isVertical ? 'offsetHeight' : 'offsetWidth' ];
					_scroll.clickV  = isVertical ? 'clientY' : 'clientX';
					_scroll.click   = event[_scroll.clickV];
					_scroll.prop    = isVertical ? 'top' : 'left';
					_scroll.dragMax = sEl[ isVertical ? 'height' : 'width' ]() - hndlSize - 12;

					val = _scroll.click - srcDim[ isVertical ? 't' : 'l' ] - (hndlSize / 2);
					val = Math.max(Math.min(val, _scroll.dragMax), 0);

					oCss[_scroll.prop] = (val + 6) +'px';
					cCss[_scroll.prop] = ((val / _scroll.dragMax) * (content.oh - content.bh)) +'px';

					content.el
						.addClass('animate300')
						.css(cCss)
						.wait(320, function() {
							this.removeClass('animate300');
						});

					hndlEl
						.addClass('animate300')
						.css(oCss)
						.wait(320, function() {
							this.removeClass('animate300');
						});
				}
				break;
			case 'mousemove':
				if (!_scroll.drag) return;
				val = event[_scroll.clickV] - _scroll.click + _scroll.dragVal;
				val = Math.max(Math.min(val, _scroll.dragMax), 6);

				oCss[_scroll.prop] = val +'px';
				cCss[_scroll.prop] = ((val / _scroll.dragMax) * _scroll.content.hMax) +'px';
				
				_scroll.drag.css(oCss);
				_scroll.content.el.css(cCss);
				break;
			case 'mouseup':
				_scroll.drag.parent().removeClass('active');
				_scroll.drag = false;

				jr(document).unbind('mouseup mousemove', _scroll.doEvent);
				break;
		}
	}
};
