
sys.app.timeline = {
	init: function() {
		var _sys = sys,
			el = _sys.el,
			observer = _sys.observer;

		observer.on('file_loaded', this.doEvent);
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
			file = _app.file,
			self = _app.timeline,
			cmd  = (typeof(event) === 'string') ? event : event.type,
			target;
		switch (cmd) {
			// custom events
			case 'frame_index_change':
				self.frameIndex = Math.round(event.details.left / 16);
				break;
			case 'file_loaded':
				//return;
				var xTimeline = file.selectSingleNode('.//timeline');

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
				//self.doEvent('toggle_layer', jr('.icon-arrow_down:nth(0)')[0]);
				break;
			case 'populate_frame_nrs':
				target = '<div>&#160;</div>';
				for (var i=1; i<50; i++) {
					target += '<div>'+ i +'0</div>';
				}
				_el.frame_nrs.innerHTML = target;
				break;
			case 'nob_speed':
				var details = event.details;
				details.srcElement.textContent = details.value || 0;
				break;
			case 'dblclick_layer':
				target = _jr(arguments[1]).find('figure:nth(1)')[0];
				return self.doEvent('toggle_layer', target);
			case 'toggle_layer':
				var arrow   = jr(arguments[1]),
					lRow    = arrow.parents('li'),
					rowId   = lRow.attr('data-track_row_id'),
					tRow    = _jr('li[data-track_id="'+ rowId +'"] .brush_tracks', _el.tl_content),
					cHeight = lRow.find('.brushes').height();

				if (arrow.hasClass('icon-arrow_down')) {
					arrow.removeClass('icon-arrow_down').addClass('icon-arrow_up');
					lRow.css({'height': (lRow.height() + cHeight) +'px'});
					tRow.css({'height': (cHeight) +'px'});
				} else{
					arrow.removeClass('icon-arrow_up').addClass('icon-arrow_down');
					lRow.css({'height': ''});
					tRow.css({'height': ''});
				}
				break;
			case 'make_track_active':
				var row = _jr(arguments[1]),
					track_el = (row.attr('data-track') === 'parent')? row : row.parents('[data-track=parent]'),
					row_id = track_el.attr('data-track_row_id') || track_el.attr('data-track_id');

				_jr(_el.tl_body_rows).find('.active').removeClass('active');
				_jr(_el.tl_content).find('.active').removeClass('active');

				_jr('[data-track_row_id='+ row_id +']', _el.tl_body_rows).addClass('active');
				_jr('[data-track_id='+ row_id +']', _el.tl_content).addClass('active');
				break;
			case 'change_track_color':
				var new_color = arguments[1],
					track_el = _sys.context.info.el;
				_jr(track_el.parentNode).find('.anim_track').setClass('anim_track '+ new_color);
				break;
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
