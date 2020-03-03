console.log('Content script injected.');

function onMessageReceieved(message, sender) {
	console.log('Message received.');

	if (message.name !== 'shortcuts') {
		console.warn('Unknown message.');
		return;
	}

	let shortcuts = message.payload;

	shortcuts.forEach(shortcut => {
		bindShortcut(shortcut.keys, shortcut.action);
	});
}

chrome.runtime.onMessage.addListener(onMessageReceieved);

let shortcutMap = {};

function bindShortcut(keys, action) {
	console.log(`Binding shortcut for keys ${keys.join('+')} to action: ${action}`);
	let keyCombination = keys.join('+');
	shortcutMap[keyCombination] = function() {
		eval(action)();
	}
}

// Keys currently being pressed.
let keyCombination = [];

document.addEventListener('keydown', event => {
	keyCombination.push(event.key);
	
	let lookupKey = keyCombination.join('+');
	let fn = shortcutMap[lookupKey];

	if (!fn) {
		console.log(`No action found for combination: ${lookupKey}`);
	} else {
		event.preventDefault();
		console.log('Found action!');
		fn();
	}

});

document.addEventListener('keyup', event => {
	console.log('Key was released.');
	keyCombination = [];
});

window.addEventListener('blur', event => {
	console.log('The window has lost focus');
	keyCombination = [];
});