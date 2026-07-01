/* Renders a single tech logo. Uses Simple Icons CDN for most, an inline
   cloud for AWS (Amazon marks aren't on Simple Icons). */
export function TechIcon({ item, size = 26 }) {
  const { slug, color, name } = item

  if (slug === '__aws__') {
    return (
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill={color}
        aria-label={name}
        style={{ filter: `drop-shadow(0 0 6px ${color}55)` }}
      >
        <path d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
      </svg>
    )
  }

  return (
    <img
      src={`https://cdn.simpleicons.org/${slug}/${color.replace('#', '')}`}
      alt={name}
      width={size}
      height={size}
      draggable={false}
      loading="eager"
      style={{ width: size, height: size, objectFit: 'contain', filter: `drop-shadow(0 0 6px ${color}55)` }}
    />
  )
}

/* Glass chip wrapping a logo — shared by the intro and the hero orbit. */
export function IconChip({ item, size = 52, iconSize = 26 }) {
  return (
    <div
      className="flex items-center justify-center rounded-2xl"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(145deg, ${item.color}1f, ${item.color}0a)`,
        border: `1px solid ${item.color}44`,
        backdropFilter: 'blur(8px)',
        boxShadow: `0 6px 22px ${item.color}22, inset 0 1px 0 rgba(255,255,255,0.08)`,
      }}
    >
      <TechIcon item={item} size={iconSize} />
    </div>
  )
}
