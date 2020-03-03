(() => {

	// todo: handle errors when fetching the config.

	const CONFIG_FILE_PATH = "/background/config.json";

	class ExtensionStorage {
		constructor() {}

		loadShortcuts() {
			let path = chrome.extension.getURL(CONFIG_FILE_PATH);
			return fetch(path).then(resp => {
				return resp.json();
			}).then(config => {
				return config.shortcuts || {};
			});
		}
	}

	// Export
	window.ExtensionStorage = ExtensionStorage;

 })();