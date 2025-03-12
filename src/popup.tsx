import React, { useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'

function Popup() {
	const buttonsRef = useRef<any>(null)
	const animateButton = (e: React.MouseEvent) => {
		e.preventDefault()
		const target = e.target as HTMLElement
		chrome.storage.local.set({
			groups: JSON.stringify({}),
		})
		target.classList.remove('animate')
		target.classList.add('animate')
		setTimeout(() => {
			target.classList.remove('animate')
		}, 700)
	}

	useEffect(() => {
		buttonsRef.current = document.getElementsByClassName(
			'bubbly-button',
		) as any

		if (buttonsRef.current) {
			Array.from(buttonsRef.current).forEach((button: any) => {
				button.addEventListener('click', animateButton)
			})
		}

		return () => {
			if (buttonsRef.current) {
				Array.from(buttonsRef.current).forEach((button: any) => {
					button.removeEventListener('click', animateButton)
				})
			}
		}
	}, [])

	return (
		<>
			<div>
				<button className="bubbly-button">刷新分组数据</button>
			</div>
		</>
	)
}

const root = createRoot(document.getElementById('root')!)

root.render(
	<React.StrictMode>
		<Popup />
	</React.StrictMode>,
)
