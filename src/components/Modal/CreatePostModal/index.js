import './CreatePostModal.css';

import { uploadImg } from '../../../api/thumbsnap';
import { createPost } from '../../../api/posts';

import Post from '../../Post';
import { exchangeComponent } from '../../utils/exchangeComponent';

class CreatePostModal extends HTMLDivElement {
  constructor(account) {
    super();

    this.account = account;

    this.classList.add('create-post-modal', 'modal-dialog');
    this.setAttribute('role', 'document');

    this.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          <h5 class="modal-title">새 게시물 만들기</h5>
          <button type="button" class="btn btn-share" data-bs-dismiss="modal">공유하기</button>
        </div>
        <div class="modal-body">
          <div class="post-upload-img">
            <label for="uploadImg" class="upload-img-label">
              <img src="/assets/image/imageupload.svg" alt="upload-img">
            </label>
            <input type="file" name="post-img" id="uploadImg" hidden>
          </div>
          <div class="post-field">
            <div class="user-info">
              <img class="user-img" src="${this.account.img}" alt="">
              <span class="user-name">${this.account.nickname}</span>
            </div>
            <textarea class="post-content" placeholder="문구 입력..." maxlength="2000"></textarea>
            <div class="post-assist">
              <div class="emoji-picker">                                     
                <button type="button" class="btn dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                  <img src="/assets/image/icons/emoji.svg" alt="emoji-icon">
                </button>
                <div class="dropdown-menu">
                  <button class="btn btn-emoji">😂</button>
                  <button class="btn btn-emoji">😮</button>
                  <button class="btn btn-emoji">😍</button>
                  <button class="btn btn-emoji">😢</button>
                  <button class="btn btn-emoji">👏</button>
                  <button class="btn btn-emoji">🔥</button>
                  <button class="btn btn-emoji">🎉</button>
                  <button class="btn btn-emoji">💯</button>
                </div>
              </div>
              <span class="content-length">0/2000</span>
            </div>
          </div>
        </div>
      </div>
    `;

    // FIXME:
    // data set
    this.userName = this.querySelector('.user-name');
    this.postContent = this.querySelector('.post-content');
    this.uploadImg = this.querySelector('#uploadImg');
    // "post_top_img": "https://github.com/HyunjinHa.png",
    // this.postMainImg = this.querySelector('') // 이건 나중에 post할 때 데이터를 받고 추가함

    // for event
    this.shareBtn = this.querySelector('.btn-share');
    this.shareBtn.addEventListener('click', async () => {
      if (!this.postContent.value) return alert('내용을 입력해주세요.');
      if (!this.uploadImg.files[0]) return alert('이미지를 업로드해주세요.');

      await this.share();
      const postComponent = document.querySelector('post-container');
      exchangeComponent(postComponent, new Post());
    });

    this.previewImg = this.querySelector('.upload-img-label > img');
    this.uploadImg.addEventListener('change', () => this.renderImg());

    // emoji picker
    this.emojiPicker = this.querySelector('.emoji-picker');
    this.emojiBtns = this.emojiPicker.querySelectorAll('.btn-emoji');
    this.emojiBtns.forEach((btn) => {
      btn.addEventListener('click', () => this.addEmoji(btn));
    });

    // textarea length
    this.contentLength = this.querySelector('.content-length');
    this.postContent.addEventListener('keyup', () => this.rewriteLength());
  }

  renderImg() {
    const file = this.uploadImg.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.previewImg.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  addEmoji(btn) {
    this.postContent.value += btn.textContent;
    this.rewriteLength();
  }

  rewriteLength() {
    this.contentLength.textContent = `${this.postContent.value.length}/2000`;
  }

  async share() {
    const file = this.uploadImg.files[0];
    const post = {
      name: this.account.nickname,
      post_content: this.postContent.value,
      post_top_img: this.account.img,
      post_main_img: [await uploadImg(file)],
      comments: [],
      likes: 0,
    };

    await createPost(post);
  }
}

window.customElements.define('create-post-modal', CreatePostModal, {
  extends: 'div',
});

export default CreatePostModal;
