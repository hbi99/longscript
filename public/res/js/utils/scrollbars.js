
sys.scrollbar = {
	init: function() {
		//this.sb = jr('.scroll_bg');
		//console.log( this.sb );

		jr(document).on('mousedown', '.scroll_bg', this.doEvent);
		jr(document).on('mousewheel', '.content', this.doEvent);
		jr('.content .body').bind('calculate', this.doEvent);
	},
	dispose: function() {

	},
	doEvent: function(event) {
		var _scroll = sys.scrollbar,
			srcEl   = event.target,
			sEl     = jr(srcEl),
			cCss    = {},
			hCss    = {},
			vCss    = {},
			content = {},
			isVertical,
			trkEl,
			hndlEl,
			srcDim,
			val;
		switch(event.type) {
			case 'calculate':
				// calculate scrollbar
				var tEl     = jr(this),
					panel   = tEl.parents('.panel'),
					vTrack  = panel.find('.scroll_bg.vertical'),
					hTrack  = panel.find('.scroll_bg.horizontal'),
					vHandle = vTrack.find('.scroll_bar'),
					hHandle = hTrack.find('.scroll_bar');

				vCss.height = ((this.parentNode.offsetHeight / this.offsetHeight) * (vTrack[0].offsetHeight)) +'px';
				vCss.top = (((this.offsetTop / (this.parentNode.offsetHeight - this.offsetHeight - 12)) * (vTrack[0].offsetHeight - vHandle[0].offsetHeight)) + 6) +'px';

				vHandle.css(vCss);
				break;
			case 'mousewheel':
				var bEl     = jr(this).find('.body'),
					pEl     = bEl.parents('.panel'),
					vTrkEl  = pEl.find('.scroll_bg.vertical'),
					hTrkEl  = pEl.find('.scroll_bg.horizontal'),
					vHndlEl = vTrkEl.find('.scroll_bar'),
					hHndlEl = hTrkEl.find('.scroll_bar'),
					deltaY  = ((event.wheelDeltaY / 40) * 10) * -1,
					deltaX  = ((event.wheelDeltaX / 40) * 10) * -1,
					valY    = (bEl.length) ? bEl[0].offsetTop - deltaY : 0,
					valX    = (bEl.length) ? bEl[0].offsetLeft - deltaX : 0,
					valYMax = (valY) ? this.offsetHeight - bEl[0].offsetHeight : 0,
					valXMax = (valY) ? this.offsetWidth - bEl[0].offsetWidth : 0;
				
				cCss = {
					top: Math.min(Math.max(valY, valYMax), 0) +'px',
					left: Math.min(Math.max(valX, valXMax), 0) +'px'
				};
				bEl.css(cCss);
				vHndlEl.css({
					top: (((parseInt(cCss.top, 10) / valYMax) * (vTrkEl.height() - vHndlEl.height() - 12)) + 6) +'px'
				});
				hHndlEl.css({
					left: (((parseInt(cCss.left, 10) / valXMax) * (vTrkEl.width() - vHndlEl.width() - 12)) + 6) +'px'
				});
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
					_scroll.click   = event[_scroll.clickV] + 6;
					_scroll.dragVal = srcEl[ isVertical ? 'offsetTop' : 'offsetLeft' ];
					_scroll.dragMax = trkEl[ isVertical ? 'height' : 'width' ]() - srcEl[ isVertical ? 'offsetHeight' : 'offsetWidth' ] - 12;

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

					hCss[_scroll.prop] = (val + 6) +'px';
					cCss[_scroll.prop] = ((val / _scroll.dragMax) * (content.oh - content.bh)) +'px';

					content.el
						.addClass('animate300')
						.css(cCss)
						.wait(320, function() {
							this.removeClass('animate300');
						});

					hndlEl
						.addClass('animate300')
						.css(hCss)
						.wait(320, function() {
							this.removeClass('animate300');
						});
				}
				break;
			case 'mousemove':
				if (!_scroll.drag) return;
				val = event[_scroll.clickV] - _scroll.click + _scroll.dragVal;
				val = Math.max(Math.min(val, _scroll.dragMax), 0);

				hCss[_scroll.prop] = (val + 6) +'px';
				cCss[_scroll.prop] = ((val / _scroll.dragMax) * _scroll.content.hMax) +'px';
				
				_scroll.drag.css(hCss);
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