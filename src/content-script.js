class ContentScript {
	constructor() {
		this.shortcutMap = {};

		// Keys currently being pressed.
		this.keyCombination = [];

		this.bindEvents();

		console.log('Content script initialised.');
	}

	bindEvents() {
		chrome.runtime.onMessage.addListener(this.onMessageReceieved.bind(this));
		// todo: change these window
		document.addEventListener('keydown', this.onKeyDown.bind(this));
		document.addEventListener('keyup', this.onKeyUp.bind(this));
		window.addEventListener('blur', this.onBlur.bind(this));
	}

	onMessageReceieved(message, sender) {
		console.log('Message received.');

		if (message.name !== 'shortcuts') {
			console.warn('Unknown message.');
			return;
		}

		let shortcuts = message.payload;

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

	onKeyDown(event) {
		this.keyCombination.push(event.key);
		
		let lookupKey = this.keyCombination.join('+');
		let fn = this.shortcutMap[lookupKey];

		if (!fn) {
			console.log(`No action found for combination: ${lookupKey}`);
		} else {
			event.preventDefault();
			console.log('Found action!');
			fn();
		}

	}

	onKeyUp(event) {
		console.log('Key was released.');
		this.keyCombination = [];
	}

	onBlur(event) {
		console.log('The window has lost focus');
		this.keyCombination = [];
	}

}

new ContentScript();