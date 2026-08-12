interface BrandMarkProps {
  size?: 'sm' | 'md' | 'lg' | 'hero'
  className?: string
}

const box: Record<NonNullable<BrandMarkProps['size']>, string> = {
  sm: 'h-9 w-9',
  md: 'h-11 w-11',
  lg: 'h-24 w-24',
  hero: 'h-[132px] w-[132px] sm:h-[152px] sm:w-[152px]',
}

const px: Record<NonNullable<BrandMarkProps['size']>, number> = {
  sm: 36,
  md: 44,
  lg: 96,
  hero: 152,
}

export function BrandMark({ size = 'md', className = '' }: BrandMarkProps) {
  const s = px[size]

  return (
    <img
      src="/brand/logo.png?v=4"
      alt="Sano & Sabroso"
      width={s}
      height={s}
      className={[
        box[size],
        // Solo el círculo del logo (su borde propio), sin fondo blanco ni sombra
        'shrink-0 rounded-full object-contain bg-transparent',
        className,
      ].join(' ')}
      decoding="async"
    />
  )
}
