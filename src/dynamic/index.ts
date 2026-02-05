const scriptNode = document.createElement('script')
scriptNode.src = chrome.runtime.getURL('js/core.js')
document.documentElement.appendChild(scriptNode)
scriptNode.onload = function () {
	// Initial load: Fetch groups and pass to page script
	chrome.storage.local.get(['groups'], (result) => {
		if (result.groups) {
			// result.groups is now an Object, no need to parse
			window.dispatchEvent(new CustomEvent('getGroups', { detail: result.groups }))
		}
	})
}

// Listen for storage changes from Background and forward to Page Script
chrome.storage.onChanged.addListener((changes, namespace) => {
	if (namespace === 'local' && changes.groups) {
		const newGroups = changes.groups.newValue
		window.dispatchEvent(new CustomEvent('getGroups', { detail: newGroups }))
	}
})

// Listen for updates from Page Script and save to storage
window.addEventListener('saveGroupsInfo', (event: any) => {
	saveGroupsInfo(event.detail)
})

export function saveGroupsInfo(groups: { [key: number]: string[] }) {
	// Save as object, no need to stringify
	chrome.storage.local.set({
		groups,
		lastUpdated: Date.now(),
	})
}
