import { useRef, useState, type FormEvent } from 'react'
import {
  Check,
  ImagePlus,
  Plus,
  RotateCcw,
  Trash2,
  Upload,
} from 'lucide-react'
import { useCatalog } from '../../context/CatalogContext'
import { fileToCompressedDataUrl } from '../../lib/image'
import { formatRD } from '../../lib/whatsapp'
import { Button } from '../../components/Button'
import { Field, Input, TextArea } from '../../components/Field'

export function MenuAdminPage() {
  const {
    dishes,
    addDish,
    updateDish,
    toggleDishAvailable,
    removeDish,
    resetCatalog,
  } = useCatalog()
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [image, setImage] = useState('')
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const [editingPrice, setEditingPrice] = useState<Record<string, string>>({})
  const [savedId, setSavedId] = useState<string | null>(null)

  async function handleNewImage(files: FileList | null) {
    if (!files?.[0]) return
    setFormError('')
    try {
      const dataUrl = await fileToCompressedDataUrl(files[0])
      setImage(dataUrl)
    } catch {
      setFormError('No se pudo procesar la foto.')
    }
  }

  async function handleReplaceImage(dishId: string, files: FileList | null) {
    if (!files?.[0]) return
    try {
      const dataUrl = await fileToCompressedDataUrl(files[0])
      updateDish(dishId, { image: dataUrl })
      setSavedId(dishId)
      window.setTimeout(() => setSavedId(null), 1500)
    } catch {
      window.alert('No se pudo actualizar la foto.')
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setFormError('')
    const priceNum = Number(price)
    if (!name.trim()) {
      setFormError('Escribe el nombre del plato.')
      return
    }
    if (!priceNum || priceNum <= 0) {
      setFormError('El precio debe ser mayor a 0.')
      return
    }
    if (!image) {
      setFormError('Sube una foto del plato.')
      return
    }

    setSaving(true)
    try {
      addDish({
        name: name.trim(),
        description: description.trim(),
        price: priceNum,
        image,
      })
      setName('')
      setDescription('')
      setPrice('')
      setImage('')
    } finally {
      setSaving(false)
    }
  }

  function savePrice(dishId: string) {
    const raw = editingPrice[dishId]
    if (raw === undefined) return
    const value = Number(raw)
    if (!value || value <= 0) {
      window.alert('Precio inválido')
      return
    }
    updateDish(dishId, { price: value })
    setEditingPrice((prev) => {
      const next = { ...prev }
      delete next[dishId]
      return next
    })
    setSavedId(dishId)
    window.setTimeout(() => setSavedId(null), 1500)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.16em] text-brand-600 uppercase">
            Catálogo
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-navy-800">
            Menú y precios
          </h1>
          <p className="mt-1 text-sm text-muted">
            Sube fotos y actualiza precios. Se guarda en este navegador.
          </p>
        </div>
        <Button
          variant="ghost"
          className="!min-h-0 shrink-0 !px-3 !py-2 text-xs"
          icon={<RotateCcw className="h-3.5 w-3.5" strokeWidth={1.75} />}
          onClick={() => {
            if (
              window.confirm(
                '¿Restaurar el menú demo original? Se perderán fotos y precios editados.',
              )
            ) {
              resetCatalog()
            }
          }}
        >
          Restaurar
        </Button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-[1.75rem] bg-white/85 p-4 shadow-sm ring-1 ring-white"
      >
        <div className="flex items-center gap-2">
          <Upload className="h-4 w-4 text-navy-800" strokeWidth={1.75} />
          <h2 className="text-base font-semibold text-navy-800">
            Agregar plato
          </h2>
        </div>

        <Field label="Nombre">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Pollo a la plancha con yuca"
          />
        </Field>

        <Field label="Descripción">
          <TextArea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ingredientes / detalle corto"
            rows={2}
          />
        </Field>

        <Field label="Precio (RD$)">
          <Input
            type="number"
            min={1}
            inputMode="numeric"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="350"
          />
        </Field>

        <div>
          <span className="mb-1.5 block text-xs font-medium tracking-[0.12em] text-muted uppercase">
            Foto
          </span>
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-warm px-4 py-7 text-center transition hover:border-brand-400">
            <ImagePlus className="h-6 w-6 text-muted" strokeWidth={1.75} />
            <span className="mt-2 text-sm font-medium text-navy-800">
              Subir foto del plato
            </span>
            <span className="mt-1 text-xs text-muted">
              Se comprime automáticamente
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleNewImage(e.target.files)}
            />
          </label>
          {image && (
            <img
              src={image}
              alt="Vista previa"
              className="mt-3 h-36 w-full rounded-2xl object-cover"
            />
          )}
        </div>

        {formError && (
          <p className="text-xs font-medium text-red-600">{formError}</p>
        )}

        <Button type="submit" variant="accent" fullWidth disabled={saving}>
          <Plus className="h-4 w-4" strokeWidth={1.75} />
          {saving ? 'Guardando…' : 'Publicar plato'}
        </Button>
      </form>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-navy-800">
            Platos del menú
          </h2>
          <span className="text-xs text-muted">
            {dishes.filter((d) => d.available !== false).length} disponibles ·{' '}
            {dishes.length} total
          </span>
        </div>

        {dishes.map((dish) => {
          const priceDraft = editingPrice[dish.id]
          const isEditing = priceDraft !== undefined

          return (
            <article
              key={dish.id}
              className={`rounded-[1.5rem] bg-white/85 p-3 shadow-sm ring-1 ring-white ${
                dish.available !== false ? '' : 'opacity-70'
              }`}
            >
              <div className="flex gap-3">
                <button
                  type="button"
                  className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-warm"
                  onClick={() => fileRefs.current[dish.id]?.click()}
                  title="Cambiar foto"
                >
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-navy-900/55 py-1 text-center text-[9px] font-semibold text-white">
                    Cambiar foto
                  </span>
                  <input
                    ref={(el) => {
                      fileRefs.current[dish.id] = el
                    }}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleReplaceImage(dish.id, e.target.files)
                    }
                  />
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold text-navy-800">
                        {dish.name}
                      </h3>
                      <p className="mt-0.5 line-clamp-2 text-xs text-muted">
                        {dish.description}
                      </p>
                      <span
                        className={`mt-1.5 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          dish.available !== false
                            ? 'bg-brand-100 text-brand-700'
                            : 'bg-warm text-muted'
                        }`}
                      >
                        {dish.available !== false ? 'Disponible' : 'No disponible'}
                      </span>
                    </div>
                    {savedId === dish.id && (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-semibold text-brand-700">
                        <Check className="h-3 w-3" />
                        OK
                      </span>
                    )}
                  </div>

                  <div className="mt-2.5 flex flex-wrap items-center gap-2">
                    {isEditing ? (
                      <>
                        <input
                          type="number"
                          min={1}
                          value={priceDraft}
                          onChange={(e) =>
                            setEditingPrice((prev) => ({
                              ...prev,
                              [dish.id]: e.target.value,
                            }))
                          }
                          className="w-24 rounded-xl border border-line bg-warm px-2.5 py-2 text-sm font-semibold text-navy-800 outline-none focus:border-navy-800"
                        />
                        <Button
                          variant="primary"
                          className="!min-h-0 !px-3 !py-2 text-xs"
                          onClick={() => savePrice(dish.id)}
                        >
                          Guardar
                        </Button>
                        <Button
                          variant="ghost"
                          className="!min-h-0 !px-2 !py-2 text-xs"
                          onClick={() =>
                            setEditingPrice((prev) => {
                              const next = { ...prev }
                              delete next[dish.id]
                              return next
                            })
                          }
                        >
                          Cancelar
                        </Button>
                      </>
                    ) : (
                      <>
                        <span className="text-sm font-bold text-navy-800">
                          {formatRD(dish.price)}
                        </span>
                        <Button
                          variant="secondary"
                          className="!min-h-0 !px-3 !py-2 text-xs"
                          onClick={() =>
                            setEditingPrice((prev) => ({
                              ...prev,
                              [dish.id]: String(dish.price),
                            }))
                          }
                        >
                          Editar precio
                        </Button>
                      </>
                    )}

                    <button
                      type="button"
                      role="switch"
                      aria-checked={dish.available !== false}
                      aria-label={
                        dish.available !== false
                          ? `Inactivar ${dish.name}`
                          : `Activar ${dish.name}`
                      }
                      onClick={() => toggleDishAvailable(dish.id)}
                      className={`ml-auto inline-flex items-center gap-1.5 rounded-full px-2.5 py-2 text-xs font-semibold transition ${
                        dish.available !== false
                          ? 'bg-brand-100 text-brand-700'
                          : 'bg-warm text-muted'
                      }`}
                    >
                      <span
                        className={`relative h-4 w-7 rounded-full transition ${
                          dish.available !== false ? 'bg-brand-600' : 'bg-line'
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 h-3 w-3 rounded-full bg-white shadow-sm transition ${
                            dish.available !== false ? 'left-3.5' : 'left-0.5'
                          }`}
                        />
                      </span>
                      {dish.available !== false ? 'Activo' : 'Inactivo'}
                    </button>

                    <Button
                      variant="ghost"
                      className="!min-h-0 !px-2 !py-2 text-xs text-red-600"
                      icon={<Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />}
                      onClick={() => {
                        if (
                          window.confirm(
                            `¿Eliminar "${dish.name}" del menú?`,
                          )
                        ) {
                          removeDish(dish.id)
                        }
                      }}
                    >
                      Quitar
                    </Button>
                  </div>
                </div>
              </div>
            </article>
          )
        })}
      </section>
    </div>
  )
}
