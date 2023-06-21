import { logon } from '../api/accounts';
import { exchangeComponent } from '../components/utils/exchangeComponent.js';
import StoryView from '../components/StoryView';

class StoryPage extends HTMLDivElement {
  constructor() {
    super();
    this.classList.add('story-view-modal');

    this.account = { id: null };
    this.userToken = sessionStorage.getItem('userToken');

    this.innerHTML = `
      <div class="story-modal-body">
        <div class="out-box">
          <a data-link href="/">
            X
          </a>
        </div>
        <storyview-component></storyview-component>
      </div>
    `;

    this.storyViewComponent = this.querySelector('storyview-component');
  }

  async connectedCallback() {
    try {
      this.account = await logon(this.userToken);
    } catch (error) {
      console.error(error);
    }

    this.render();
  }

  render() {
    exchangeComponent(this.storyViewComponent, new StoryView(this.account));
  }
}

window.customElements.define('story-page', StoryPage, { extends: 'div' });

export default StoryPage;
