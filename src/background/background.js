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
		let shortcuts = this.shortcuts[host];
		return shortcuts;
	}

	onDomContentLoaded(requestDetails) {
		// Ignore requests for iFrames embedded in a page
		if(requestDetails.parentFrameId !== -1) {
			return;
		}

		console.log(`Loaded page: ${requestDetails.url}`);

		let shortcuts = this.getShortcutsForUrl(requestDetails.url);
		if(!shortcuts) {
			console.log('No shortcuts found.');
			return;
		}

		utils.sendMessageToTab(requestDetails.tabId, {
			name: 'shortcuts',
			payload: shortcuts
		});
	}
}

let extension = new Extension();