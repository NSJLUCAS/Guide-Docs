export function searchText(source) {
  return source
    .replace(/^```[^\n]*$/gm, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[#*`|>[\]]/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/(?<=[\p{Script=Han}\u3000-\u303f\uff00-\uffef])[ \t]+(?=[\p{Script=Han}\u3000-\u303f\uff00-\uffef])/gu, '')
    .trim()
}
