
sys.app.navigator = {
	asset: {},
	init: function() {
		var _sys = sys,
			observer = _sys.observer;

		observer.on('assets_loaded', this.doEvent);
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
			info = _app.canvas.info,
			self = _app.navigator;

		switch(event.type) {
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
	draw: function() {
		var _app    = sys.app,
			_canvas = _app.canvas,
			info    = _canvas.info,
			cvs     = this.cvs,
			ctx     = this.ctx,
			asset   = this.asset,
			zoomLeft   = parseInt((info.left < 0 ? -(info.left * this.scale) / info.scale : 0) + asset.left, 10),
			zoomTop    = parseInt((info.top  < 0 ? -(info.top  * this.scale) / info.scale : 0) + asset.top, 10),
			zoomWidth  = asset.width - (( (info.left + info.scaledWidth - _canvas.cvs.width) / info.scaledWidth ) * asset.width) - zoomLeft + asset.left,
			zoomHeight = asset.height - (( (info.top + info.scaledHeight - _canvas.cvs.height) / info.scaledHeight ) * asset.height) - zoomTop + asset.top;

		if (!asset.image) return;

		zoomWidth  = parseInt(Math.min(asset.width + (asset.left - zoomLeft), zoomWidth), 10);
		zoomHeight = parseInt(Math.min(asset.height + (asset.top - zoomTop), zoomHeight), 10);

		// clear canvas
		ctx.clearRect(0, 0, cvs.width, cvs.height);

		if (_app.mode === 'image') {
			// semi-transparent box
			ctx.fillStyle = 'rgba(255,255,255,0.08)';
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
