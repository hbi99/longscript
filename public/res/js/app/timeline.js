
sys.app.timeline = {
	init: function() {
		var _sys = sys,
			el = _sys.el;

		jr('.right .body', el.box_timeline).bind('scroll', this.doEvent);
	},
	doEvent: function(event) {
		var _sys   = sys,
			el     = _sys.el,
			self   = sys.app.timeline,
			target = event.taget;
		switch (event.type) {
			case 'scroll':
				target = event.toElement;
				el.body_cols.style.left = target.offsetLeft +'px';
				el.body_rows.style.top = target.offsetTop +'px';
				break;
		}
	}
};
