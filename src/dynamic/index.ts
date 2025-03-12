const scriptNode = document.createElement('script')
scriptNode.src = chrome.runtime.getURL('js/core.js')
document.documentElement.appendChild(scriptNode)
scriptNode.onload = function () {
	chrome.storage.local.get(['groups'], (result) => {
		if (result.groups) {
			window.dispatchEvent(new CustomEvent('getGroups', { detail: JSON.parse(result.groups) }))
		}
	})
}

window.addEventListener('saveGroupsInfo', (event: any) => {
	saveGroupsInfo(event.detail)
})

export function saveGroupsInfo(groups: { [key: number]: string[] }) {
	chrome.storage.local.set({
		groups: JSON.stringify(groups),
	})
}
