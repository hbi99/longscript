
sys.language = {
	init: function() {

	},
	getPhrase: function(id) {
		var xNode = sys.ledger.selectSingleNode('//language/*[@id="'+ id +'"]');
		if (!xNode) return;
		var retStr = xNode.getAttribute('str');
		retStr = retStr.replace(/\\n/g, '<br/>');
		retStr = retStr.replace(/\[\[/g, '<');
		retStr = retStr.replace(/\]\]/g, '>');
		if (arguments[1]) retStr = retStr.replace(/\$var1\$/, arguments[1]);
		if (arguments[2]) retStr = retStr.replace(/\$var2\$/, arguments[2]);
		return retStr;
	}
};
