
sys.app.navigator = {
	asset: {},
	init: function() {
		var _sys = sys,
			observer = _sys.observer;

		observer.on('image_loaded', this.doEvent);
		observer.on('zoom_pan', this.doEvent);

		this.cvs = _sys.el.zoomcvs;
		this.ctx = this.cvs.getContext('2d');
		this.cvs.width  = this.cvs.offsetWidth;
		this.cvs.height = this.cvs.offsetHeight;
		this.dim = getDim(this.cvs);

		this.asset = {};
	},
	doEvent: function(event) {
		var _sys = sys,
			_app = _sys.app,
			self = _app.navigator;

		switch(event.type) {
			case 'zoom_pan':
				self.draw();
				break;
			case 'image_loaded':
				// reset scaling, origo, etc ?
				var dim    = self.dim,
					image  = event.details.el,
					ratio  = image.width / image.height,
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
	draw: function() {
		var _app    = sys.app,
			_canvas = _app.canvas,
			info    = _canvas.info,
			cvs     = this.cvs,
			ctx     = this.ctx,
			asset   = this.asset,
			zoomLeft   = (info.left < 0 ? -(info.left * this.scale) / _canvas.scale : 0) + asset.left,
			zoomTop    = (info.top  < 0 ? -(info.top  * this.scale) / _canvas.scale : 0) + asset.top,
			zoomWidth  = asset.width - (( (info.left + info.width - _canvas.cvs.width) / info.width ) * asset.width) - zoomLeft + asset.left,
			zoomHeight = asset.height - (( (info.top + info.height - _canvas.cvs.height) / info.height ) * asset.height) - zoomTop + asset.top;

		if (!asset.image) return;

		zoomWidth  = Math.min(asset.width + (asset.left - zoomLeft), zoomWidth);
		zoomHeight = Math.min(asset.height + (asset.top - zoomTop), zoomHeight);

		// clear canvas
		ctx.clearRect(0, 0, cvs.width, cvs.height);

		if (_app.mode === 'image') {
			// semi-transparent box
			ctx.fillStyle = 'rgba(0,0,0,0.1)';
			ctx.fillRect(asset.left-1, asset.top-1, asset.width+2, asset.height+2);
			// image
			ctx.drawImage(asset.image, asset.left, asset.top, asset.width, asset.height);
		}
		// zoom rectangle
		ctx.translate(0.5, 0.5);
		ctx.strokeStyle = '#f90';
		ctx.strokeRect(zoomLeft, zoomTop, zoomWidth, zoomHeight);
		ctx.translate(-0.5, -0.5);
	}
};
