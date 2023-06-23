import './PostModal.css';
import { hashtagHighlight } from '../../utils/highlight';
import { exchangeModal } from '../../utils/exchangeModal';
import { getPostById, updatePost } from '../../../api/posts';

class PostModal extends HTMLDivElement {
  constructor(data, account) {
    super();
    this.className = 'modal-dialog';
    this.data = data;
    this.account = account;

    this.id = 'postModal';

    // 하트 불들어 오게
    this.imageOfHeart =
      'https://cdn-icons-png.flaticon.com/512/5814/5814450.png';

    if (this.data.likes > 0) {
      this.imageOfHeart =
        'https://cdn-icons-png.flaticon.com/512/2107/2107845.png';
    }

    this.render();
    this.hearClick();
  }

  /* 2. 렌더링 */
  render() {
    this.innerHTML += `
        <div class="modal-content modal-control">
          <div class="modal-body">
            <div class="modal-left">
              ${new CarouselImg(this.data).render()}
            </div>
            
            <div class="modal-right">
              <div class="right-top">
                <div class="right-top-container">
                  <div class="right-top-userimage">
                    <img class="top-img" src=${
                      this.data.post_top_img
                    } alt="no_picture"> 
                  </div>
                  <div class="top-item-account">
                    <span class="name">${this.data.name}</span>
                  </div>
              </div>
            </div>

            <div class="modal-middle">
              <div class="visitor-post">
                <div class="comment">
                  <div class="visitor-comment">
                    ${hashtagHighlight(this.data.post_content)}
                  </div>
                  <div class="comment-item">

                  </div>
                </div>
              </div>
            </div>
                
                
            <div class="heart">
              <img class="heartimg" src=${this.imageOfHeart}>
              <strong class="count-like">${this.data.likes}</strong>
              <div class="user-like">명이 좋아합니다</div>
            </div>
            
            <div class="modal-comment">
              <div class="modal_bottom">
                  <textarea  class="modal-comment-input" style="overflow:hidden; resize:none;" placeholder="댓글 달기..."></textarea>
                  <div class="posting-push">
                    <button class="button-custom ">게시</button>
                  </div>
              </div>
            </div>

          </div>
        </div>
    `;

    const commentItem = this.querySelector('.comment-item');
    this.data.comments.forEach((comment) => {
      commentItem.innerHTML += `
      <div class="comment-div">
        <div class="comment-img">
          <img class="comment-img" src=${comment.img} alt="no_picture">
        </div>
        <div class="comment-name">
          ${comment.nickname}
        </div> 
        <div class="comment-content">
          ${comment.comment}
        </div>
      </div>
      `;
    });

    const postButton = this.querySelector('.button-custom');
    postButton.addEventListener('click', () => {
      this.cardUpdate(this.data.id);
    });
  }

  async cardUpdate(id) {
    const commentInput = this.querySelector('.modal-comment-input');
    const comment = commentInput.value;
    const postData = await getPostById(id);
    const { img, nickname } = this.account;
    postData.comments.push({ img, nickname, comment });
    await updatePost(id, postData);
    exchangeModal(new PostModal(postData, this.account));
  }

