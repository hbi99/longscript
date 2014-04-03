
sys.app.font = {
	info: {},
	init: function() {
		// used to measure font letter
		var span = document.body.appendChild(document.createElement('span'));
			span.className = 'measuringSpan';
			this.measuringSpan = span;

		//this.fillChars();
		//this.sizes.init();
		
		//this.load('Over the Rainbow');
		//this.load('Allura');
	},
	doEvent: function(event) {
		var _sys = sys,
			_app = _sys.app,
			file = _app.file,
			self = _app.font,
			cmd  = (typeof(event) === 'string')? event : event.type;

		switch (cmd) {
			// custom events
			case 'load_assets':
				if (file.getAttribute('mode') !== 'font') return;
				break;
		}
	},
	chars:  'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'+
			'!"#$%&\'()*+,-./:;<=>?@[\\]^_`ˆˇ˘˙˚˛˜˝–—‘’‚“”„•‹›€'+
			'{|}~¡¢£¤¥§¨©ª«¬®¯°±´µ¶·¸º»¿ÀÁÂÃÄÅÆÇÈÉÊ'+
			'ËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿĀāĂăĄąĆćĈĉĊ'+
			'ċČčĎďĐđĒēĔĕĖėĘęĚěĜĝĞğĠġĢģĤĥĦħĨĩĪīĬĭĮįİıĲĳĴĵĶķĸĹĺĻļĽľĿŀŁłŃńŅņŇňŉŊ'+
			'ŋŌōŎŏŐőŒœŔŕŖŗŘřŚśŜŝŞşŠšŢţŤťŦŧŨũŪūŬŭŮůŰűŲųŴŵŶŷŸŹźŻżŽžſƒǼǽǾǿȘșȚț',
	fillChars: function() {
		var chars = this.chars,
			str   = '',
			i;
		for (i=0; i<chars.length; i++) {
			str += '<li>'+ chars[i] +'</li>';
		}
		//jr('.fonts')
		//	.html(str)
		//	.on('click', 'li', this.doEvent)
		//	.find('li:nth(0)')
		//	.trigger('click');
		return str;
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
			xFont = _sys.ledger.selectSingleNode('//fonts/*[@name="'+ name +'"]');

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