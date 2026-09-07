import { DEMO } from '../lib/demo-mode'

export function DemoBanner() {
  return (
    <div className="shrink-0 bg-[#0B3A6E] px-3 py-2 text-center text-xs font-semibold leading-snug text-white">
      {DEMO.banner}
    </div>
  )
}
