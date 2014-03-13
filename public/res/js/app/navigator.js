
sys.app.navigator = {
	asset: {},
	init: function() {
		var _sys = sys,
			observer = _sys.observer;

		sys.observer.on('image_loaded', this.doEvent);

		this.cvs = _sys.el.zoomcvs;
		this.ctx = this.cvs.getContext('2d');
		this.cvs.width = this.cvs.offsetWidth;
		this.cvs.height = this.cvs.offsetHeight;
		this.dim = getDim(this.cvs);

		this.asset = {};
	},
	doEvent: function(event) {
		var _sys = sys,
			_el  = _sys.el,
			_app = _sys.app,
			self = _app.navigator;

		switch(event.type) {
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
					image : image,
					ratio : ratio,
					left  : (dim.w/2) - (width/2),
					top   : (dim.h/2) - (height/2),
					width : width,
					height: height
				};
				self.draw();
				break;
		}
	},
	draw: function() {
		var _app = sys.app,
			cvs  = this.cvs,
			ctx  = this.ctx,
			dim  = this.dim,
			asset = this.asset,
			iX   = (dim.w/2) - (_app.canvas.cvs.imageWidth/2),
			iY   = (dim.h/2) - (_app.canvas.cvs.imageHeight/2);
		
		ctx.clearRect(0, 0, cvs.width, cvs.height);

		if (_app.mode === 'image') {
			// disable image interpolation
			//ctx.webkitImageSmoothingEnabled = false;

			ctx.translate(.5,.5);
			ctx.strokeStyle = '#555';
			ctx.lineWidth = .5;
			ctx.strokeRect(asset.left-2, asset.top-2, asset.width+4, asset.height+4);
			ctx.translate(-.5,-.5);
			
			// image
			ctx.drawImage(asset.image, asset.left, asset.top, asset.width, asset.height);
		}
	}
};
