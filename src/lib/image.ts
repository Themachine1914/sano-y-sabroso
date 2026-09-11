/** Comprime y redimensiona una imagen para poder guardarla en localStorage. */
export function fileToCompressedDataUrl(
  file: File,
  maxWidth = 1000,
  quality = 0.8,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onerror = () => reject(new Error('No se pudo leer la imagen'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('Imagen inválida'))
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width)
        const width = Math.round(img.width * scale)
        const height = Math.round(img.height * scale)
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Canvas no disponible'))
          return
        }
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.src = String(reader.result)
    }

    reader.readAsDataURL(file)
  })
}

/** Sube una imagen (data URL, ya comprimida) a Supabase Storage vía /api/upload. */
export async function uploadImage(dataUrl: string): Promise<string> {
  const blob = await (await fetch(dataUrl)).blob()
  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': blob.type || 'image/jpeg' },
    credentials: 'include',
    body: blob,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || 'No se pudo subir la imagen')
  }
  const data = (await res.json()) as { url: string }
  return data.url
}
