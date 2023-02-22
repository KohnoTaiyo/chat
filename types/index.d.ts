export type LoginUser = {
  name?: string
  image?: string
}

export type Room = {
  id?: string
  title: string
  updatedAt: Date
}

export type Text = {
  createdAt: Date
  image: string
  name: string
  text: string
  userId: string
}
