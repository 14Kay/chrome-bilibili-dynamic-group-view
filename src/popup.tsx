/* eslint-disable style/jsx-indent-props */
import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'

// Simple SVG Icons
function RefreshIcon() {
	return (
		<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<path d="M23 4v6h-6"></path>
			<path d="M1 20v-6h6"></path>
			<path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
		</svg>
	)
}

function TimeIcon() {
	return (
		<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<circle cx="12" cy="12" r="10"></circle>
			<polyline points="12 6 12 12 16 14"></polyline>
		</svg>
	)
}

function Popup() {
	const [lastUpdated, setLastUpdated] = useState<string>('从未同步')
	const [loading, setLoading] = useState(false)

	const loadLastUpdated = () => {
		chrome.storage.local.get(['lastUpdated'], (result) => {
			if (result.lastUpdated) {
				const date = new Date(result.lastUpdated)
				setLastUpdated(date.toLocaleString())
			}
		})
	}

	useEffect(() => {
		loadLastUpdated()
	}, [])

	const handleRefresh = () => {
		setLoading(true)
		chrome.runtime.sendMessage({ type: 'FORCE_REFRESH_GROUPS' }, (response) => {
			// Add a small delay for better UX so the spinner is visible
			setTimeout(() => {
				setLoading(false)
				if (response && response.success) {
					loadLastUpdated()
				}
			}, 600)
		})
	}

	return (
		<div className="popup-container">
			<div className="header">
				<h1>B站动态分组助手</h1>
			</div>

			<div className="status-card">
				<span className="label">最近同步时间</span>
				<div className="time">
					<TimeIcon />
					<span>{lastUpdated}</span>
				</div>
			</div>

			<div>
				<button
					className="refresh-btn"
					onClick={handleRefresh}
					disabled={loading}
				>
					{loading ? <div className="spinner"></div> : <RefreshIcon />}
					<span>{loading ? '正在同步...' : '立即同步'}</span>
				</button>
			</div>

			<div className="footer">
				<a href="https://github.com/14Kay" target="_blank" rel="noopener noreferrer">
					Designed by 14K
				</a>
			</div>
		</div>
	)
}

const root = createRoot(document.getElementById('root')!)

root.render(
	<React.StrictMode>
		<Popup />
	</React.StrictMode>,
)
