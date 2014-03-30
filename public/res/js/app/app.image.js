
sys.app.image = {
	init: function() {
		var _sys = sys,
			observer = _sys.observer;

		observer.on('load_assets', this.doEvent);
	},
	doEvent: function(event) {
		var _sys = sys,
			_app = _sys.app,
			file = _app.file,
			self = _app.image,
			cmd  = (typeof(event) === 'string')? event : event.type;

		switch (cmd) {
			// custom events
			case 'load_assets':
				if (file.getAttribute('mode') !== 'image') return;
				var imgs = file.selectNodes('.//image'),
					il = imgs.length,
					i = 0;
				self.load_que = il;
				for (; i<il; i++) {
					self.load( imgs[i].getAttribute('source') );
				}
				break;
		}
	},
	load: function(url) {
		var _sys = sys,
			_app = _sys.app,
			file = _app.file,
			self = _app.image;

		this.img = new Image();
		this.img.src = url;
		this.img.onload = function() {
			var xImg = file.selectSingleNode('.//image[@source="'+ url +'"]');

			_app.canvas.info[ xImg.getAttribute('id') ] = {
				width: this.width,
				height: this.height,
				img: this
			};

			self.load_que--;
			if (self.load_que <= 0) {
				_sys.observer.trigger('assets_loaded');
			}
		};
	}
};