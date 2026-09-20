const metaModules = import.meta.glob('/src/cases/*/meta.js', { eager: true })

export const cases = Object.entries(metaModules)
  .map(([path, mod]) => {
    const slug = path.match(/\/cases\/([^/]+)\/meta\.js$/)?.[1] ?? ''
    return { slug, ...mod.default }
  })
  .sort((a, b) => a.order - b.order)

export function getCaseBySlug(slug) {
  return cases.find(c => c.slug === slug)
}

export function getAdjacentCases(slug) {
  const idx = cases.findIndex(c => c.slug === slug)
  return {
    prev: idx > 0 ? cases[idx - 1] : null,
    next: idx < cases.length - 1 ? cases[idx + 1] : null,
  }
}
