export type Category = { id: string; label: string; emoji: string }

export type MenuItem = { name: string; price: number; img?: string }

export type PagoMovilInfo = { banco: string; telefono: string; cedula: string }

export type Restaurant = {
  id: string
  name: string
  category: string
  rating: number
  time: string
  deliveryFee: number
  tag: string | null
  img: string
  items: MenuItem[]
  active: boolean
  pagoMovil?: PagoMovilInfo
  createdAt: number
}