  async pushPatch(post) {
    try {
      const res = await fetch(`http://localhost:7000/posts/${post.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ likes: post.likes + 1 }),
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  /* 1.7.a. 좋아요 하트 색 변경  + 숫자 변경*/
  hearClick() {
    /*this 현재 노드 */
    const heartImg = this.querySelector('.heartimg');
    const countLikes = this.querySelector('.count-like');

    heartImg.addEventListener('click', () => {
      this.data.likes++;
      console.log('클릭함');
      console.log(this.data.likes);

      if (this.data.likes > 0) {
        heartImg.src =
          'https://cdn-icons-png.flaticon.com/512/2107/2107845.png';
      }
      this.pushPatch(this.data);
      countLikes.textContent = this.data.likes;
    });
  } /* /hearClick */
}

/* 🟢  7. CarouselImg */
class CarouselImg {
  constructor(data) {
    this.data = data;
  }
  render() {
    const carouselSlide = document.createElement('div');
    carouselSlide.className = 'carousel slide';

    // id를 생성해야지 각각의 인스턴스에 고유한 값을 부여하여 조종할 수 있음
    carouselSlide.id = `carouselAuto`;
    carouselSlide.setAttribute('data-bs-ride', 'carousel'); // carouselSlide에 속성 설정
    carouselSlide.style.height = '100%';

    /* prev 버튼 */
    const carouselControlPrev = document.createElement('button');
    carouselControlPrev.className = 'carousel-control-prev';
    carouselControlPrev.type = 'button';
    carouselControlPrev.setAttribute('data-bs-target', `#carouselAuto`);
    carouselControlPrev.setAttribute('data-bs-slide', 'prev');

    const carouselControlPrevIcon = document.createElement('span');
    carouselControlPrevIcon.className = 'carousel-control-prev-icon';
    carouselControlPrevIcon.setAttribute('aria-hidden', 'true');

    const carouselControlPrevSpan = document.createElement('span');
    carouselControlPrevSpan.className = 'visually-hidden';
    carouselControlPrevSpan.innerText = 'Previous';

    /* right 버튼 */
    const carouselControlNext = document.createElement('button');
    carouselControlNext.className = 'carousel-control-next';
    carouselControlNext.type = 'button';
    carouselControlNext.setAttribute('data-bs-target', `#carouselAuto`);
    carouselControlNext.setAttribute('data-bs-slide', 'next');

    const carouselControlNextIcon = document.createElement('span');
    carouselControlNextIcon.className = 'carousel-control-next-icon';
    carouselControlNextIcon.setAttribute('aria-hidden', 'true');

    const carouselControlNextSpan = document.createElement('span');
    carouselControlNextSpan.className = 'visually-hidden';
    carouselControlNextSpan.innerText = 'Next';

    const carouselIndicators = document.createElement('div');
    carouselIndicators.className = 'carousel-indicators';

    const carouselInner = document.createElement('div');
    carouselInner.className = 'carousel-inner';
    carouselInner.style.height = '100%';

    if (Array.isArray(this.data.post_main_img)) {
      for (let i = 0; i < this.data.post_main_img.length; i++) {
        const carouselItem = document.createElement('div');
        const carouselIndicator = document.createElement('button');

        carouselIndicator.type = 'button';
        carouselIndicator.setAttribute('data-bs-target', '#carouselAuto');
        carouselIndicator.setAttribute('data-bs-slide-to', i);
        carouselIndicator.setAttribute('aria-label', `Slide ${i + 1}`);

        carouselItem.setAttribute('data-bs-interval', '10000');
        carouselItem.style.height = '100%';
        if (i === 0) {
          carouselItem.className = 'carousel-item active';
          carouselIndicator.className = 'active';
          carouselIndicator.setAttribute('aria-current', 'true');
        } else {
          carouselItem.className = 'carousel-item';
        }

        const img = document.createElement('div');
        img.className = 'img';
        img.style.height = '100%';
        if (/^http.*/.test(this.data.post_main_img[i])) {
          img.style.background = `url(${this.data.post_main_img[i]})`;
          img.style.backgroundRepeat = 'no-repeat';
          img.style.backgroundSize = 'cover';
        } else {
          img.style.background = this.data.post_main_img[i];
        }

        carouselItem.appendChild(img);
        carouselInner.appendChild(carouselItem);
        carouselIndicators.appendChild(carouselIndicator);
      }
    }

    carouselSlide.appendChild(carouselIndicators);
    carouselSlide.appendChild(carouselInner);
    carouselControlPrev.appendChild(carouselControlPrevIcon);
    carouselControlPrev.appendChild(carouselControlPrevSpan);
    carouselControlNext.appendChild(carouselControlNextIcon);
    carouselControlNext.appendChild(carouselControlNextSpan);
    carouselSlide.appendChild(carouselControlPrev);
    carouselSlide.appendChild(carouselControlNext);

    return carouselSlide.outerHTML;
  }
}

window.customElements.define('post-modal', PostModal, { extends: 'div' });

export default PostModal;
