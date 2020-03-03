/**
 * This class is responsible for:
 * - Listening to user keyboard input and maintaining a list of keys currently being pressed.
 * - Invoking any methods which match the keyboard input
 */
(() => {

	class KeyListener {
		constructor() {
			// Map of key combinations (e.g. Control+a) to event handlers.
			this.shortcutMap = {};

			// Keys currently being pressed.
			this.keyCombination = [];

			this.bindEvents();
			console.log('Key listener has been created');
		}

		bindEvents() {
			window.addEventListener('keydown', this.onKeyDown.bind(this));
			window.addEventListener('keyup', this.onKeyUp.bind(this));
			window.addEventListener('blur', this.onBlur.bind(this));
		}

		onKeyDown(event) {
			this.keyCombination.push(event.key);
			
			let lookupKey = this.keyCombination.join('+');
			let fn = this.shortcutMap[lookupKey];

			console.log(`Key combination: '${lookupKey}'`);

			if(!fn) {
				return;
			}

			event.preventDefault();
			fn();
		}

		onKeyUp(event) {
			this.keyCombination = [];
		}

		onBlur(event) {
			this.keyCombination = [];
		}

		bindShortcuts(shortcuts) {
			if(!shortcuts) {
				return; // No shortcuts to bind.
			}

			shortcuts.forEach(shortcut => {
				this.bindShortcut(shortcut.keys, shortcut.action);
			});
		}

		bindShortcut(keys, action) {
			console.log(`Binding shortcut for keys ${keys.join('+')} to action: ${action}`);
			let keyCombination = keys.join('+');
			this.shortcutMap[keyCombination] = function() {
				eval(action)();
			}
		}
	}

	// Export
	window.KeyListener = KeyListener;

})();