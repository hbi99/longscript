
sys.nobs = {
	el: false,
	clickY: 0,
	clickX: 0,
	init: function() {
		var nobs = jr('.nob'),
			i = 0,
			cvs;
		for (; cvs=nobs[i]; i++) { // jshint ignore:line
			cvs.height = cvs.width * 0.9;
			cvs.valEl = jr('.nob-value span', cvs.parentNode)[0];
			this.draw(cvs, true);

			cvs.addEventListener('mousedown', this.doEvent, true);
			cvs.addEventListener('selectstart', this.doEvent, false);
		}
		window.addEventListener('mousemove', this.doEvent, true);
		window.addEventListener('mouseup', this.doEvent, true);
	},
	dispose: function() {},
	doEvent: function(event) {
		var _nob = sys.nobs;
			//bodyStyle = document.body.style;
		switch (event.type) {
			case 'selectstart':
				event.preventDefault();
				event.stopPropagation();
				return false;
			case 'mousedown':
				_nob.el = event.target || event.srcElement;
				_nob.clickY = event.clientY;
				_nob.clickX = event.clientX;
				_nob.orgValue = _nob.el.getAttribute('data-value');
				//bodyStyle.cursor = 'none';
				event.preventDefault();
				break;
			case 'mousemove':
				if (!_nob.el) return;
				_nob.el.setAttribute('data-value', (Math.min(Math.max(_nob.clickY-event.clientY + (_nob.orgValue - 50), -50), 50) + 50));
				_nob.draw( _nob.el );
				break;
			case 'mouseup':
				if (!_nob.el) return;
				_nob.el = false;
				//bodyStyle.cursor = '';
				break;
		}
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
			endAngle = 0.251 * pi;
            
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
		var onchange = cvs.getAttribute('data-change'),
			parts, fn;
		if (onchange) {
			if (cvs.fnStr !== onchange) {
				parts = onchange.slice(0, onchange.indexOf('(')).split('.');
				fn = window;
				for (var i=0, il=parts.length-1; i<il; i++) {
					if (!fn[parts[i]]) return;
					if (parts[i].indexOf('(') > -1) break;
					fn = fn[parts[i]];
				}
				cvs.fnStr = onchange;
				cvs.fnObj = fn;
				cvs.fn = fn[parts[i]];
			}
			cvs.fn.call(cvs.fnObj, val);
		}
	}
};