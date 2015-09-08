
sys.shell = {
	errorStr: {
		'101': 'Command not found.',
		'102': 'Too many corresponding commands. Use switch-form.',
		'103': 'Bad command registered.',
		'104': 'Unknown mode.'
	},
	init: function() {
		jr(document).on('mousedown', '[data-cmd]', this.doCmd);
		jr(document).on('dblclick', '[data-dblclick]', this.doCmd);
	},
	doCmd: function(event) {
		var cmd;
		if (event.run73 && event.run73.property) {
			// hotkey handler
			cmd = event.run73.property;
			event.preventDefault();
		} else {
			if (event.target.className.indexOf('button') > -1) {
				event.preventDefault();
			}
			cmd = this.getAttribute((event.type === 'mousedown')? 'data-cmd' : 'data-dblclick');
		}
		//if (cmd) sys.shell.exec(cmd, false, event.target);
		if (cmd) sys.shell.exec(cmd, false, this, event);
		return false;
	},
	err: function(cmd, errnum) {
		return {
			cmd: cmd,
			error: (typeof(errnum) === 'number')? this.errorStr[errnum] : errnum
		};
	},
	exec: function(cmd, getFunc, el, event) {
		var oCmd = cmd.split(' '),
			xAlias,
			xCmd,
			fCmd = [],
			fThis,
			fFinal,
			args = '',
			ret,
			isOpen,
			i = 1,
			il = oCmd.length;
		for (; i<il; i++) {
			if (isOpen) args += oCmd[i];
			if (oCmd[i].indexOf("'") > -1) {
				args += ' '+ oCmd[i];
				isOpen = !!isOpen;
				continue;
			}
			args += " '"+ oCmd[i] +"'";
		}
		args = args.slice(2,-1).split("' '");
		if (args.length > 0 && args[0].slice(0,1) === '-') {
			xCmd = sys.ledger.selectNodes('//alias/*[@object="'+ oCmd[0] +'"]/*[@switch="'+ args[0].slice(1) +'"]');
			if (xCmd.length === 0) return this.err(cmd, 101);
			oCmd[0] = xCmd[0].getAttribute('name');
			args = args.splice(1);
		}
		xCmd = xCmd || sys.ledger.selectNodes('//alias//*[@name="'+ oCmd[0] +'"]');
		if (!xCmd.length) {
			xAlias = sys.ledger.selectSingleNode('//alias//*[@alias="'+ oCmd[0] +'"]');
			if (xAlias) {
				xCmd = [xAlias];
				oCmd[0] = xAlias.getAttribute('name');
			}
		}
		if (xCmd.length > 1) {
			return this.err(cmd, 102);
		}
		if (xCmd.length) {
			fCmd = xCmd[0].parentNode.getAttribute('long').split('.');
			fCmd.push(oCmd[0]);
		}
		fFinal = window;
		for (i=0, il=fCmd.length; i<il; i++) {
			fFinal = fFinal[fCmd[i]];
			if (i === il-2) fThis = fFinal;
			if (!fFinal) return this.err(cmd, 103);
		}
		if (el) args.push(el);
		if (event) args.push(event);
		if (typeof(fFinal) !== 'function') return this.err(cmd, 101);
		if (getFunc) return fFinal.bind(fThis);
		ret = fFinal.apply(fThis, args);
		return typeof(ret) === 'object'? ret: { cmd: cmd, ret: ret };
	}
};
