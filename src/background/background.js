const ExtensionStorage  = window.ExtensionStorage;
const Shortcut = window.Shortcut;
const utils = window.utils;

class Extension {
	constructor() {
		this.storage = new ExtensionStorage();
		this.shortcuts = {};

		this.storage.loadShortcuts().then(shortcuts => {
			this.shortcuts = shortcuts;
			this.bindEvents();
			console.log('Extension initialised.');
		});
	}

	bindEvents() {
		chrome.webNavigation.onDOMContentLoaded.addListener(this.onDomContentLoaded.bind(this));
	}

	getShortcutsForUrl(url) {
		let host = utils.extractHostFromUrl(url);
		let hostShortcuts = this.shortcuts[host] || [];
		let globalShortcuts = this.shortcuts['global'];

		for(let i = 0; i < globalShortcuts.length; i++) {
			let globalShortcut = globalShortcuts[i];
		
			if(!shortcutExists(globalShortcut, hostShortcuts)) {
				hostShortcuts.push(globalShortcut);
			}
		}

		return hostShortcuts;
	}

	onDomContentLoaded(requestDetails) {
		// Ignore requests for iFrames embedded in a page
		if(requestDetails.parentFrameId !== -1) {
			return;
		}

		console.log(`Loaded page: ${requestDetails.url}`);

		let shortcuts = this.getShortcutsForUrl(requestDetails.url);

		utils.sendMessageToTab(requestDetails.tabId, {
			name: 'shortcuts',
			payload: shortcuts
		});
	}
}

// Returns true if the given key combination exists in the given list of shortcuts
function shortcutExists(shortcut, shortcuts) {
	for(let i = 0; i < shortcuts.length; i ++) {
		if(utils.arrayEquals(shortcut.keys, shortcuts[i].keys)) {
			return true;
		}
	}
	return false;
}

let extension = new Extension();