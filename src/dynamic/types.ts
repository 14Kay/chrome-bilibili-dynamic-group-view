export interface Following {
	mid: number
	attribute: number
	mtime: number
	special: number
	contract_info: IContractInfo
	uname: string
	face: string
	sign: string
	face_nft: number
	official_verify: IOfficialVerify
	vip: IVip
	name_render: INameRender
	nft_icon: string
	rec_reason: string
	track_id: string
	follow_time: string
	tag: null | number[]
}

interface IContractInfo {
}

interface IOfficialVerify {
	type: number
	desc: string
}

interface IVip {
	vipType: number
	vipDueDate: number
	dueRemark: string
	accessStatus: number
	vipStatus: number
	vipStatusWarn: string
	themeType: number
	label: ILabel
	avatar_subscript: number
	nickname_color: string
	avatar_subscript_url: string
}

interface INameRender {
}

interface ILabel {
	path: string
	text: string
	label_theme: string
	text_color: string
	bg_style: number
	bg_color: string
	border_color: string
}

export interface Group {
	[key: number]: string[]
}
