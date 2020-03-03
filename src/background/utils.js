(() => {

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

	// Export
	window.utils = {
		extractHostFromUrl, 
		sendMessageToTab
	};

})();