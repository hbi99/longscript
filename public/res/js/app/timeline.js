
sys.app.timeline = {
	init: function() {
		var _sys = sys,
			el = _sys.el,
			observer = _sys.observer;

		observer.on('nob_speed', this.doEvent);

		this.doEvent('populate_frame_nrs');
		//this.speed_events('focus');

		jr('.right .body', el.box_timeline).bind('scroll', this.doEvent);
	},
	doEvent: function(event) {
		var _sys   = sys,
			el     = _sys.el,
			cmd = (typeof(event) === 'string') ? event : event.type,
			target;
		switch (cmd) {
			case 'scroll':
				target = event.toElement;
				el.body_cols.style.left = target.offsetLeft +'px';
				el.body_rows.style.top = target.offsetTop +'px';

				if (target.offsetTop === 0) {
					el.body_cols.classList.remove('vscrolled');
					el.body_cols_left.classList.remove('vscrolled');
				} else {
					el.body_cols.classList.add('vscrolled');
					el.body_cols_left.classList.add('vscrolled');
				}
				if (target.offsetLeft === 0) {
					el.body_rows_left.classList.remove('hscrolled');
				} else {
					el.body_rows_left.classList.add('hscrolled');
				}
				break;
			case 'populate_frame_nrs':
				target = '<div>&#160;</div>';
				for (var i=1; i<50; i++) {
					target += '<div>'+ i +'0</div>';
				}
				el.frame_nrs.innerHTML = target;
				break;
			case 'nob_speed':
				el.speed_level.textContent = event.details.value || 0;
				break;
		}
	},
	speed_events: function(type) {
		var _el  = sys.el;
		switch (type) {
			case 'focus':
				jr(_el.speed_level.parentNode).addClass('focused');
				jr(_el.anim_speed)
					.css({'display': 'block'})
					.wait(1, function() {
						this.addClass('active');
					});
				break;
			case 'blur':
				jr(_el.speed_level.parentNode).removeClass('focused');
				jr(_el.anim_speed)
					.removeClass('active')
					.wait(320, function() {
						this.css({'display': 'none'});
					});
				break;
		}
	}
};
