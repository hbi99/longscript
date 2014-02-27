
sys.app.assets = {
	init: function() {
		this.fill_chars();
		this.sizes.init();
	},
	chars:  'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'+
			'!"#$%&\'()*+,-./:;<=>?@[\\]^_`'+
			'{|}~¡¢£¤¥§¨©ª«¬®¯°±´µ¶·¸º»¿ÀÁÂÃÄÅÆÇÈÉÊ'+
			'ËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿĀāĂăĄąĆćĈĉĊ'+
			'ċČčĎďĐđĒēĔĕĖėĘęĚěĜĝĞğĠġĢģĤĥĦħĨĩĪīĬĭĮįİıĲĳĴĵĶķĸĹĺĻļĽľĿŀŁłŃńŅņŇňŉŊ'+
			'ŋŌōŎŏŐőŒœŔŕŖŗŘřŚśŜŝŞşŠšŢţŤťŦŧŨũŪūŬŭŮůŰűŲųŴŵŶŷŸŹźŻżŽžſƒǼǽǾǿȘșȚțˆˇ'+
			'˘˙˚˛˜˝–—‘’‚“”„•‹›€',
	fill_chars: function() {
		var chars = this.chars,
			i     = 0,
			il    = chars.length,
			str   = '';
		for (; i<il; i++) {
			str += '<li>'+ chars[i] +'</li>';
		}
		jr('.fonts').html(str);
	},
	doEvent: function(event) {
		
	},
	sizes: {
		init: function() {
			jr(sys.el.assets_size_nob).bind('mousedown', this.doEvent);
			//jr(document).on('contextmenu', 'body, *[data-context]', sys.context.doEvent);
		},
		doEvent: function(event) {
			var _size = sys.app.assets.sizes,
				srcEl = event.target,
				left;
			switch(event.type) {
				case 'mousedown':
					event.preventDefault();
					
					_size.drag     = jr(srcEl).addClass('active');
					_size.clickX   = event.clientX;
					_size.dragLeft = srcEl.offsetLeft;
					_size.dragMax  = _size.drag.parent().width() - 12;
					_size.onchange = sys.shell.exec(srcEl.getAttribute('data-onchange'), true)

					_size.drag.parents('.assets').addClass('active');

					jr(document).bind('mouseup mousemove', _size.doEvent);
					break;
				case 'mousemove':
					if (!_size.drag) return;
					left = event.clientX - _size.clickX + _size.dragLeft;
					left = Math.max(Math.min(left, _size.dragMax), 1);
					_size.drag.css({'left': (left - 2) +'px'});

					_size.onchange(parseInt((left / _size.dragMax) * 100, 10));
					break;
				case 'mouseup':
					_size.drag.parents('.assets').removeClass('active');
					_size.drag.removeClass('active');
					_size.drag = false;

					jr(document).unbind('mouseup mousemove', _size.doEvent);
					break;
			}
		},
		changeSize: function(step) {
			var min = 15,
				max = 37,
				fs  = min + ((max - min) * (step / 100)),
				lh = fs * 2.3;
			jr(sys.el.assets_list)
				.css({
					'fontSize': fs +'px',
					'linHeight': lh +'px'
				});
		}
	}
};
