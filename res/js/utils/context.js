
sys.context = {
	fastVars: {},
	info: {},
	init: function() {
		this.fastVars.rootEl = jr('.menus').on('mousedown mouseover', '.menu-item', sys.context.doEvent);

		jr(document).on('contextmenu', 'body, *[data-context]', sys.context.doEvent);
	},
	clear: function() {
		this.fastVars.rootEl.html('');
	},
	createMenu: function(oMenu) {
		//var xTemplate = sys.fs.xml.createElement('i');
		var xDoc = sys.fs.xml,
			xTarget = xDoc.selectSingleNode('//*[@for="'+ oMenu._settings.target +'"]'),
			xTemplate = xDoc.ownerDocument.createElement('i'),
			xMenu, node, attr;
		if (!oMenu._settings.static) {
			while (xTarget.hasChildNodes()) {
				xTarget.removeChild(xTarget.firstChild);
			}
			for (node in oMenu) {
				if (node === '_settings') continue;
				xMenu = xTemplate.cloneNode(false);
				for (attr in oMenu[node]) {
					xMenu.setAttribute(attr, oMenu[node][attr]);
				}
				xTarget.appendChild(xMenu);
			}
			sys.fs.tagIds();
		}
		oMenu._settings.srcTarget.setAttribute('data-context', 'exception');
		this.doEvent.call({
				dataset: {context: oMenu._settings.target}
			}, {
				preventDefault: function() {},
				stopPropagation: function() {},
				type: 'contextmenu',
				pointTo: true,
				clientY: oMenu._settings.top,
				clientX: oMenu._settings.left
			});
	},
	doEvent: function(event) {
		var _sys = sys,
			xDoc = _sys.fs.xml,
			context = _sys.context,
			oHeight,
			oWidth,
			top,
			left;

		if (event.ctrlKey) return;
		event.preventDefault();
		event.stopPropagation();

		switch (event.type) {
			case 'mousedown':
				var xMenuItem = xDoc.selectSingleNode('//context//*[@_id="'+ this.dataset.id +'"]');
				if (xMenuItem && !xMenuItem.getAttribute('disabled') && xMenuItem.getAttribute('action')) {
					_sys.shell.exec( xMenuItem.getAttribute('action') );
				}
				break;
			case 'mouseover':
				var pMenu = this.parentNode.parentNode,
					ctxId = this.dataset.id;

				// xCtx = xDoc.selectSingleNode('//context//*[@_id="'+ ctxId +'"]');
				// if there is a description, display it in status
				//vanguard.stat(xCtx ? xCtx.getAttribute('description') : '');

				jr('.menu-item', pMenu).removeClass('down');
				if (pMenu.pMenuEl) {
					jr(pMenu.pMenuEl).addClass('down');
				}
				// delete adjacent siblings
				while (pMenu.nextSibling) {
					pMenu.parentNode.removeChild( pMenu.nextSibling );
				}
				if (this.className.indexOf('hasSub') === -1) return;
				
				var subMenu = context.fastVars.rootEl.append(transform({
							match: '//context//*[@_id=\''+ ctxId +'\']',
							template: 'menu'
						}).xml);
				oHeight = subMenu.height();
				oWidth = subMenu.width();
				top = pMenu.offsetTop + this.offsetTop;
				left = pMenu.offsetLeft + pMenu.offsetWidth;
				
				if (left + oWidth > window.innerWidth) left = pMenu.offsetLeft - oWidth;
				if (top + oHeight + 11 > window.innerHeight) top -= oHeight - this.offsetHeight;

				subMenu[0].pMenuEl = this;
				subMenu.css({
					'top': top +'px',
					'left': left +'px'
				});
				break;
			case 'contextmenu':
				if (!this.dataset || !this.dataset.context) return;
				var menuXPath = '//context//*[@for=\''+ this.dataset.context +'\']',
					menuXNode = _sys.fs.xml.selectSingleNode(menuXPath);
				if (!menuXNode) return;

				var rootMenu = context.fastVars.rootEl.html(transform({
							match: menuXPath,
							template: 'menu'
						}).xml).find('.context-menu'),
					dim = getDim(this),
					pV = 'T',
					pH = 'L';
				oHeight = rootMenu.height();
				oWidth = rootMenu.width();
				top = event.clientY;
				left = event.clientX;
				
				if (top + oHeight + 11 > window.innerHeight) {
					top -= oHeight;
					pV = 'B';
				}
				if (left + oWidth > window.innerWidth) {
					left -= (oWidth - 6);
					pH = 'R';
				}

				context.info = {
					el: this,
					target: event.target,
					offsetY: dim.t,
					offsetX: dim.l,
					clientY: event.clientY,
					clientX: event.clientX
				};

				if (event.pointTo) {
					switch (pV + pH) {
						case 'TL': top += 10; left -= 10; break;
						case 'TR': top += 10; left += 10; break;
						case 'BR': top -= 21; left += 10; break;
					}
					rootMenu.addClass('arr'+ pV + pH);
				}

				rootMenu.css({
					'top': parseInt(top, 10) +'px',
					'left': parseInt(left, 10) +'px'
				});
				break;
		}
	}
};
