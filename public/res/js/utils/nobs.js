
sys.nobs = {
	el: false,
	clickY: 0,
	clickX: 0,
	init: function() {
		var nobs = jr('.nob').bind('mousedown selectstart', this.doEvent),
			i = 0,
			cvs;
		for (; cvs=nobs[i]; i++) { // jshint ignore:line
			cvs.height = cvs.width * 0.9;
			cvs.valEl = jr('.nob-value span', cvs.parentNode)[0];
			this.draw(cvs, true);
		}
	},
	dispose: function() {},
	doEvent: function(event) {
		var self = sys.nobs,
			observer_el = self.el,
			observer_type,
			onchange;
			//bodyStyle = document.body.style;
		event.preventDefault();
		
		switch (event.type) {
			case 'selectstart':
				event.preventDefault();
				event.stopPropagation();
				return false;
			case 'mousedown':
				observer_el =
				self.el = this;
				self.clickY = event.clientY;
				self.clickX = event.clientX;
				self.orgValue = self.el.getAttribute('data-value');
				//bodyStyle.cursor = 'none';

				observer_type = 'start';

				jr(document).bind('mousemove mouseup', self.doEvent);
				break;
			case 'mousemove':
				if (!self.el) return;
				self.el.setAttribute('data-value', (Math.min(Math.max(self.clickY-event.clientY + (self.orgValue - 50), -50), 50) + 50));
				self.draw( self.el );
				break;
			case 'mouseup':
				if (!self.el) return;
				self.el = false;
				observer_type = 'end';
				//bodyStyle.cursor = '';
				jr(document).unbind('mousemove mouseup', self.doEvent);
				break;
		}
		onchange = observer_el.getAttribute('data-onchange');
		if (!onchange) return;
		sys.observer.trigger(onchange, {
			type: observer_type,
			target: observer_el,
			value: observer_el.getAttribute('data-value')
		});
	},
	draw: function(cvs, isInit) {
		var ctx  = cvs.getContext('2d'),
			d = cvs.width,
			lw = 4,
			r = d/2,
			radius = r - lw - 3,
			clr = cvs.getAttribute('data-color') || '#F90',
			val = cvs.getAttribute('data-value'),
			deg = (Math.min(Math.max(val/100, 0), 1) * 1.5) + 0.75,
			pi = Math.PI,
			startAngle = 0.745 * pi,
			midAngle = deg * pi,
			endAngle = 0.251 * pi,
			onchange;
            
		// Clear canvas and defaults
		ctx.clearRect(0, 0, d, d);
		ctx.lineWidth = lw;
		ctx.lineCap = 'round';
        
		// Orange line
			ctx.shadowBlur = 5;
		if (val > 0) {
			ctx.shadowColor =
			ctx.strokeStyle = clr;

			ctx.beginPath();
			ctx.arc(r, r, radius, startAngle, midAngle, false);
			ctx.stroke();
			//ctx.shadowBlur = 0;
		}

		// Gray line
		ctx.shadowColor = '#444';
		ctx.strokeStyle = '#777';
		ctx.beginPath();
		ctx.moveTo(r, r);
		ctx.arc(r, r, radius, midAngle, endAngle, false);
		ctx.stroke();

		// Call func
		if (isInit) return;
		onchange = cvs.getAttribute('data-onchange');
		if (!onchange) return;
		sys.observer.trigger(onchange, {
			value: val,
			target: cvs
		});
	}
};