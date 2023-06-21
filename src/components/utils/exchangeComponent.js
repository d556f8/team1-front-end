/**
 * oldComponent와 newComponent를 교체합니다.
 * @param {Node} oldComponent
 * @param {Node} newComponent
 */
export function exchangeComponent(oldComponent, newComponent) {
  oldComponent.parentNode.replaceChild(newComponent, oldComponent);
}
