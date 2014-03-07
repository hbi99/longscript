
sys.app.font = {
	info: {},
	init: function() {
		// used to measure font letter
		var span = document.body.appendChild(document.createElement('span'));
			span.className = 'measuringSpan';
			this.measuringSpan = span;

		//this.load('Over the Rainbow');
		//this.load('Allura');
	},
	measure: function() {
		// Measure character width
		var self  = this,
			span  = self.measuringSpan;

		span.style.font  = '100px '+ self.info.xNode.getAttribute('font-family');
		span.textContent = 'QQQQQWWWWWXXXXX';
		self.info.width  = parseInt(span.offsetWidth / 15, 10);
		self.info.height = span.offsetHeight;
		
		sys.observer.trigger('font_loaded', self);
	},
	load: function(name) {
		var _sys  = sys,
			self  = this,
			xFont = _sys.fs.xml.selectSingleNode('//fonts/*[@name="'+ name +'"]');

		_app.switchMode('font');

		self.info.xNode  = xFont;
		self.info.family = xFont.getAttribute('font-family');
		self.info.name   = xFont.getAttribute('name');

		WebFont.load({
			google: {
				families: [self.info.family]
			},
			active: function() {
				self.measure();
			}
		});
	}
};