
module.exports = (function(doc) {
	'use strict';

	var ls = {
		O: {},
		I: function(opts) {
			var that = ls,
				opt = {
					speed: 20,
					frames: [],
					src: '',
					autoplay: true,
					loop: false,
					isAnimating: false,
					pi2: Math.PI*2
				};
			switch(opts) {
				case 'play': return that.P(arguments[1]);
				case 'stop': return that.S();
				case 'reset': return that.R(arguments[1]);
			}
			if (/MSIE [678]/i.test(navigator.userAgent) || opt.isAnimating) return;

			var creEl = function(n) {return doc.createElement(n);},
				getEl = function(n) {return doc.getElementById(n);},
				css   = function(e,r) {return getComputedStyle(e, null)[r];},
				imgEl = getEl(opts.id),
				i = new Image(),
				b = new Image(),
				oN, oV;
			
			opt.step = opt.complete = false;
			for (oN in opt) {
				oV = imgEl.getAttribute('data-'+ oN);
				if (!oV) continue;
				switch(typeof(opt[oN])) {
					case 'boolean': oV = (oV === 'true'); break;
					case 'object': oV = JSON.parse(oV); break;
					default: oV = opt[oN].constructor(oV);
				}
				opt[oN] = oV;
			}
			opt.fI = 0;
			that.X(opt, opts);

			that.O = opt;
			that.brushCvs = that.brushCvs || creEl('canvas');
			that.brushCtx = that.brushCvs.getContext('2d');
			that.imgCvs   = imgEl.parentNode.insertBefore(creEl('canvas'), imgEl.nextSibling);
			that.imgCtx   = that.imgCvs.getContext('2d');
			that.cvs      = that.cvs || creEl('canvas');
			that.ctx      = that.cvs.getContext('2d');
			
			that.imgCvs.style.position = 'absolute';
			that.imgCvs.style.top      = (imgEl.offsetTop  || 0) +'px';
			that.imgCvs.style.left     = (imgEl.offsetLeft || 0) +'px';
			that.imgCvs.style.zIndex   = css(imgEl, 'zIndex');
			imgEl.style.opacity = 0;
			
			if (opts) that.O.b = b;

			i.onload = function() {
				var t = that;
				imgEl.src = this.src;
				t.imgCvs.width  = t.brushCvs.width  = t.cvs.width  = imgEl.offsetWidth;
				t.imgCvs.height = t.brushCvs.height = t.cvs.height = imgEl.offsetHeight;
				t.O.img = this;
				
				if (t.O.brush) {
					b.onload = function() {
						var t = that;
						t.O.boL = this.width/2;
						t.O.boT = this.height/2;
						if (t.O.autoplay) t.P();
					};
					b.src = t.O.brush;
				} else {
					if (t.O.autoplay) t.P();
				}
			};
			i.src = that.O.src || imgEl.src || imgEl.getAttribute('data-src');
		},
		// Reset
		R: function(id) {
			if (!this.imgCvs) return;
			var w = this.imgCvs.width,
				h = this.imgCvs.height,
				imgEl;
			this.S();
			this.imgCtx.clearRect(0, 0, w, h);
			this.brushCtx.clearRect(0, 0, w, h);
			this.ctx.clearRect(0, 0, w, h);
			this.O.img.src = '';

			if (!id) return;
			imgEl = document.getElementById(id);
			if (imgEl.nextSibling && imgEl.nextSibling.nodeName.toLowerCase() === 'canvas') {
				imgEl.parentNode.removeChild(imgEl.nextSibling);
			}
		},
		// Stop
		S: function() {
			var opt = ls.O;
			opt.isPaused = true;
			opt.isAnimating = false;
			clearTimeout(opt.timeOut);
			opt.timeOut = false;
		},
		// Play
		P: function(rewind) {
			var that = ls,
				opt = that.O,
				brushCvs = that.brushCvs;
			if (rewind) opt.fI = opt.frames.length;
			if (opt.fI === opt.frames.length) {
				that.brushCtx.clearRect(0, 0, brushCvs.width, brushCvs.height);
				opt.fI = 0;
			}
			that.S();
			opt.isPaused = false;
			opt.isAnimating = true;
			that.D();
		},
		// Draw
		D: function() {
			var that = ls,
				opt = that.O,
				fI = opt.fI,
				frame = opt.frames[fI],
				fL = opt.frames.length,
				PI2 = opt.pi2,
				imgCvs = that.imgCvs,
				imgCtx = that.imgCtx,
				brushCvs = that.brushCvs,
				brushCtx = that.brushCtx,
				cvs = that.cvs,
				ctx = that.ctx,
				w = cvs.width,
				h = cvs.height,
				brush, sceen;
			if (opt.isPaused) {
				return;
			}
			if (!frame || opt.fI > fL) {
				if (opt.loop) {
					return that.P();
				} else {
					if (opt.complete) opt.complete();
					return that.S();
				}
			}
			ctx.clearRect(0, 0, w, h);
			imgCtx.clearRect(0, 0, w, h);
			for (var j=0, jl=frame.length; j<jl; j++) {
				brush = frame[j];
				if (opt.brush) {
					brushCtx.drawImage(opt.b, (brush[0] - opt.boL) * opt.scale, (brush[1] - opt.boT) * opt.scale);
				} else {
					brushCtx.beginPath();
					brushCtx.arc(brush[0], brush[1], brush[2], 0, PI2, false);
					brushCtx.fill();
				}
			}
			ctx.globalCompositeOperation = 'source-over';
			ctx.drawImage(that.brushCvs, 0, 0, w, h);
			ctx.globalCompositeOperation = 'source-in';
			ctx.drawImage(opt.img, 0, 0, w, h);
			imgCtx.drawImage(cvs, 0, 0, w, h);
			if (opt.step) opt.step(opt.fI+1, fL);
			opt.fI++;
			opt.timeOut = setTimeout(that.D, opt.speed);
		},
		X: function(o, e) {
			for (var c in e) {
				if (!o[c] || typeof(e[c]) !== 'object') {
					o[c] = e[c];
				} else {
					this.X(o[c], e[c]);
				}
			}
		}
	};
	return ls.I;

}(document));