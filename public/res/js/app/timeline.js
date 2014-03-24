
sys.app.timeline = {
	init: function() {
		var _sys = sys,
			el = _sys.el,
			observer = _sys.observer;

		observer.on('file_loaded', this.doEvent);
		observer.on('nob_speed', this.doEvent);

		this.doEvent('populate_frame_nrs');
		//this.speed_events('focus');

		jr('.right .body', el.box_timeline).bind('scroll', this.doEvent);
	},
	doEvent: function(event) {
		var _sys = sys,
			_el  = _sys.el,
			_jr  = jr,
			cmd  = (typeof(event) === 'string') ? event : event.type,
			target;
		switch (cmd) {
			// custom events
			case 'file_loaded':
				return;
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
			case 'toggle_layer':
				target = arguments[1];
				if (target.className === 'icon-arrow_down') {
					target.className = 'icon-arrow_up';
					target.parentNode.parentNode.style.height = '65px';
				} else{
					target.className = 'icon-arrow_down';
					target.parentNode.parentNode.style.height = '';
				}
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
