import type { Order } from './orders'

// Número del negocio en formato internacional sin "+" (ej: 584121234567).
export const WHATSAPP_BUSINESS_NUMBER = ''

export const mapsUrl = (lat: number, lng: number) => `https://www.google.com/maps?q=${lat},${lng}`

export function buildOrderMessage(order: Order): string {
  const lines = order.items.map(i => `• ${i.qty}× ${i.name} — $ ${(i.qty * i.price).toFixed(2)}`)
  return [
    `🛵 *Nuevo pedido Boombly* (${order.id})`,
    `🍽️ Restaurante: ${order.restaurantName}`,
    `👤 Cliente: ${order.customerName} (${order.customerId})`,
    `📱 Teléfono: ${order.customerPhone}`,
    order.location ? `📍 Ubicación: ${mapsUrl(order.location.lat, order.location.lng)}` : '',
    order.payment ? `💳 Pago móvil — Ref: ${order.payment.reference} (capture adjunto en el pedido)` : '',
    '',
    ...lines,
    '',
    `Subtotal: $ ${order.subtotal.toFixed(2)}`,
    `Envío: $ ${order.deliveryFee.toFixed(2)}`,
    `*Total: $ ${order.total.toFixed(2)}*`,
  ]
    .filter((l, i, arr) => l !== '' || arr[i - 1] !== '')
    .join('\n')
}

// PUNTO ÚNICO DE INTEGRACIÓN: se llama una vez por cada pedido confirmado.
// Aquí conecta tu API de WhatsApp (idealmente desde un backend para no exponer el token),
// usando `WHATSAPP_BUSINESS_NUMBER` y `buildOrderMessage(order)`.
export async function notifyOrderByWhatsApp(order: Order): Promise<void> {
  const message = buildOrderMessage(order)
  console.info('[WhatsApp] pendiente de integrar API →', WHATSAPP_BUSINESS_NUMBER || '(sin número)', '\n' + message)
}
