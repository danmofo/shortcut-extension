// bug: when focus is taken away from the current page, the keyup event handler is not fired, resulting in the key array
// not being reset.
// bug: How do we deal with chrome shortcuts? e.g. CTRL+R for reloading a page. How can we override this?

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
		console.log('Found action!');
		fn();
	}

});

document.addEventListener('keyup', event => {
	console.log('Key was released.');
	keyCombination = [];
});
