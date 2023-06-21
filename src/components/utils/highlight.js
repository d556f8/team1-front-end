import Hashtag from '../common/Hashtag';

export function hashtagHighlight(text) {
  const regex = /#[^\s#]+/g;
  return text.replace(regex, (match) => `<ctm-hashtag>${match}</ctm-hashtag>`);
}

/**
 * text에서 keyword를 찾아서 하이라이트 처리한다.
 * @param {string} text
 * @param {string} keyword
 * @returns {string} 하이라이트 처리된 text
 */
export function highlight(text, keyword) {
  const regex = new RegExp(keyword, 'gi');

  return text.replace(regex, `<span class="highlight">${keyword}</span>`);
}
