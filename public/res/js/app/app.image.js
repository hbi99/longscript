
sys.app.image = {
	init: function() {
		setTimeout(function() {
			sys.app.image.load('./res/img/hello_white.png');
		}, 0);
	},
	load: function(url) {
		var _app = sys.app;

		_app.switchMode('image');

		this.img = new Image();
		this.img.src = url;
		this.img.onload = function() {
			// add image to assets
			console.log( this.width, this.height );
		};
	}
};