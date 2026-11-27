export function pageTitle(
  pathname: string,
  titles: Record<string, string>,
  articles: readonly { path: string; title: string; shareTitle?: string }[],
): string {
  const path = pathname.replace(/\/+$/, '') || '/'
  if (titles[path]) return titles[path]
  const article = articles.find(item => item.path.replace(/\/+$/, '') === path)
  if (article) return `${article.shareTitle ?? article.title} · Claudiu Dangulea`
  return 'Seite nicht gefunden · Claudiu Dangulea'
}
