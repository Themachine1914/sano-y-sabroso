# Sano & Sabroso — Demo App

Demo mobile-first con **dos módulos** (como Tú Tenis RD + Bienestarte):

1. **Menú público** (`/`) — fotos de platos, carrito y pedido por WhatsApp  
2. **Panel del dueño** (`/admin`) — dashboard, pedidos, entregas y clientes (PIN)

**Negocio:** Sano & Sabroso · Santiago  
**WhatsApp:** +1 (849) 405-9209 · **IG:** [@sanoysabrosord](https://www.instagram.com/sanoysabrosord)

## Cómo correr

```bash
npm install
npm run dev
```

## Rutas

| Ruta | Módulo | Descripción |
|------|--------|-------------|
| `/` | Público | Inicio + destacados |
| `/menu` | Público | Catálogo con fotos |
| `/pedido` | Público | Checkout + WhatsApp al negocio |
| `/admin/login` | Dueño | PIN (`2026` en demo) |
| `/admin` | Dueño | Dashboard |
| `/admin/nuevo` | Dueño | Crear pedido manual |
| `/admin/pedidos` | Dueño | Estados y WhatsApp al cliente |
| `/admin/entregas` | Dueño | Ruta para el motorista |
| `/admin/clientes` | Dueño | Teléfono y dirección |

## Stack

React + Vite + TypeScript + Tailwind · datos mock + `localStorage`
