/* Real tech stack — icons rendered from Simple Icons CDN (AWS is a custom
   inline cloud because Amazon marks are removed from Simple Icons). */
export const TECH = [
  { name: 'Python',         slug: 'python',        color: '#5B9BD5' },
  { name: 'TypeScript',     slug: 'typescript',    color: '#4A9DF0' },
  { name: 'React',          slug: 'react',         color: '#61DAFB' },
  { name: 'Node.js',        slug: 'nodedotjs',     color: '#7FC862' },
  { name: 'FastAPI',        slug: 'fastapi',       color: '#12B8A6' },
  { name: 'Docker',         slug: 'docker',        color: '#3B9EFF' },
  { name: 'Kubernetes',     slug: 'kubernetes',    color: '#6C8EEF' },
  { name: 'AWS',            slug: '__aws__',       color: '#FF9E33' },
  { name: 'PostgreSQL',     slug: 'postgresql',    color: '#7AA9E8' },
  { name: 'MongoDB',        slug: 'mongodb',       color: '#4DB33D' },
  { name: 'LangChain',      slug: 'langchain',     color: '#3FBFA3' },
  { name: 'GitHub Actions', slug: 'githubactions', color: '#5C9DFF' },
]

/* Preload the CDN logos so they're painted instantly when they fall. */
export function preloadTechIcons() {
  if (typeof window === 'undefined') return
  TECH.forEach(({ slug, color }) => {
    if (slug === '__aws__') return
    const img = new Image()
    img.src = `https://cdn.simpleicons.org/${slug}/${color.replace('#', '')}`
  })
}
