
sys.app.timeline = {
	init: function() {
		var _sys = sys,
			el = _sys.el,
			observer = _sys.observer;

		observer.on('file_loaded', this.doEvent);
		observer.on('file_unloaded', this.doEvent);
		observer.on('nob_speed', this.doEvent);
		observer.on('assets_loaded', this.doEvent);
		observer.on('frame_index_change', this.doEvent);

		this.doEvent('populate_frame_nrs');
		//this.speed_events('focus');

		jr('.right .body', el.box_timeline).bind('scroll', this.doEvent);
	},
	doEvent: function(event) {
		var _sys = sys,
			_app = _sys.app,
			_el  = _sys.el,
			_jr  = jr,
			_canvas = _app.canvas,
			file = _app.file,
			self = _app.timeline,
			cmd  = (typeof(event) === 'string') ? event : event.type,
			row,
			target;
		switch (cmd) {
			// native events
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
			case 'file_loaded':
				//return;
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
			case 'toggle_visible':
				var iconEl  = jr(arguments[1]),
					isOn    = iconEl.hasClass('icon-eye_on'),
					rowEl   = iconEl.parents('[data-track_id]'),
					rowId   = rowEl.attr('data-track_id'),
					trackEl = _jr('div[data-track_id='+ rowId +']', _el.tl_content),
					childCheck = true,
					siblLen,
					isAllOff;
				if (rowEl.parent().attr('data-track') === 'parent') {
					iconEl = rowEl.parent().find('.icon-eye_on, .icon-eye_off');
					trackEl = _jr('div[data-track_id='+ rowId +']', _el.tl_content).parent().find('.anim_track');
					childCheck = false;
				}
				if (isOn) {
					trackEl.addClass('is_hidden');
					iconEl.parent().addClass('is_hidden');
					iconEl.removeClass('icon-eye_on').addClass('icon-eye_off');
				} else {
					trackEl.removeClass('is_hidden');
					iconEl.parent().removeClass('is_hidden');
					iconEl.removeClass('icon-eye_off').addClass('icon-eye_on');
				}
				if (childCheck) {
					childCheck = rowEl.parent();
					siblLen = childCheck.find('li').length;
					isAllOff = siblLen === childCheck.find('.icon-eye_off').length;
					childCheck.parent()
							.find('div > .icon-eye_on, div > .icon-eye_off')
							.setClass( isAllOff ? 'icon-eye_off' : 'icon-eye_on' );

					rowId = childCheck.parent().find('div.tl_layer').attr('data-track_id');
					trackEl = _jr('div[data-track_id='+ rowId +']', _el.tl_content);
					trackEl[ isAllOff ? 'addClass' : 'removeClass' ]('is_hidden');
				}
				_canvas.info.visible = self.doEvent('get_track_visible');
				_canvas.updateBallCvs();
				_canvas.draw();
				break;
			case 'get_track_visible':
				var rows = _jr('li', _el.tl_body_rows),
					jl = rows.length,
					j = 0,
					rVisible = [];
				for (; j<jl; j++) {
					if (rows[j].getAttribute('data-track') === 'parent') continue;
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
				var arrow   = jr(arguments[1]),
					lRow    = arrow.parents('li'),
					rowId   = arrow.parent().attr('data-track_id'),
					tRow    = _jr('div[data-track_id="'+ rowId +'"]', _el.tl_content).parent().find('.brush_tracks'),
					cHeight = lRow.find('.brushes').height();

				if (arrow.hasClass('icon-arrow_down')) {
					arrow.removeClass('icon-arrow_down').addClass('icon-arrow_up');
					lRow.css({'height': (lRow.height() + cHeight + 2) +'px'});
					tRow.css({'height': (cHeight) +'px'}).addClass('expanded');
				} else{
					arrow.removeClass('icon-arrow_up').addClass('icon-arrow_down');
					lRow.css({'height': ''});
					tRow.css({'height': ''}).wait(300, function() {
						this.removeClass('expanded');
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
		}
	},
	speed_events: function(type) {
		var _el  = sys.el,
			_jr  = jr;
		switch (type) {
			case 'focus':
				_jr(_el.speed_level.parentNode).addClass('focused');
				_jr(_el.anim_speed)
					.css({'display': 'block'})
					.wait(1, function() {
						this.addClass('active');
					});
				break;
			case 'blur':
				_jr(_el.speed_level.parentNode).removeClass('focused');
				_jr(_el.anim_speed)
					.removeClass('active')
					.wait(320, function() {
						this.css({'display': 'none'});
					});
				break;
		}
	}
};
