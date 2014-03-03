
sys.app.canvas = {
	init: function() {
		sys.observer.on('font_loaded', this.doEvent);
		sys.observer.on('active_letter', this.doEvent);

		this.cvs = sys.el.cvs;
		this.cvs.width = this.cvs.offsetWidth;
		this.cvs.height = this.cvs.offsetHeight;
		this.ctx = this.cvs.getContext('2d');
	},
	doEvent: function(event) {
		var _app = sys.app,
			_el  = sys.el;
		switch(event.type) {
			case 'active_letter':
			case 'font_loaded':
				_el.canvasTitle.innerHTML = _app.font.info.name +' [ '+ _app.assets.active +' ]';
				_app.canvas.draw();
				break;
		}
	},
	draw: function() {
		var _app = sys.app,
			self = _app.canvas,
			ctx = self.ctx,
			w = self.cvs.width,
			h = self.cvs.height;

		// for crispy lines
		ctx.translate(.5,.5);

		ctx.beginPath();
		//ctx.fillStyle = '#636363';
		//ctx.fillRect(0, 0, w, h);
		ctx.clearRect(0, 0, w, h);

		ctx.strokeStyle = '#555';
		ctx.lineWidth = 1;
		//ctx.clearRect(240, 80, 270, 400);
		ctx.rect(240, 80, 270, 400);
		ctx.stroke();

		ctx.textBaseline = 'top';
		ctx.fillStyle = '#fff';
		ctx.textAlign = 'center';
		ctx.font = '200px '+ sys.app.font.info.family;
		ctx.fillText(_app.assets.active, w/2, h/2 - 100);
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
