
sys.app.canvas = {
	init: function() {
		
	},
	opacity: function(val) {
		var els = sys.el;
		els.nob_opacity.valEl.textContent = val;
		els.canvas_bg.style.opacity = 1-(val/100);
	},
	zoom: function(val) {
		var perc = parseFloat((val * 0.04) + 1).toFixed(2),
			els  = sys.el;
		els.zoom_level.textContent = (perc * 100).toFixed();
	},
	zoom_events: function(type) {
		var els  = sys.el;
		switch (type) {
			case 'focus':
				jr(els.cvs_zoom)
					.css({'display': 'block'})
					.wait(1, function() {
						this.addClass('active');
					});
				break;
			case 'blur':
				jr(els.cvs_zoom)
					.removeClass('active')
					.wait(320, function() {
						this.css({'display': 'none'});
					});
				break;
		}
	}
};
