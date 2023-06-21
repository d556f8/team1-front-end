/**
 * modal을 newModal로 교체합니다.
 * @param {Node} newModal
 */
export function exchangeModal(newModal) {
  const old = document.querySelector('.modal');
  old.innerHTML = ``;
  old.appendChild(newModal);
}
