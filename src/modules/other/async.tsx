import { pget } from '../../utils/request'

export function loadArticle (textId) {
  return pget(`/rise/article/load?id=${textId}`)
}
