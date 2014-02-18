
sys.app.assets = {
	init: function(root) {
		this.fill_chars();
	},
	chars:  'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'+
			'!"#$%&\'()*+,-./:;<=>?@[\]^_`'+
			'{|}~¡¢£¤¥§¨©ª«¬®¯°±´µ¶·¸º»¿ÀÁÂÃÄÅÆÇÈÉÊ'+
			'ËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿĀāĂăĄąĆćĈĉĊ'+
			'ċČčĎďĐđĒēĔĕĖėĘęĚěĜĝĞğĠġĢģĤĥĦħĨĩĪīĬĭĮįİıĲĳĴĵĶķĸĹĺĻļĽľĿŀŁłŃńŅņŇňŉŊ'+
			'ŋŌōŎŏŐőŒœŔŕŖŗŘřŚśŜŝŞşŠšŢţŤťŦŧŨũŪūŬŭŮůŰűŲųŴŵŶŷŸŹźŻżŽžſƒǼǽǾǿȘșȚțˆˇ'+
			'˘˙˚˛˜˝–—‘’‚“”„•‹›€',
	fill_chars: function() {
		var c = this.chars,
			i = 0,
			il = c.length,
			str = '';
		for (; i<il; i++) {
			str += '<li>'+ c[i] +'</li>';
		}
		jr('.fonts').html(str);
	}
};
