import PostModal from '../PostModal';
import { getPost } from '../../../api/posts';
import { exchangeModal } from '../../utils/exchangeModal';
import './SearchModal.css';
import { highlight } from '../../utils/highlight';

class SearchModal extends HTMLDivElement {
  constructor(keyword = '') {
    super();

    this.classList.add('search-modal', 'modal-dialog');
    this.setAttribute('role', 'document');

    this.contents = [];

    this.innerHTML = `
      <div class="search-box">
        <div class="search-bar">
          <input type="text" name="searchInput" id="searchInput" autocomplete="off" autofocus>
          <button class="btn-close close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="content-list"></div>
      </div>
    `;

    this.searchInput = this.querySelector('#searchInput');
    this.searchInput.value = keyword;
    this.searchInput.addEventListener('keyup', (e) =>
      this.searchContents(e.target.value)
    );

    this.contentList = this.querySelector('.content-list');
  }

  async connectedCallback() {
    this.contents = await getPost();
    this.searchContents(this.searchInput.value);
  }

  searchContents(keyword) {
    const contents = this.contents
      .filter(({ post_content }) => post_content.includes(keyword))
      .slice(0, 5);

    this.renderContents(contents, keyword);
  }

  renderContents(contents, keyword) {
    this.contentList.innerHTML = ``;
    contents.forEach((content) => {
      this.contentList.appendChild(new Content(content, keyword));
    });
  }
}

class Content extends HTMLDivElement {
  constructor(post, keyword = '') {
    super();
    this.classList.add('content-item');

    const { post_content, post_top_img, name } = post;

    this.innerHTML = `
      <span class="content">${highlight(post_content, keyword)}</span>
      <img src="${post_top_img}" alt="">
      <span class="username">${name}</span>
    `;

    this.addEventListener('click', () => {
      exchangeModal(new PostModal(post));
    });
  }
}

window.customElements.define('content-item', Content, { extends: 'div' });
window.customElements.define('search-modal', SearchModal, { extends: 'div' });

export default SearchModal;
