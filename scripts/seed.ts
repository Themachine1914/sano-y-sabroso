import { createClient } from '@supabase/supabase-js'
import { DISHES, INITIAL_CUSTOMERS, INITIAL_ORDERS } from '../src/data/mock'

async function main() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error(
      'Faltan SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY (correr con: node --env-file=.env.local node_modules/.bin/tsx scripts/seed.ts)',
    )
  }
  const supabase = createClient(url, key)

  const { count } = await supabase.from('dishes').select('id', { count: 'exact', head: true })
  if (count && count > 0) {
    console.log(`Ya hay ${count} platos en la base. No se vuelve a sembrar (idempotente).`)
    return
  }

  const { error: dishesError } = await supabase.from('dishes').insert(
    DISHES.map((d) => ({
      name: d.name,
      description: d.description,
      price: d.price,
      image_url: d.image,
      available: d.available !== false,
    })),
  )
  if (dishesError) throw dishesError
  console.log(`Sembrados ${DISHES.length} platos.`)

  const { error: customersError } = await supabase.from('customers').insert(
    INITIAL_CUSTOMERS.map((c) => ({
      name: c.name,
      phone: c.phone.replace(/\D/g, ''),
      last_address: c.lastAddress,
      last_order_at: c.lastOrderAt,
      order_count: c.orderCount,
    })),
  )
  if (customersError) throw customersError
  console.log(`Sembrados ${INITIAL_CUSTOMERS.length} clientes.`)

  const { error: ordersError } = await supabase.from('orders').insert(
    INITIAL_ORDERS.map((o) => ({
      customer_name: o.customerName,
      customer_phone: o.customerPhone.replace(/\D/g, ''),
      address: o.address,
      items: o.items,
      payment_method: o.paymentMethod,
      notes: o.notes,
      status: o.status,
      total: o.total,
      created_at: o.createdAt,
    })),
  )
  if (ordersError) throw ordersError
  console.log(`Sembrados ${INITIAL_ORDERS.length} pedidos.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
