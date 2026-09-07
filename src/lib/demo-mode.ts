export const DEMO = {
  banner: 'DEMO FacilApp — datos de prueba, no es una cuenta real',
  categoria: 'restaurante / carta + pedidos',
} as const

export function demoWhatsAppNumber(): string {
  return String(
    import.meta.env.VITE_FACILAPP_WHATSAPP || '18090000000',
  ).replace(/\D/g, '')
}
