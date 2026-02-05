import type { Group } from '../dynamic/types'
/* eslint-disable no-console */
import { BilibiliApi } from '../dynamic/services/BilibiliApi'

const ALARM_NAME = 'refreshGroups'
const REFRESH_PERIOD_MINUTES = 720

chrome.runtime.onInstalled.addListener(() => {
	chrome.alarms.get(ALARM_NAME, (alarm) => {
		chrome.alarms.create(ALARM_NAME, { periodInMinutes: REFRESH_PERIOD_MINUTES })
		if (!alarm) {
			refreshGroups()
		}
	})
})

chrome.alarms.onAlarm.addListener((alarm) => {
	if (alarm.name === ALARM_NAME) {
		refreshGroups()
	}
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.type === 'FORCE_REFRESH_GROUPS') {
		refreshGroups().then(() => sendResponse({ success: true }))
		return true
	}
})

async function refreshGroups() {
	try {
		console.log('[Background] Refreshing groups...')
		const followings = await BilibiliApi.fetchAllFollowing()
		const groupedFollowings = followings.reduce((acc, item) => {
			const tags = item.tag ?? [0]
			tags.forEach((tag) => {
				acc[tag] = acc[tag] ?? []
				acc[tag].push(item.uname)
			})
			return acc
		}, {} as Group)

		await chrome.storage.local.set({ groups: groupedFollowings, lastUpdated: Date.now() })
		console.log('[Background] Groups refreshed and saved to storage.')
	} catch (error) {
		console.error('[Background] Failed to refresh groups', error)
	}
}
