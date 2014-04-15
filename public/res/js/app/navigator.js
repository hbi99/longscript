
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
			_canvas = _app.canvas,
			info = _canvas.info,
			self = _app.navigator,
			asset = self.asset,
			dim   = self.dim,
			zoom  = self.zoom,
			margin = 10,
			mouseState,
			mouseX,
			mouseY,
			cursor,
			mX1,
			mX2,
			mY1,
			mY2;

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
					cursor = '-webkit-grab';
				}
			}
		}
		
		switch(event.type) {
			// native events
			case 'selectstart': return false;
			case 'mousedown':
				if (event.button === 2) return;
				if (cursor === '-webkit-grab') {
					// ZOOM BOX MOVE
					self.mouseState = {
						type: 'move',
						mouseX: zoom.left - mouseX,
						mouseY: zoom.top - mouseY
					};
				}
				break;
			case 'mousemove':
				if (mouseState.type) {
					zoom.left = mouseX + mouseState.mouseX;
					zoom.top = mouseY + mouseState.mouseY;
					zoom.width  = (_canvas.cvs.width / info.scaledWidth) * asset.width;
					zoom.height = (_canvas.cvs.height / info.scaledHeight) * asset.height;

					mX1 = asset.left - margin;
					mX2 = asset.left + asset.width - zoom.width + margin;
					mY1 = asset.top - margin;
					mY2 = asset.top + asset.height - zoom.height + margin;

					if (zoom.width > asset.width) {
						if (zoom.left > mX1) zoom.left = mX1;
						if (zoom.left < mX2) zoom.left = mX2;
					} else if (zoom.left < mX1) zoom.left = mX1;
					else if (zoom.left > mX2) zoom.left = mX2;

					if (zoom.height > asset.height) {
						if (zoom.top > mY1) zoom.top = mY1;
						if (zoom.top < mY2) zoom.top = mY2;
					} else if (zoom.top < mY1) zoom.top = mY1;
					else if (zoom.top > mY2) zoom.top = mY2;

					// self canvas
					cursor = '-webkit-grabbing';
					self.draw(true);

					// for workarea
					_canvas.info.left = ((asset.left - zoom.left - 2) / (asset.width - zoom.width)) * (info.scaledWidth - _canvas.cvs.width);
					_canvas.info.top = ((asset.top - zoom.top) / (asset.height - zoom.height)) * (info.scaledHeight - _canvas.cvs.height);
					
					//_canvas.updateBallCvs();
					_canvas.draw(true);
				}
				self.cvs.style.cursor = cursor || '';
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
			zoom    = this.zoom,
			draw    = {};

		if (!asset.image) return;

		if (!ignoreInfo) {
			zoom.left   = parseInt(((-info.left * this.scale) / info.scale) + asset.left, 10);
			zoom.top    = parseInt(((-info.top  * this.scale) / info.scale) + asset.top, 10);
			zoom.width  = (_canvas.cvs.width / info.scaledWidth) * asset.width;
			zoom.height = (_canvas.cvs.height / info.scaledHeight) * asset.height;
		}
		// constraints
		draw.left   = Math.max(zoom.left, asset.left - 1);
		draw.top    = Math.max(zoom.top, asset.top - 1);
		draw.width  = (draw.left > zoom.left)? Math.min(zoom.width - (asset.left - zoom.left), asset.width) : Math.min(zoom.width, asset.left + asset.width - zoom.left + 1);
		draw.height = (draw.top > zoom.top)? Math.min(zoom.height - (asset.top - zoom.top), asset.height) : Math.min(zoom.height, asset.top + asset.height - zoom.top + 1);

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
		ctx.strokeRect(draw.left, draw.top, draw.width, draw.height);
		ctx.translate(-0.5, -0.5);
	}
};
