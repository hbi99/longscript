
sys.tracks = {
	init: function() {
		jr('.track').bind('mousedown', this.doEvent);
		//jr(document).on('contextmenu', 'body, *[data-context]', sys.context.doEvent);
	},
	doEvent: function(event) {
		var _sys = sys,
			self = _sys.tracks,
			target = event.target,
			tParent,
			dim,
			left;
		switch(event.type) {
			case 'mousedown':
				event.preventDefault();
				target = jr(event.target);

				if (target.hasClass('handle')) {
					tParent = target.parent('.track');

					self.drag     = target.addClass('active');
					self.clickX   = event.clientX;
					self.dragLeft = target[0].offsetLeft;
					self.dragMax  = tParent.width() - 10;
					self.onchange = target.attr('data-onchange');

					self.drag.parents('.panel').addClass('active');
					
					if (tParent.hasClass('tl_nob_track')) {
						self.dragMax = tParent.parent().find('.frame_ends').left()-15;
					}

					jr(document)
						.bind('mouseup mousemove', self.doEvent)
						.find('body')
						.addClass('drag_ew');
				} else {
					// slide track is clicked
					dim = getDim(target[0]);
					left = Math.max(Math.min(event.clientX - dim.l - 10, dim.w + 2), 0) +1;
					target
						.find('figure')
						.addClass('animate200')
						.css({'left': left +'px'})
						.wait(220, function() {
							this.removeClass('animate200');
						});
				}
				break;
			case 'mousemove':
				if (!self.drag) return;
				left = event.clientX - self.clickX + self.dragLeft;
				left = Math.max(Math.min(left, self.dragMax), 0);
				self.drag.css({'left': (left - 2) +'px'});

				_sys.observer.trigger(self.onchange, {
					value: parseInt((left / self.dragMax) * 100, 10),
					left: left
				});
				break;
			case 'mouseup':
				self.drag.parents('.panel').removeClass('active');
				self.drag.removeClass('active');
				self.drag = false;

				jr(document)
					.unbind('mouseup mousemove', self.doEvent)
					.find('body')
					.removeClass('drag_ew');
				break;
		}
	}	
};
