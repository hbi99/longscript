
sys.app.canvas = {
	init: function() {
		var _sys = sys,
			observer = _sys.observer;

		observer.on('app.resize', this.doEvent);
		observer.on('font_loaded', this.doEvent);
		observer.on('image_loaded', this.doEvent);
		observer.on('active_letter', this.doEvent);
		observer.on('nob_zoom', this.doEvent);

		this.cvs = _sys.el.cvs;
		this.ctx = this.cvs.getContext('2d');
		this.cvs.width = this.cvs.offsetWidth;
		this.cvs.height = this.cvs.offsetHeight;
		this.dim = getDim(this.cvs);

		this.scale  = 1;
		this.origoX = 0;
		this.origoY = 0;

		jr(this.cvs).bind('mousedown selectstart', this.doEvent);

		//this.zoom_events('focus');
	},
	doEvent: function(event) {
		var _sys   = sys,
			_app   = _sys.app,
			_el    = _sys.el,
			self   = _app.canvas,
			dim    = self.dim,
			mouseX = event.pageX - dim.l,
			mouseY = event.pageY - dim.t,
			mouseState = self.mouseState,
			scale;

		if (event.preventDefault) event.preventDefault();

		switch(event.type) {
			// custom events
			case 'app.resize':
				self.dim = getDim(self.cvs);
				self.cvs.width = self.cvs.offsetWidth;
				self.cvs.height = self.cvs.offsetHeight;
				self.draw();
				break;
			case 'active_letter':
			case 'font_loaded':
				_el.canvasTitle.innerHTML = _app.font.info.name +' [ '+ _app.assets.activeLetter +' ]';
				self.draw();
				break;
			case 'image_loaded':
				// reset scaling, origo, etc ?
				self.draw();
				break;
			case 'nob_zoom':
				var details = event.details;

				if (details.type === 'start') {
					scale = +_el.nob_scale.getAttribute('data-value');
					self.zoomDetails = {
						origoX: self.origoX,
						origoY: self.origoY
					};
					if (scale > 0) {
						self.zoomDetails.percX = self.origoX / (self.cvs.width - (self.cvs.width * self.scale));
						self.zoomDetails.percY = self.origoY / (self.cvs.height - (self.cvs.height * self.scale));
						self.zoomDetails.origoX = 0;
						self.zoomDetails.origoY = 0;
					}
				}
				self.zoom( details.value );
				break;
			// native events
			case 'selectstart': return false;
			case 'mousedown':
				if (event.button === 2) return;
				if (event.metaKey || event.ctrlKey) {
					var percX, percY, origoX, origoY;

					scale = +_el.nob_scale.getAttribute('data-value');
					
					if (scale === 0) {
						percX = ((mouseX - self.origoX) / self.cvs.width) * self.scale;
						percY = ((mouseY - self.origoY) / self.cvs.height) * self.scale;
						origoX = self.origoX / self.scale;
						origoY = self.origoY / self.scale;
					} else {
						percX = self.origoX / (self.cvs.width - (self.cvs.width * self.scale));
						percY = self.origoY / (self.cvs.height - (self.cvs.height * self.scale));
						origoX = 0;
						origoY = 0;
					}
					self.percX = percX;
					self.percY = percY;

					self.zoom_events('focus');

					self.mouseState = {
						type: 'zoom',
						org_scale: scale,
						startY: mouseY,
						percX: percX,
						percY: percY,
						origoX: origoX,
						origoY: origoY
					};
				} else {
					self.mouseState = {
						type: 'pan',
						origoX: self.origoX,
						origoY: self.origoY,
						clickX: mouseX,
						clickY: mouseY
					};
				}
				jr(document).bind('mousemove mouseup', self.doEvent);
				break;
			case 'mousemove':
				if (!mouseState.type) return;

				switch (mouseState.type) {
					case 'pan':
						self.origoX = mouseX - mouseState.clickX + mouseState.origoX;
						self.origoY = mouseY - mouseState.clickY + mouseState.origoY;
						break;
					case 'zoom':
						var val = Math.min(Math.max(mouseState.org_scale + (mouseState.startY - mouseY), 0), 100);
						
						self.zoom(val, true);

						self.origoX = ((self.cvs.width - (self.cvs.width * self.scale)) * self.percX) + mouseState.origoX;
						self.origoY = ((self.cvs.height - (self.cvs.height * self.scale)) * self.percY) + mouseState.origoY;
						break;
					case 'resize':
						break;
					case 'move':
						break;
				}
				self.draw();
				break;
			case 'mouseup':
				self.zoom_events('blur');

				self.zoomDetails =
				self.mouseState.type = false;
				jr(document).unbind('mousemove mouseup', self.doEvent);
				break;
		}
	},
	draw: function() {
		var _app = sys.app,
			self = _app.canvas,
			cvs  = self.cvs,
			ctx  = self.ctx,
			dim  = self.dim,
			iX   = (dim.w/2) - (cvs.imageWidth/2),
			iY   = (dim.h/2) - (cvs.imageHeight/2);

		// for crispy lines
		//ctx.translate(.5,.5);
		//ctx.beginPath();
		//ctx.fillStyle = '#636363';
		//ctx.fillRect(0, 0, dim.w, dim.h);
		//ctx.translate(-.5,-.5);

		ctx.clearRect(0, 0, cvs.width, cvs.height);

		if (_app.mode === 'image') {
			self.info = {
				left   : (iX * self.scale) + self.origoX,
				top    : (iY * self.scale) + self.origoY,
				width  : cvs.imageWidth * self.scale,
				height : cvs.imageHeight * self.scale
			};
			// disable image interpolation
			ctx.webkitImageSmoothingEnabled = false;
			// image
			ctx.drawImage(_app.image.img,
							self.info.left,
							self.info.top,
							self.info.width,
							self.info.height);

			//ctx.translate(0.5, 0.5);
			ctx.strokeStyle = '#555';
			ctx.strokeRect(self.info.left-2,
							self.info.top-2,
							self.info.width+4,
							self.info.height+4);
			//ctx.translate(-0.5, -0.5);
		}
		// trigger observer
		sys.observer.trigger('zoom_pan');
	},
	opacity: function(val) {
		var _el = sys.el;
		_el.nob_opacity.valEl.textContent = val;
		_el.canvas_bg.style.opacity = 1 - (val/100);
	},
	zoom: function(val, update_nob) {
		var _sys = sys,
			_el  = _sys.el,
			self = _sys.app.canvas,
			width  = self.cvs.width,
			height = self.cvs.height,
			zoomDetails = self.zoomDetails,
			percX  = 0.5,
			percY  = 0.5,
			origoX = 0,
			origoY = 0;

		self.scale = +parseFloat((val * 0.04) + 1).toFixed(2);
		
		_el.zoom_level.textContent = (self.scale * 100).toFixed();
		
		if (update_nob) {
			_el.nob_scale.setAttribute('data-value', val);
			_sys.nobs.draw(_el.nob_scale);
		} else {
			if (zoomDetails) {
				origoX = zoomDetails.origoX;
				origoY = zoomDetails.origoY;
				percX  = zoomDetails.percX || percX;
				percY  = zoomDetails.percY || percY;
				
				self.origoX = origoX + ((width - (width * self.scale)) * percX);
				self.origoY = origoY + ((height - (height * self.scale)) * percY);
			}
			self.draw();
		}
	},
	zoom_events: function(type) {
		var _el  = sys.el;
		switch (type) {
			case 'focus':
				jr(_el.cvs_zoom)
					.css({'display': 'block'})
					.wait(1, function() {
						this.addClass('active');
					});
				break;
			case 'blur':
				jr(_el.cvs_zoom)
					.removeClass('active')
					.wait(320, function() {
						this.css({'display': 'none'});
					});
				break;
		}
	}
};

/* jshint ignore:start */
/*
 		else {
			ctx.strokeStyle = '#555';
			ctx.lineWidth = 1;
			ctx.clearRect(240, 80, 270, 400);
			ctx.rect(240, 80, 270, 400);
			ctx.stroke();

			ctx.textBaseline = 'top';
			ctx.fillStyle = '#fff';
			ctx.textAlign = 'center';
			ctx.font = '200px '+ sys.app.font.info.family;

			//console.log( ctx.measureText(_app.assets.activeLetter) );
			//ctx.fillText('a', w/2, h/2 - 100);
			ctx.fillText(_app.assets.activeLetter, w/2, (h/2) - info.height);
		}
*/
/* jshint ignore:end */
