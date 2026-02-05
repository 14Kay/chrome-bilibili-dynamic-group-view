import type { Following } from '../types'

export interface Tag {
	tagid: number
	name: string
	count: number
	tip: string
}

export class BilibiliApi {
	private static async send<T>(url: string): Promise<T> {
		const response = await fetch(url, {
			credentials: 'include',
		})
		const text = await response.text()
		const json = JSON.parse(text)
		return json.data
	}

	public static async getTags(): Promise<Tag[]> {
		return this.send<Tag[]>('https://api.bilibili.com/x/relation/tags')
	}

	public static async getProfile(): Promise<{ uid: number, name: string }> {
		return this.send('https://api.live.bilibili.com/User/getUserInfo')
	}

	public static async getFollowing(uid: number, pageNumber: number, pageSize: number = 50): Promise<{ list: Following, total: number, re_version: number }> {
		return await this.send(`https://api.bilibili.com/x/relation/followings?vmid=${uid}&pn=${pageNumber}&ps=${pageSize}`)
	}

	public static async fetchAllFollowing(): Promise<Following[]> {
		const profile = await this.getProfile()
		const uid = profile.uid
		const pageSize = 50
		let pageNumber = 1
		let following: any[] = []
		let total = Infinity

		while (following.length < total) {
			const response = await this.getFollowing(uid, pageNumber, pageSize)
			const list = Array.isArray(response.list) ? response.list : []
			following = following.concat(list)
			total = response.total
			pageNumber++
		}

		return following
	}
}
