
sys.app = {
	el: {},
	init: function() {
		// collection for fast access
		var els = jr('*[data-el]');
		for (var i=0, il=els.length; i<il; i++) {
			this.el[ els[i].getAttribute('data-el') ] = els[i];
		}

		// initate app
		for (var n in this) {
			if (typeof(this[n].init) === 'function') this[n].init(this);
		}
	},
	font: {
		info: {},
		init: function() {
			// used to measure font letter
			var span = document.body.appendChild(document.createElement('span'));
				span.className = 'measuringSpan';
				this.measuringSpan = span;

			this.load('Over the Rainbow');
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

			// _sys.el.fontLoader.onload = function() {
			// 	console.log(1);
			// 	setTimeout(function() {
			// 		self.measure();
			// 	}, 80);
			// };
			// _sys.el.fontLoader.href = xFont.getAttribute('url');
		}
	}
};
