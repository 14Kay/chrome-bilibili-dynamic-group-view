import type { Tag } from '../services/BilibiliApi'
/* eslint-disable no-console */
import type { Group } from '../types'
import { BilibiliApi } from '../services/BilibiliApi'
import { TagBar } from '../ui/TagBar'
import { DynamicListObserver } from '../utils/Observer'

export class GroupManager {
	private groups: Group = {}
	private currentTagId: number = 0
	private tagBar: TagBar
	private observer: DynamicListObserver

	constructor() {
		this.tagBar = new TagBar(this.handleTagClick.bind(this))
		this.observer = new DynamicListObserver(this.processDynamicCard.bind(this))
	}

	public async init() {
		window.addEventListener('getGroups', (event: any) => {
			const newGroups = event.detail
			this.groups = newGroups
			console.log('[GroupManager] Received groups from bridge', this.groups)

			if (this.currentTagId !== 0) {
				this.filterAllExistingItems()
			}
		})

		const tags = await BilibiliApi.getTags()
		this.setupUI(tags)
	}

	private updateAndSaveGroups(newGroups: Group) {
		this.groups = newGroups
		this.saveGroupsInfo(newGroups)

		if (this.currentTagId !== 0) {
			this.filterAllExistingItems()
		}
	}

	private async refreshGroups() {
		try {
			const followings = await BilibiliApi.fetchAllFollowing()
			const groupedFollowings = followings.reduce((acc, item) => {
				const tags = item.tag ?? [0]
				tags.forEach((tag) => {
					acc[tag] = acc[tag] ?? []
					acc[tag].push(item.uname)
				})
				return acc
			}, {} as Group)

			this.updateAndSaveGroups(groupedFollowings)
		} catch (error) {
			console.error('[GroupManager] Failed to manual refresh groups', error)
		}
	}

	private saveGroupsInfo(data: Group) {
		window.dispatchEvent(new CustomEvent('saveGroupsInfo', { detail: data }))
	}

	private setupUI(tags: Tag[]) {
		const inject = () => {
			const selectors = [
				'.bili-dyn-list',
				'div[class^="bili-dyn-list"]',
			]

			let targetNode: Element | null = null

			for (const selector of selectors) {
				targetNode = document.querySelector(selector)
				if (targetNode) {
					console.log(`[GroupManager] Found target node using selector: ${selector}`)
					break
				}
			}

			if (targetNode?.parentNode) {
				// Check if already injected
				if (document.querySelector('.chrome-bili-tags')) {
					console.log('[GroupManager] Tag bar already exists. Skipping.')
					return true
				}

				try {
					const tagsDom = this.tagBar.render(tags)
					// Insert before the target node (usually the feed list)
					targetNode.parentNode.insertBefore(tagsDom, targetNode)
					console.log('[GroupManager] UI injected successfully')
					return true
				} catch (e) {
					console.error('[GroupManager] Injection failed:', e)
					return false
				}
			}
			return false
		}

		// Try immediately
		console.log('[GroupManager] Attempting initial injection...')
		if (inject())
			return

		// If not found, wait for it
		console.log('[GroupManager] Target not found. Starting MutationObserver...')
		let retryCount = 0
		const observer = new MutationObserver((mutations, obs) => {
			// Debounce logging slightly
			if (retryCount % 50 === 0) {
				console.log(`[GroupManager] Observer retry #${retryCount}`)
			}
			retryCount++

			if (inject()) {
				console.log('[GroupManager] Injection via Observer success. Disconnecting.')
				obs.disconnect()
			}
		})

		// Observe body for subtree changes to catch async rendering
		observer.observe(document.body, {
			childList: true,
			subtree: true,
		})

		// Safety fallback: Check every 1s for 10 seconds just in case Observer misses deeply nested shadow changes (unlikely but safe)
		let intervalCount = 0
		const interval = setInterval(() => {
			intervalCount++
			if (inject()) {
				clearInterval(interval)
				observer.disconnect()
			}
			if (intervalCount > 10)
				clearInterval(interval)
		}, 1000)
	}

	private handleTagClick(tagId: number) {
		this.currentTagId = tagId

		if (tagId === 0) {
			this.observer.stop()
			this.resetDisplay()
		} else {
			// Start observing for new items (infinite scroll)
			this.observer.start()
			// Filter existing items
			this.filterAllExistingItems()
		}
	}

	private filterAllExistingItems() {
		const dynamicItems = document.querySelectorAll('.bili-dyn-list__item') as NodeListOf<HTMLElement>
		dynamicItems.forEach(item => this.processDynamicCard(item))
	}

	private processDynamicCard(item: HTMLElement) {
		if (this.currentTagId === 0) {
			item.style.display = ''
			return
		}

		const nameEle = item.querySelector('.bili-dyn-title__text')
		const name = nameEle?.textContent?.trim()

		const currentGroupMembers = this.groups[this.currentTagId] || []

		if (name && currentGroupMembers.includes(name)) {
			item.style.display = ''
		} else {
			item.style.display = 'none'
		}
	}

	private resetDisplay() {
		const dynamicItems = document.querySelectorAll('.bili-dyn-list__item') as NodeListOf<HTMLElement>
		dynamicItems.forEach((item) => {
			item.style.display = ''
		})
	}
}
