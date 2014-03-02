
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

		//this.loadFont('Over the Rainbow');
		this.loadFont('Allura');
	},
	loadFont: function(name) {
		var xFont = sys.fs.xml.selectSingleNode('//fonts/*[@name="'+ name +'"]');

		sys.el.canvasTitle.innerHTML = xFont.getAttribute('name');
		sys.el.fontLoader.href = xFont.getAttribute('url');
		sys.el.assetsList.style.fontFamily = xFont.getAttribute('font-family');
	}
};
