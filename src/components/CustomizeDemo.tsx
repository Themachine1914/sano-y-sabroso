import { useState } from 'react'
import { DEMO, demoWhatsAppNumber } from '../lib/demo-mode'

type Props = {
  offsetClass?: string
}

export function CustomizeDemo({ offsetClass = 'bottom-24' }: Props) {
  const [open, setOpen] = useState(false)
  const [solicitud, setSolicitud] = useState('')
  const [presupuesto, setPresupuesto] = useState('')
  const [fecha, setFecha] = useState('')
  const [done, setDone] = useState(false)

  function submit() {
    const text = solicitud.trim()
    if (!text) return

    const leadId =
      window.localStorage.getItem('facilapp_lead_id') || `local-${Date.now()}`
    const payload = {
      leadId,
      categoria: DEMO.categoria,
      solicitud: text,
      presupuesto: presupuesto.trim() || null,
      fechaInicio: fecha || null,
      timestamp: new Date().toISOString(),
    }
    try {
      const prev = JSON.parse(
        window.localStorage.getItem('facilapp_customize_leads') || '[]',
      ) as unknown[]
      window.localStorage.setItem(
        'facilapp_customize_leads',
        JSON.stringify([...prev, payload]),
      )
    } catch {
      /* ignore */
    }

    const negocio =
      window.localStorage.getItem('facilapp_lead_negocio') || 'mi negocio'
    const msg = [
      `Hola, vengo de FacilApp. Probé la demo de ${DEMO.categoria}.`,
      `Mi negocio es ${negocio}.`,
      `Quiero esto, pero con: ${text}.`,
      '¿Me armas algo a la medida?',
    ].join('\n')

    window.open(
      `https://wa.me/${demoWhatsAppNumber()}?text=${encodeURIComponent(msg)}`,
      '_blank',
      'noopener,noreferrer',
    )
    setDone(true)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true)
          setDone(false)
        }}
        className={`fixed right-4 z-40 rounded-[10px] bg-[#00A8A8] px-3 py-2.5 text-sm font-semibold text-white shadow-[0_1px_2px_rgb(15_23_42/6%)] ${offsetClass}`}
      >
        Personaliza esta demo
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-4 sm:items-center">
          <div className="w-full max-w-md rounded-[10px] border border-[#E2E8F0] bg-white p-5 shadow-[0_1px_2px_rgb(15_23_42/6%)]">
            {done ? (
              <p className="text-sm font-medium text-[#0F172A]">
                Listo. Te escribimos en menos de 24h.
              </p>
            ) : (
              <>
                <h2 className="text-lg font-semibold text-[#0F172A]">
                  ¿Qué te gustaría diferente?
                </h2>
                <textarea
                  className="mt-3 w-full rounded-[10px] border border-[#E2E8F0] p-3 text-sm"
                  rows={4}
                  value={solicitud}
                  onChange={(e) => setSolicitud(e.target.value)}
                  placeholder="Ej. quiero zonas de delivery y combo del día"
                />
                <label className="mt-3 block text-xs text-[#475569]">
                  Presupuesto estimado (opcional)
                  <input
                    className="mt-1 w-full rounded-[10px] border border-[#E2E8F0] p-2 text-sm"
                    value={presupuesto}
                    onChange={(e) => setPresupuesto(e.target.value)}
                    placeholder="RD$ 15,000 / mes"
                  />
                </label>
                <label className="mt-3 block text-xs text-[#475569]">
                  Fecha de inicio (opcional)
                  <input
                    type="date"
                    className="mt-1 w-full rounded-[10px] border border-[#E2E8F0] p-2 text-sm"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                  />
                </label>
                <button
                  type="button"
                  onClick={submit}
                  disabled={!solicitud.trim()}
                  className="mt-4 w-full rounded-[10px] bg-[#0B3A6E] py-2.5 text-sm font-semibold text-white disabled:opacity-40"
                >
                  Enviar mi solicitud
                </button>
              </>
            )}
            <button
              type="button"
              className="mt-2 w-full py-2 text-sm text-[#475569]"
              onClick={() => setOpen(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      ) : null}
    </>
  )
}
