import type { Tag } from '../services/BilibiliApi'

export class TagBar {
	private container: HTMLElement
	private onTagClick: (tagId: number) => void

	constructor(onTagClick: (tagId: number) => void) {
		this.onTagClick = onTagClick
		this.container = document.createElement('div')
	}

	public render(tags: Tag[]): HTMLElement {
		const filterTags = tags.filter(item => item.count !== 0)
		const tagsHTML = `
            <div class='chrome-bili-tags'>
                <ul>
                    <li class='bili-dyn-list-tabs__item fs-medium active' data-tag-id="0">全部</li>
                    ${filterTags.map(item => `<li class='bili-dyn-list-tabs__item fs-medium' data-tag-id="${item.tagid}">${item.name}</li>`).join('')}
                </ul>
                <div class='bili-dyn-list-tabs__highlight'></div>
            </div>
        `
		this.container.innerHTML = tagsHTML
		const root = this.container.firstElementChild as HTMLElement

		if (root) {
			this.addMouseWheelListener(root)
			const ulElement = root.querySelector('ul')
			if (ulElement) {
				ulElement.addEventListener('click', event => this.handleTagClick(event, filterTags))
			}
		}

		return root
	}

	private addMouseWheelListener(element: HTMLElement) {
		element.addEventListener('wheel', (event: WheelEvent) => {
			const tablist = element as HTMLElement
			if (tablist && event.target instanceof HTMLElement && tablist.contains(event.target)) {
				// Determine if scrolling horizontally
				if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
					event.preventDefault()
					tablist.scrollBy({
						left: event.deltaY < 0 ? -150 : 150,
						behavior: 'smooth',
					})
				}
			}
		})
	}

	private handleTagClick(event: Event, filterTags: Tag[]) {
		const target = event.target as HTMLElement

		if (target.tagName === 'LI') {
			const ulElement = target.parentElement as HTMLElement
			const liElements = ulElement.querySelectorAll('li')

			liElements.forEach(item => item.classList.remove('active'))
			target.classList.add('active')

			const index = Array.from(ulElement.children).indexOf(target)
			this.highlightMove(liElements[index].offsetLeft + (liElements[index].offsetWidth / 2) - 14) // Adjusted offset for centering

			// Get tag ID directly from logic or attribute
			let tagId = 0
			if (index > 0) {
				tagId = filterTags[index - 1]?.tagid ?? 0
			}

			this.onTagClick(tagId)
		}
	}

	private highlightMove(left: number) {
		const highlight = document.querySelector('.chrome-bili-tags > .bili-dyn-list-tabs__highlight') as HTMLElement
		if (highlight) {
			highlight.style.transform = `translateX(${left}px)`
		}
	}
}
