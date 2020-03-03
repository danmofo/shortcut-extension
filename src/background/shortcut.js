(() => {

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

	// Export
	window.Shortcut = Shortcut;

})();
