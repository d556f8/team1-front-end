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
      const newPostContent = highlight(content.post_content, keyword);

      const newContent = { ...content, post_content: newPostContent };

      this.contentList.appendChild(new Content(newContent));
    });
  }
}

class Content extends HTMLDivElement {
  constructor(post) {
    super();
    this.classList.add('content-item');

    this.post = post;

    this.innerHTML = `
      <span class="content">${post.post_content}</span>
      <img src="${post.post_top_img}" alt="">
      <span class="username">${post.name}</span>
    `;

    this.addEventListener('click', () => {
      exchangeModal(new PostModal(post));
    });
  }
}

window.customElements.define('content-item', Content, { extends: 'div' });
window.customElements.define('search-modal', SearchModal, { extends: 'div' });

export default SearchModal;
