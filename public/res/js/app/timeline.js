
sys.app.timeline = {
	init: function() {
		var _sys = sys,
			_jr = jr,
			el = _sys.el,
			observer = _sys.observer;

		observer.on('file_loaded', this.doEvent);
		observer.on('normalize_xml', this.doEvent);
		observer.on('file_unloaded', this.doEvent);
		observer.on('nob_speed', this.doEvent);
		//observer.on('assets_loaded', this.doEvent);
		observer.on('frame_index_change', this.doEvent);

		this.doEvent('populate_frame_nrs');
		//this.speed_events('focus');

		_jr(el.tl_content.parentNode).bind('mousedown', this.doEvent);

		_jr('.resize', el.box_timeline).bind('mousedown', this.doEvent);
		_jr('.right .body', el.box_timeline).bind('scroll', this.doEvent);
	},
	doEvent: function(event) {
		var _sys     = sys,
			_app     = _sys.app,
			_fs      = _sys.fs,
			_el      = _sys.el,
			_jr      = jr,
			_canvas  = _app.canvas,
			observer = _sys.observer,
			file     = _app.file,
			self     = _app.timeline,
			cmd      = (typeof(event) === 'string') ? event : event.type,
			mouseState = self.mouseState,

			frHeight = 23,
			frWidth = 16,
			top = -99,
			left = -99,
			width,
			height,
			wDiff,
			wMod,
			hDiff,
			hMod,
			selEl,

			dim,
			row,
			srcEl,
			target,
			track,
			i, il,
			j, jl,
			k, kl;
		switch (cmd) {
			// native events
			case 'mousedown':
				var prevEl,
					nextEl,
					prevX,
					nextX,
					trackR,
					trackMin,
					trackMax;
				srcEl  = event.target;
				target = _jr(srcEl);
				dim    = getDim(_el.tl_content.parentNode);
				selEl  = _jr(_el.frame_select);

				if (target.hasClass('resize')) {
					// timeline resize
					self.mouseState = {
						type   : 'resize',
						clickY : event.clientY,
						startH : target.parent().height(),
						minH   : 131,
						maxH   : 301,
						srcEl  : {
							timeline : target.parent(),
							canvas   : target.parent().prev('.canvas'),
							assets   : target.parent().prev('.assets')
						}
					};
				} else if (target.hasClass('track_parent')) {
					// track parent
					trackR = [];
					nextEl = target.parent().next().nth(0).find('.anim_track');
					for (i=0, il=nextEl.length; i<il; i++) {
						prevEl = _jr(nextEl[i]);
						trackR.push({
							el      : prevEl,
							offsetX : parseInt((prevEl.left() - target.left()) / frWidth, 10)
						});
					}
					nextX = _canvas.info.sequence.length - parseInt(target.width() / frWidth, 10) - 1;
					self.mouseState = {
						type    : 'ptrack',
						target  : target,
						targetX : target.left(),
						clickX  : event.clientX,
						maxX    : nextX,
						minX    : 0,
						trackR  : trackR
					};
				} else if (target.hasClass('anim_track')) {
					// anim track
					trackR = [];
					trackMin = [];
					trackMax = [];
					prevEl = target.prev();
					nextEl = target.next();
					prevX  = prevEl.length ? parseInt((prevEl.left() + prevEl.width()) / frWidth, 10) + 1 : 0;
					nextX  = nextEl.length ? parseInt((nextEl.left() - target.width()) / frWidth, 10)
								: _canvas.info.sequence.length - parseInt(target.width() / frWidth, 10) - 1;

					trackR = target.parents('ul').parent().prev('li').nth(0).find('.track_parent');
					//trackMin.push(parseInt(trackR.left() / frWidth, 10));
					//trackMax.push(parseInt(trackR.width() / frWidth, 10));

					nextEl = target.parents('ul').find('.anim_track');
					for (i=0, il=nextEl.length; i<il; i++) {
						if (nextEl[i] === srcEl) continue;
						prevEl = _jr(nextEl[i]);
						left = parseInt(prevEl.left() / frWidth, 10);
						width = parseInt(prevEl.width() / frWidth, 10);
						trackMin.push(left);
						trackMax.push(left + width);
					}
					//console.log( 'min', trackMin );
					//console.log( 'max', trackMax );

					self.mouseState = {
						type     : 'track',
						target   : target,
						targetX  : target.left(),
						targetW  : parseInt(target.width() / frWidth, 10),
						clickX   : event.clientX,
						maxX     : nextX,
						minX     : prevX,
						trackR   : trackR,
						trackMin : trackMin,
						trackMax : trackMax
					};
				} else if (target.hasClass('frame_select') || srcEl.nodeName.toLowerCase() === 'li') {
					// track row
					self.mouseState = {
						type   : 'row',
						clickX : event.clientX,
						clickY : event.clientY,
						startX : event.clientX - dim.l,
						startY : event.clientY - dim.t
					};
					top  = parseInt(self.mouseState.startY / frHeight, 10);
					left = parseInt(self.mouseState.startX / frWidth, 10);
					// TODO: constraint frame select to available rows
					
				}
				if (self.mouseState.type !== 'resize') {
					selEl.css({
						'top'   : (top * frHeight) +'px',
						'left'  : (left * frWidth) +'px',
						'width' : (frWidth - 1) +'px',
						'height': (frHeight - 1) +'px'
					});
				}
				if (self.mouseState.type) {
					self.mouseState.dim = dim;
					self.mouseState.selEl = selEl;
					_jr(document).bind('mousemove mouseup', self.doEvent);
				}
				break;
			case 'mousemove':
				if (!mouseState) return;
				switch (mouseState.type) {
					case 'resize':
						srcEl  = mouseState.srcEl,
						height = mouseState.startH + (mouseState.clickY - event.clientY);
						height = Math.max(Math.min(height, mouseState.maxH), mouseState.minH);

						srcEl.timeline.css({'height': height +'px'});
						srcEl.canvas.css({'bottom': (height + 22) +'px'});
						srcEl.assets.css({'bottom': (height + 22) +'px'});
						// trigger app resize for app-wide UI update
						observer.trigger('app.resize');
						break;
					case 'ptrack':
						trackR = mouseState.trackR;
						left = parseInt((mouseState.targetX + event.clientX - mouseState.clickX) / frWidth, 10);
						left = Math.max(Math.min(left, mouseState.maxX), mouseState.minX);
						mouseState.target.css({
							'left'  : (left * frWidth) +'px'
						});
						for (i=0, il=trackR.length; i<il; i++) {
							trackR[i].el.css({
								'left'  : ((trackR[i].offsetX + left) * frWidth) +'px'
							});
						}
						break;
					case 'track':
						trackR = mouseState.trackR;
						left = parseInt((mouseState.targetX + event.clientX - mouseState.clickX) / frWidth, 10);
						left = Math.max(Math.min(left, mouseState.maxX), mouseState.minX);
						mouseState.target.css({
							'left'  : (left * frWidth) +'px'
						});

						trackMin = mouseState.trackMin.concat([]);
						trackMin.push(left);
						trackMin.sortInt();

						trackMax = mouseState.trackMax.concat([]);
						trackMax.push(left + mouseState.targetW);
						trackMax.sortInt();

						left = trackMin[0];
						width = trackMax.pop() - left + 1;
						trackR.css({
						 	'left'  : (left * frWidth) +'px',
						 	'width' : ((width * frWidth)-1) +'px',
						});
						//console.log( left + width );
						break;
					case 'row':
						top    = parseInt(mouseState.startY / frHeight, 10);
						left   = parseInt(mouseState.startX / frWidth, 10);
						wDiff  = event.clientX - mouseState.clickX;
						hDiff  = event.clientY - mouseState.clickY;
						wMod   = wDiff % frWidth;
						hMod   = hDiff % frHeight > 0;
						width  = parseInt((wDiff - wMod) / frWidth, 10) + 1;
						height = parseInt(hDiff / frHeight, 10) + (hMod ? 1 : 0);
						
						height = Math.min(height, 3);

						if (width < 1) {
							left -= Math.abs(width)+1;
							width = Math.abs(width)+2;
						}
						if (height < 1) {
							height = Math.abs(height)+1;
							top   -= height-1;
						}
						mouseState.selEl.css({
							'top'   : (top * frHeight) +'px',
							'left'  : (left * frWidth) +'px',
							'width' : ((width * frWidth) - 1) +'px',
							'height': ((height * frHeight) - 1) +'px'
						});
						break;
				}
				break;
			case 'mouseup':
				self.mouseState = false;
				_jr(document).unbind('mousemove mouseup', self.doEvent);
				break;
			case 'scroll':
				target = event.toElement;
				_el.tl_body_cols.style.left = target.offsetLeft +'px';
				_el.tl_body_rows.style.top = target.offsetTop +'px';

				if (target.offsetTop === 0) {
					_el.tl_body_cols.classList.remove('vscrolled');
					_el.tl_body_cols_left.classList.remove('vscrolled');
				} else {
					_el.tl_body_cols.classList.add('vscrolled');
					_el.tl_body_cols_left.classList.add('vscrolled');
				}
				if (target.offsetLeft === 0) {
					_el.tl_body_rows_left.classList.remove('hscrolled');
				} else {
					_el.tl_body_rows_left.classList.add('hscrolled');
				}
				break;
			// custom events
			case 'frame_index_change':
				target = self.frameIndex;
				self.frameIndex = Math.floor(event.details.left / 16);
				if (target !== self.frameIndex) {
					_canvas.info.frameIndex = self.frameIndex;
					_canvas.updateBallCvs();
					_canvas.draw();
				}
				break;
			case 'normalize_xml':
				var xLayer = file.selectNodes('//timeline/layer'),
					xBrush,
					xAnim,
					len = [],
					lStart,
					lEnd,
					bStart = false,
					bEnd = false,
					arr;
				i = 0;
				il = xLayer.length;

				for (; i<il; i++) {
					xBrush = xLayer[i].selectNodes('./brush');
					lStart = [];
					lEnd = [];
					for (j=0, jl=xBrush.length; j<jl; j++) {
						arr = JSON.parse( xBrush[j].getAttribute('value') );
						for (k=0, kl = arr.length; k<kl; k++) {
							if (arr[k] !== 0) {
								lStart.push(k);
								break;
							}
						}
						for (k=0; k<kl; k++) {
							if (arr[kl-k-1] !== 0) {
								lEnd.push(kl-k);
								break;
							}
						}
						lStart.sortInt();
						lEnd.sortInt();
						len.push(lEnd[lEnd.length-1]-lStart[0]);
						// brush parent
						xBrush[j].parentNode.setAttribute('start', lStart[0]);
						xBrush[j].parentNode.setAttribute('length', len[len.length-1]);
					}
					// prepare animation tracks
					for (j=0, jl=xBrush.length; j<jl; j++) {
						arr = JSON.parse( xBrush[j].getAttribute('value') );
						for (k=0, kl=arr.length; k<kl; k++) {
							if (arr[k]) {
								bStart = k;
								while(arr[k] !== 0) {
									if (k>kl-1) break;
									k++;
								}
								xAnim = xBrush[j].appendChild(_fs.createNode('i'));
								xAnim.setAttribute('start', bStart-lStart[0]);
								xAnim.setAttribute('length', k-bStart);
							}
						}
					}
				}
				// TODO: set timeline length
				len.sortInt();
				xLayer[0].parentNode.setAttribute('length', len[len.length-1]);
				break;
			case 'file_loaded':
				var xTimeline = file.selectSingleNode('.//timeline');

				// update timeline speed nob
				self.doEvent('nob_speed', +_app.fileMeta('speed') || 50);

				_jr(_el.frame_ends).css({'left': (xTimeline.getAttribute('length') * 16) +'px'});

				// rendreing left
				_jr(_el.tl_body_rows).html( transform({
						match: '//file',
						template: 'timeline_left'
					}).xml );

				// rendreing right
				_jr(_el.tl_content).html( transform({
						match: '//file',
						template: 'timeline_right'
					}).xml );

				// temp
				self.doEvent('toggle_layer', jr('.icon-arrow_down:nth(0)')[0]);
				break;
			case 'file_unloaded':
				// reset timeline
				_jr(_el.tl_body_rows).html('');
				_jr(_el.tl_content).html('');
				_jr(_el.frame_ends).css({'left': '9999px'});
				self.doEvent('goto_frame', 0);
				self.doEvent('nob_speed', 50);
				break;
			case 'add_track':
				break;
			case 'delete_track':
				target = arguments[1];
				if (!target) {
					// command executed from contextmenu
					row = self.doEvent('get_track_row', _sys.context.info.el);
					target = row.leftEl.find('.icon-eye_on, .icon-eye_off')[0];
				}
				fn = function() {
					var row = self.doEvent('get_track_row', target);
					
					if (row.leftEl.attr('data-context') === 'tl_track') {
						row.leftEl.next('li').nth(0).css({'height': '0px'})
							.wait(300, function() {
								this.remove();
							});
						row.rightEl.next('li').nth(0).css({'height': '0px'})
							.wait(300, function() {
								this.remove();
							});
					} else {
						track = row.leftEl.parent('.brushes').parent();
						track.css({'height': (track.height() - 23) +'px'});
						track = row.rightEl.parent('.brush_tracks').parent();
						track.css({'height': (track.height() - 23) +'px'});
					}

					row.leftEl.css({'height': '0px'})
						.wait(300, function() {
							this.remove();
						});
					row.rightEl.css({'height': '0px'})
						.wait(300, function() {
							this.remove();
						});

					//_canvas.doEvent('remove_track', 0);
				};
				// temp
				//return fn();
				// confirm track deletion
				sys.confirm({
					'text': 'Are you sure that you want to delete this track?',
					'buttons': {
						'Cancel': function() {},
						'OK': fn
					}
				});
				break;
			case 'toggle_visible':
				target = arguments[1];
				if (!target) {
					// command executed from contextmenu
					row = self.doEvent('get_track_row', _sys.context.info.el);
					target = row.leftEl.find('.icon-eye_on, .icon-eye_off')[0];
				}
				var iconEl = _jr(target),
					isOn = iconEl.hasClass('icon-eye_on'),
					childCheck = true,
					siblings,
					isAllOff;

				row = self.doEvent('get_track_row', target);

				if (isOn) {
					row.rightEl.addClass('is_hidden');
					row.leftEl.addClass('is_hidden');
					iconEl.removeClass('icon-eye_on').addClass('icon-eye_off');
					isAllOff = true;
				} else {
					row.rightEl.removeClass('is_hidden');
					row.leftEl.removeClass('is_hidden');
					iconEl.removeClass('icon-eye_off').addClass('icon-eye_on');
					isAllOff = false;
				}

				if (row.leftEl.attr('data-context') === 'tl_track') {
					siblings = row.leftEl.next('li').nth(0).find('li')
						[isOn ? 'addClass' : 'removeClass']('is_hidden');

					siblings.find('.icon-eye_on, .icon-eye_off')
							.setClass( isOn ? 'icon-eye_off' : 'icon-eye_on' );

					row.rightEl.next('li').nth(0).find('li').addClass('is_hidden')
						[isOn ? 'addClass' : 'removeClass']('is_hidden');
				} else {
					siblings = row.leftEl.parent().find('li');
					isAllOff = siblings.length === siblings.find('.icon-eye_off').length;
					row.rightEl.parents('.brush_tracks').parent().prev('li').nth(0)
						[isAllOff ? 'addClass' : 'removeClass']('is_hidden');
					childCheck = row.leftEl.parents('.brushes').parent().prev('li').nth(0);
					childCheck[isAllOff ? 'addClass' : 'removeClass']('is_hidden');
					childCheck.nth(0).find('.icon-eye_on, .icon-eye_off')
						.setClass( isAllOff ? 'icon-eye_off' : 'icon-eye_on' );
				}

				_canvas.info.visible = self.doEvent('get_track_visible');
				//console.log( _canvas.info.visible );
				_canvas.updateBallCvs();
				_canvas.draw();
				break;
			case 'get_track_visible':
				var rows = _jr('li[data-track_id]', _el.tl_body_rows),
					jl = rows.length,
					j = 0,
					rVisible = [];
				for (; j<jl; j++) {
					if (rows[j].getAttribute('data-context') === 'tl_track') continue;
					rVisible.push( _jr(rows[j]).hasClass('is_hidden') ? 0 : 1 );
				}
				return rVisible;
			case 'get_track_palette':
				var tracks = _jr('.brush_tracks .anim_track', _el.tl_content),
					palette = [],
					il = tracks.length,
					i = 0,
					color,
					p;
				for (; i<il; i++) {
					color = getStyle(tracks[i], 'backgroundColor');
					p = color.match(/\d{1,}/g);
					palette.push({
						color: color,
						trans: 'rgba('+ p[0] +','+ p[1] +','+ p[2] +',0.65)'
					});
				}
				return palette;
			case 'goto_frame':
				_el.frame_nob.style.left = ((arguments[1] * 16)-1) +'px';

				// reset scaling, origo, etc ?
				_canvas.updateBallCvs();
				_canvas.draw();
				break;
			case 'populate_frame_nrs':
				var len = 70,
					str = '<div>&#160;</div>';
				for (var i=1; i<len; i++) {
					str += '<div>'+ i +'0</div>';
				}
				_jr(_el.frame_nrs)
					.html(str)
					.css({'width': (len * 160) +'px'});
				break;
			case 'nob_speed':
				var details = event.details,
					nobText = details ? details.srcElement : _el.speed_level,
					nobVal = details ? details.value : arguments[1];
				nobText.textContent = nobVal || 0;

				if (!details) {
					_el.nob_speed.setAttribute('data-value', nobVal);
					_sys.nobs.draw(_el.nob_speed);
				}
				break;
			case 'dblclick_layer':
				target = _jr(arguments[1]).find('figure:nth(1)')[0];
				return self.doEvent('toggle_layer', target);
			case 'toggle_layer':
				if (arguments.length > 1) {
					srcEl = arguments[1];
				} else {
					row = self.doEvent('get_track_row', _sys.context.info.el);
					srcEl = row.leftEl.find('[data-cmd="timeline -s toggle_layer"]')[0];
					//return console.log( row );
				}
				var arrow   = jr(srcEl),
					lRow    = arrow.parents('li').next('li').nth(0),
					rowId   = arrow.parent().attr('data-track_id'),
					tRow    = _jr('li[data-track_id="'+ rowId +'"]', _el.tl_content).next('li').nth(0),
					cHeight = lRow.find('.brushes').height();

				if (arrow.hasClass('icon-arrow_down')) {
					arrow.removeClass('icon-arrow_down')
						.addClass('icon-arrow_up')
						.parent().addClass('expanded');
					lRow.css({'border': '', 'height': (lRow.height() + cHeight + 1) +'px'});
					tRow.css({'border': '', 'height': (cHeight + 1) +'px'})
						.wait(400, function() {
							this.parents('.body').trigger('calculate');
						});
				} else{
					arrow.removeClass('icon-arrow_up')
						.addClass('icon-arrow_down');
					lRow.css({'height': '0'}).wait(400, function() {
						this.css({'border': '0'});
						arrow.parent().removeClass('expanded');
					});
					tRow.css({'height': '0'}).wait(400, function() {
						this.css({'border': '0'});

						top = _el.tl_body_rows.parentNode.offsetHeight - _el.tl_body_rows.offsetHeight - 5;
						if (top > 0) return;
						jr(_el.tl_body_rows).css({'top': top +'px'});
						this.parents('.body').css({'top': top +'px'});
					});
				}
				break;
			case 'get_track_row':
				var row = {},
					srcEl = arguments[1],
					trackEl = _jr(srcEl),
					trackId;

				if (trackEl.attr('data-track') === 'parent') {
					trackEl = trackEl.find('div[data-track_id]:nth(0)');
				}
				if (trackEl.attr('data-track_id') === null) {
					trackEl = trackEl.parents('[data-track_id]');
				}
				trackId = trackEl.attr('data-track_id');
				row.hoverEl = trackEl;
				if (trackEl.parents('ul.body').length) {
					// source element is on the right side
					row.leftEl = _jr('[data-track_id='+ trackId +']', _el.tl_body_rows);
					row.rightEl = trackEl;
				} else {
					// source element is on the left side
					row.rightEl = _jr('[data-track_id='+ trackId +']', _el.tl_content);
					row.leftEl = trackEl;
				}
				return row;
			case 'make_track_active':
				var ev = arguments[2];
				
				row = self.doEvent('get_track_row', ev.target);
				
				row.rightEl.parents('.tl_body').find('.active').removeClass('active');
				row.leftEl.parents('.tl_body').find('.active').removeClass('active');
				
				row.rightEl.addClass('active');
				row.leftEl.addClass('active');
				break;
			case 'change_track_color':
				var newColor = arguments[1],
					oldColor,
					animTrack;

				row = self.doEvent('get_track_row', _sys.context.info.el);
				animTrack = row.rightEl.find('.anim_track');
				oldColor = animTrack.matchClass('color_');
				// change track color
				animTrack.removeClass(oldColor).addClass('color_'+ newColor);

				_canvas.info.palette = _app.timeline.doEvent('get_track_palette');
				_canvas.updateBallCvs();
				_canvas.draw();
				break;
			case 'anim_play':
				break;
			case 'go_start':
				self.doEvent('goto_frame', 0);
				break;
			case 'go_end':
				target = _canvas.info.sequence.length-1;
				self.doEvent('goto_frame', target);
				break;
		}
	},
	speed_events: function(type) {
		var _sys = sys,
			_jr  = jr,
			el   = _sys.el,
			dim,
			bottom;

		switch (type) {
			case 'focus':
				dim    = getDim(_sys.app.el.speed_level);
				bottom = _sys.appwin.height - dim.t - dim.h - 96;

				_jr(el.speed_level.parentNode).addClass('focused');
				_jr(el.anim_speed)
					.css({
						'display': 'block',
						'bottom' : bottom +'px'
					})
					.wait(1, function() {
						this.addClass('active');
					});
				break;
			case 'blur':
				_jr(el.speed_level.parentNode).removeClass('focused');
				_jr(el.anim_speed)
					.removeClass('active')
					.wait(320, function() {
						this.css({'display': 'none'});
					});
				break;
		}
	}
};
