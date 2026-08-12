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

/** Logo liviano según tamaño de UI (evita cargar el PNG grande). */
function logoSrc(size: NonNullable<BrandMarkProps['size']>): string {
  if (size === 'hero' || size === 'lg') return '/brand/logo-hero.webp'
  if (size === 'md') return '/brand/logo-md.webp'
  return '/brand/logo-sm.webp'
}

export function BrandMark({ size = 'md', className = '' }: BrandMarkProps) {
  const s = px[size]

  return (
    <img
      src={logoSrc(size)}
      alt="Sano & Sabroso"
      width={s}
      height={s}
      className={[
        box[size],
        'shrink-0 rounded-full object-contain bg-transparent',
        className,
      ].join(' ')}
      decoding="async"
      fetchPriority={size === 'hero' ? 'high' : 'low'}
    />
  )
}
