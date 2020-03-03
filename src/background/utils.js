(() => {

	/**
	 * Compare one dimensional array (does not work with nested objects)
	 */
	function arrayEquals(arr1, arr2) {
		if(arr1 === arr2) {
			return true;
		}

		if(arr1.length !== arr2.length) {
			return false;
		}

		for(let i = 0; i < arr1.length; i++) {
			if(arr1[i] !== arr2[i]) {
				return false;
			}
		}

		return true;
	}

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
		arrayEquals,
		extractHostFromUrl, 
		sendMessageToTab
	};

})();