import { exchangeModal } from '../utils/exchangeModal';
import SearchModal from '../Modal/SearchModal';

class Hashtag extends HTMLElement {
  constructor(word = '') {
    super();

    // this.setAttribute('data-bs-toggle', 'modal');
    // this.setAttribute('data-bs-target', '#swapModal');
    if (word) this.textContent = word;

    this.addEventListener('click', () => {
      exchangeModal(new SearchModal(this.textContent));
    });
  }
}

window.customElements.define('ctm-hashtag', Hashtag);

export default Hashtag;
