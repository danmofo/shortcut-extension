const KeyListener = window.KeyListener;

class ContentScript {
	constructor() {
		this.keyListener = new KeyListener();

		this.bindEvents();

		console.log('Content script initialised.');
	}

	bindEvents() {
		chrome.runtime.onMessage.addListener(this.onMessageReceieved.bind(this));
	}

	onMessageReceieved(message, sender) {
		console.log('Message received.');

		if(message.name !== 'shortcuts') {
			console.warn(`Unknown message name ${message.name}`);
			return;
		}

		let shortcuts = message.payload;

		this.keyListener.bindShortcuts(shortcuts);
	}
}

new ContentScript();