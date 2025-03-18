import type { Following, Group } from './types'

let groups: Group = {}
let currentId = 0
let isObserve = false

window.addEventListener('getGroups', (event: any) => {
	groups = event.detail
})

async function getTags(): Promise<{ tagid: number, name: string, count: number, tip: string }[]> {
	return send('https://api.bilibili.com/x/relation/tags')
}

async function getProfile() {
	return send('https://api.live.bilibili.com/User/getUserInfo')
}

async function getFollowing(uid: number, pageNumber: number, pageSize: number = 50): Promise<{ list: Following, total: number, re_version: number }> {
	return await send(`https://api.bilibili.com/x/relation/followings?vmid=${uid}&pn=${pageNumber}&ps=${pageSize}`)
}

function saveGroupsInfo(data: Group) {
	window.dispatchEvent(new CustomEvent('saveGroupsInfo', { detail: data }))
}

function reset() {
	const dynamicItems = document.querySelectorAll('.bili-dyn-list__item') as NodeListOf<HTMLElement>
	dynamicItems.forEach((item: HTMLElement) => {
		item.style.display = 'block'
	})
}

async function send(url: string) {
	return await fetch(url, {
		credentials: 'include',
	})
		.then(response => response.text())
		.then(text => JSON.parse(text).data)
}

const dynamicCardObserver = new MutationObserver((mutationsList) => {
	mutationsList.forEach((mutation) => {
		if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
			mutation.addedNodes.forEach((node) => {
				if (node.nodeType === Node.ELEMENT_NODE) {
					const element = node as HTMLElement
					if (element.classList.contains('bili-dyn-list__item')) {
						const nameEle = element.querySelector('.bili-dyn-title__text')
						if (nameEle) {
							const name = nameEle.textContent?.trim()
							if (!groups[currentId].includes(name || '')) {
								element.style.display = 'none'
							}
						}
					}
				}
			})
		}
	})
})

async function fetchAllFollowing(): Promise<Following[]> {
	const profile = await getProfile()
	const uid = profile.uid
	const pageSize = 50
	let pageNumber = 1
	let following: any[] = []
	let total = Infinity

	while (following.length < total) {
		const response = await getFollowing(uid, pageNumber, pageSize)
		following = following.concat(response.list)
		total = response.total
		pageNumber++
	}

	return following
}

async function setGroups() {
	const followings = await fetchAllFollowing()
	const groupedFollowings = followings.reduce((acc, item) => {
		const tags = item.tag ?? [0]
		tags.forEach((tag) => {
			acc[tag] = acc[tag] ?? []
			acc[tag].push(item.uname)
		})
		return acc
	}, {} as Group)
	groups = groupedFollowings
	saveGroupsInfo(groupedFollowings)
}

function addMouseWheelListener(element: HTMLElement) {
	element.addEventListener('wheel', (event: WheelEvent) => {
		const tablist = element.querySelector('.chorme-bili-tags') as HTMLElement
		if (tablist && event.target instanceof HTMLElement && tablist.contains(event.target)) {
			event.preventDefault()
			tablist.scrollBy({
				left: event.deltaY < 0 ? -150 : 150,
				behavior: 'smooth',
			})
		}
	})
}

function highlightMove(left: number) {
	const highlight = document.querySelector('.chorme-bili-tags > .bili-dyn-list-tabs__highlight') as HTMLElement
	if (highlight) {
		highlight.style.transform = `translateX(${left}px)`
	}
}

async function main() {
	const tags = await getTags()
	const filterTags = tags.filter(item => item.count !== 0)
	if (!groups || Object.keys(groups).length === 0) {
		await setGroups()
	}
	const tagsHTML = `
        <div class='chorme-bili-tags'>
            <ul>
                <li class='bili-dyn-list-tabs__item fs-medium active'>全部</li>
                ${filterTags.map(item => `<li class='bili-dyn-list-tabs__item fs-medium'>${item.name}</li>`).join('')}
            </ul>
			<div class='bili-dyn-list-tabs__highlight'></div>
        </div>
		`

	const tempDiv = document.createElement('div')
	tempDiv.innerHTML = tagsHTML

	const biliDynList = document.querySelector('.bili-dyn-list')
	if (biliDynList?.parentNode) {
		const tagsDom = tempDiv.firstElementChild
		const tablistContainer = document.querySelector('#app') as HTMLElement

		if (tablistContainer) {
			addMouseWheelListener(tablistContainer)
		}

		if (tagsDom) {
			biliDynList.parentNode.insertBefore(tagsDom, biliDynList)
			const ulElement = tagsDom.querySelector('ul')
			if (ulElement) {
				ulElement.addEventListener('click', event => handleTagClick(event, filterTags))
			}
		}
	}
}

function handleTagClick(event: Event, filterTags: { tagid: number, name: string, count: number, tip: string }[]) {
	if (!isObserve) {
		dynamicCardObserver.observe(document.querySelector('.bili-dyn-list__items')!, { childList: true, subtree: true })
		isObserve = true
	}

	const target = event.target as HTMLElement

	if (target.tagName === 'LI') {
		const ulElement = target.parentElement as HTMLElement
		const liElements = ulElement.querySelectorAll('li')

		liElements.forEach(item => item.classList.remove('active'))
		target.classList.add('active')

		const index = Array.from(ulElement.children).indexOf(target)
		highlightMove(liElements[index].offsetLeft + (liElements[index].offsetWidth / 2) - 7)
		if (index === 0) {
			isObserve = false
			dynamicCardObserver.disconnect()
			reset()
			return
		}

		currentId = filterTags[index - 1]?.tagid ?? 0
		filterDynamicsByTag(currentId)
	}
}

function filterDynamicsByTag(tagId: number) {
	const group = groups[tagId]
	const dynamicItems = document.querySelectorAll('.bili-dyn-list__item') as NodeListOf<HTMLElement>

	dynamicItems.forEach((item) => {
		const nameEle = item.querySelector('.bili-dyn-title__text')
		const name = nameEle?.textContent?.trim() ?? ''
		if (!group.includes(name)) {
			item.style.display = 'none'
		} else {
			item.style.display = ''
		}
	})
}
main()
