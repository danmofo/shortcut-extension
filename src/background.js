console.log('Background page created.');

class Shortcut {
	constructor(keys, action) {
		this.keys = keys
		this.action = action
	}

	serialise() {
		return {
			keys: this.keys,
			action: this.action.toString()
		}
	}
}

const websiteToShortcutMap = {
	// global shortcuts also?
	'play.typeracer.com': [
		new Shortcut(['Control', 'a'], () => { 
			console.log('Hello world');
		}),
		new Shortcut(['Control', 'x'], () => {
			document.location.reload();
		})
	],
	'google.com': [
		new Shortcut(['Control', 'x'], () => {
			document.location.reload();
		})
	]
}

function onDomContentLoaded(requestDetails) {

	// Ignore requests for iFrames embedded in a page
	if (requestDetails.parentFrameId !== -1) {
		return;
	}

	console.log(`Loaded page: ${requestDetails.url}`);

	let host = extractHostFromUrl(requestDetails.url);
	let shortcuts = websiteToShortcutMap[host];

	if (!shortcuts) {
		console.log(`No shortcuts found for host: ${host}`);
		return;
	}


	let payload = [];
	shortcuts.forEach(shortcut => {
		payload.push(shortcut.serialise());
	})

	sendMessageToTab(requestDetails.tabId, {
		name: 'shortcuts',
		payload: payload
	});

}

chrome.webNavigation.onDOMContentLoaded.addListener(onDomContentLoaded);

function extractHostFromUrl(url) {
	let protocolLessUrl = url
		.replace('https://', '')
		.replace('http://', '');

	return protocolLessUrl.substring(0, protocolLessUrl.indexOf('/'));
}

/**
 * Message format:
 * {
 * 	  "name": "shortcuts_for_website",
 * 	  "payload": "function() {}"
 * }
 */
function sendMessageToTab(tabId, message) {
	console.log(`Sending message to tab ID: ${tabId}.`, message);
	chrome.tabs.sendMessage(tabId, message);
}