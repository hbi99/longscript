
sys.app.navigator = {
	asset: {},
	mouseState: {},
	init: function() {
		var _sys = sys,
			_jr  = jr,
			observer = _sys.observer;

		observer.on('assets_loaded', this.doEvent);
		observer.on('zoom_pan', this.doEvent);

		this.cvs = _sys.el.zoomcvs;
		this.ctx = this.cvs.getContext('2d');
		this.cvs.width  = this.cvs.offsetWidth;
		this.cvs.height = this.cvs.offsetHeight;
		this.dim  = getDim(this.cvs);
		this.zoom = {};

		_jr(this.cvs).bind('mousedown selectstart mousemove', this.doEvent);
		_jr(document).bind('mouseup', this.doEvent);

		this.asset = {};
	},
	doEvent: function(event) {
		var _sys = sys,
			_app = _sys.app,
			info = _app.canvas.info,
			self = _app.navigator,

			asset = self.asset,
			dim   = self.dim,
			zoom  = self.zoom,
			mouseState,
			mouseX,
			mouseY,
			cursor;

		if (event.bubbles) {
			event.preventDefault();

			mouseX = event.pageX - dim.l;
			mouseY = event.pageY - dim.t;
			mouseState = self.mouseState;

			if (!mouseState.type) {
				if (mouseX > asset.left && mouseX < asset.left + asset.width &&
					mouseY > asset.top && mouseY < asset.top + asset.height) {
					cursor = 'pointer';
				}
				if (mouseX > zoom.left && mouseX < zoom.left + zoom.width &&
					mouseY > zoom.top && mouseY < zoom.top + zoom.height) {
					cursor = 'move';
				}
			}
		}

		switch(event.type) {
			// native events
			case 'selectstart': return false;
			case 'mousedown':
				if (event.button === 2) return;
				if (cursor === 'move') {
					// ZOOM BOX MOVE
					self.mouseState = {
						type: 'move',
						mouseX: mouseX,
						mouseY: mouseY
					};
				}
				break;
			case 'mousemove':
				if (mouseState.type) {
					zoom.left = mouseX - mouseState.mouseX + asset.left;
					zoom.top = mouseY - mouseState.mouseY + asset.top;
					
					self.draw(true);
				}
				self.cvs.style.cursor = cursor || 'default';
				break;
			case 'mouseup':
				self.mouseState.type = false;
				break;
			// custom events
			case 'zoom_pan':
				self.draw();
				break;
			case 'assets_loaded':
				// reset scaling, origo, etc ?
				var dim    = self.dim,
					image  = info['1'].img,
					ratio  = info.scaledWidth / info.scaledHeight,
					margin = 15,
					width,
					height;

				if (ratio >= 1) {
					width = dim.w - (margin*2);
					height = width / ratio;
				} else {
					height = dim.h - (margin*2);
					width = ratio * height;
				}

				self.asset = {
					image  : image,
					margin : margin,
					ratio  : ratio,
					left   : (dim.w/2) - (width/2),
					top    : (dim.h/2) - (height/2),
					width  : width,
					height : height
				};
				self.scale = self.asset.width / image.width;
				self.draw();
				break;
		}
	},
	draw: function(ignoreInfo) {
		var _app    = sys.app,
			_canvas = _app.canvas,
			info    = _canvas.info,
			cvs     = this.cvs,
			ctx     = this.ctx,
			asset   = this.asset,
			zoom    = this.zoom;

		if (!asset.image) return;

		if (!ignoreInfo) {
			zoom.left   = parseInt((info.left < 0 ? -(info.left * this.scale) / info.scale : 0) + asset.left, 10);
			zoom.top    = parseInt((info.top  < 0 ? -(info.top  * this.scale) / info.scale : 0) + asset.top, 10);
			zoom.width  = asset.width - (( (info.left + info.scaledWidth - _canvas.cvs.width) / info.scaledWidth ) * asset.width) - zoom.left + asset.left;
			zoom.height = asset.height - (( (info.top + info.scaledHeight - _canvas.cvs.height) / info.scaledHeight ) * asset.height) - zoom.top + asset.top;
		}

		zoom.width  = parseInt(Math.min(asset.width + (asset.left - zoom.left), zoom.width), 10);
		zoom.height = parseInt(Math.min(asset.height + (asset.top - zoom.top), zoom.height), 10);

		// clear canvas
		ctx.clearRect(0, 0, cvs.width, cvs.height);

		if (_app.type === 'image') {
			// semi-transparent box
			ctx.fillStyle = 'rgba(255,255,255,0.08)';
			ctx.fillRect(asset.left-1, asset.top-1, asset.width+2, asset.height+2);
			// image
			ctx.drawImage(asset.image, asset.left, asset.top, asset.width, asset.height);
		}
		// zoom rectangle
		ctx.translate(0.5, 0.5);
		ctx.strokeStyle = '#f90';
		ctx.strokeRect(zoom.left, zoom.top, zoom.width, zoom.height);
		ctx.translate(-0.5, -0.5);
	}
};
