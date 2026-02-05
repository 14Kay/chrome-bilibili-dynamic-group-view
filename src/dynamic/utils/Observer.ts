export class DynamicListObserver {
	private observer: MutationObserver
	private processNode: (element: HTMLElement) => void

	constructor(processNode: (element: HTMLElement) => void) {
		this.processNode = processNode
		this.observer = new MutationObserver(mutations => this.handleMutations(mutations))
	}

	private handleMutations(mutations: MutationRecord[]) {
		mutations.forEach((mutation) => {
			if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
				mutation.addedNodes.forEach((node) => {
					if (node.nodeType === Node.ELEMENT_NODE) {
						const element = node as HTMLElement
						if (element.classList.contains('bili-dyn-list__item')) {
							this.processNode(element)
						}
					}
				})
			}
		})
	}

	public start() {
		const listContainer = document.querySelector('.bili-dyn-list__items')
		if (listContainer) {
			this.observer.observe(listContainer, { childList: true, subtree: true })
		}
	}

	public stop() {
		this.observer.disconnect()
	}
}
