(function($) {
  $.fn.charLimit = function(options) {
		if(options === undefined || options.limit === undefined || typeof options.limit !== 'number') {
			$.error('Option limit must be defined and must be a number.');
		}
		
		return this.each(function() {
			var self = $(this);
			var charLimit = options.limit;
			
			function _truncate(ev) {
				var caretPos;
				if (ev.target.selectionStart !== undefined) {
					caretPos = ev.target.selectionEnd;
				} else if(document.selection) {
					ev.target.focus();					
					var range = document.selection.createRange();
					range.moveStart('character', -ev.target.value.length);
					caretPos = range.text.length;
				}
				
				self.val(self.val().substring(0, charLimit));
				_setCaretPos(ev, caretPos);
			}
			
			function _setCaretPos(ev, pos) {
				if ($(ev.target).get(0).setSelectionRange) {
					$(ev.target).get(0).setSelectionRange(pos, pos);
				} else if ($(ev.target).get(0).createTextRange) {
					var range = $(ev.target).get(0).createTextRange();
					range.collapse(true);
					range.moveEnd('character', pos);
					range.moveStart('character', pos);
					range.select();
				}
			}
			
			self.keypress(function(ev) {
				var charCount = self.val().length;
				var selected;
				if (ev.target.selectionStart !== undefined) {
					selected = !(ev.target.selectionStart==ev.target.selectionEnd);
				} else if(document.selection) {
					ev.target.focus();					
					var range = document.selection.createRange();
					selected = (range.text.length > 0);
				}  

				if(charCount > charLimit-1 && !selected) {
					return false;
				}
				setTimeout(function() {
					_truncate(ev);
				}, 1);
			});
			
			self.bind('paste', function(ev) {
				setTimeout(function() {
					_truncate(ev);
				}, 1);
			});			
		});
	};
})( jQuery );