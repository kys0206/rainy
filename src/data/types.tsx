export type Slide = {
  _id: string
  id: string
  isPublic: boolean
  title: string
  content: string
  imgName: string
  author?: string
}

export type City = {
  _id: string
  city_name: string
  short_name: string
  imgName: string
}

export type District = {
  _id: string
  city_name: string
  si_gu_name: string
  place_name: string
  web_url: string
}

export type Trip = {
  _id: string
  city_name: string
  si_gu_name: string
  place_name: string
  contact: string
  imgName: string
  address: string
  web_url: string
  short_info: string
  tags: string[]
}

export type Restaurant = {
  _id: string
  city_name: string
  si_gu_name: string
  store_name: string
  contact: string
  imgName: string
  address: string
  short_info: string
  tags: string[]
}

export type Festival = {
  id: string
  city_id: string
  city_name: string
  si_gu_name: string
  status: string // 진행중 / 종료
  title: string
  festival_start: string // 축제시작기간
  festival_end: string // 축제마감기간
  festival_info: string
  content: string
  address: string
  entrace_fee: string // 이용요금
  contact: string
  imgName: string
  web_url: string
}
