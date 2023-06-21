import { getPost, deletePost, updatePost, getPostById } from '../../api/posts.js';
import './post.css';
import PostModal from '../Modal/PostModal'; /* postModal import  */
import { exchangeModal } from '../utils/exchangeModal.js';

import { hashtagHighlight } from '../utils/highlight.js';
import { exchangeComponent } from '../utils/exchangeComponent.js';

// import Modal from './postMoal.js' // 모달 import

/* 🟢  1. POST */
class Post extends HTMLElement {
  constructor(account, categoryId = null) {
    super();

    this.account = account;

    /* 1.1   <div class="inner-container"> </div>   */
    this.innerContainer = document.createElement('div');
    this.innerContainer.className = 'inner-container';

    /* 1.2   <div class="card-container"> </div>   */
    this.cardContainer = document.createElement('div');
    this.cardContainer.className = 'card-container';

    this.categoryId = categoryId;
    /* 🚩 1.3 */
    if (categoryId) {
      this.loadDatas(categoryId);
    } else {
      this.loadDatas();
    }
  }

  /* 🚩1.3 fetch - 서버에서 데이터 가져 오기  */
  async loadDatas(id = null) {
    try {
      if (id) {
        this.data = (await getPost()).reverse();
        this.data = this.data.filter((post) => post.category === Number(id));
        this.render();
      } else {
        this.data = (await getPost()).reverse(); // 서버에서 객체화된 데이터 불러서 반환
        this.render();
      }
    } catch (error) {
      console.log(error);
    }
  }

  /* 1.4 렌더링 */
  render() {
    /* 1.4.1  2.CardContainer를 불러와서 서버에서 받아온 데이터 넣고 CardContainer를 렌더*/
    //   위에서 서버로 받은 data를 CardContainer로 전달

    this.cardContainer.innerHTML += new CardContainer(this.data, this.account).render(); // ❓바로 CardContainer 생성자에서 render() 하면 안되나?  => return 값이 이상하게 나온단다

    this.innerContainer.appendChild(this.cardContainer); // innerContainer(전체 감싸는)에 CardContainer 내용 넣기

    this.appendChild(this.innerContainer);

    /* a. 좋아요 하트 색 변경 */
    this.hearClick();

    /* b. Card 삭제하기  */
    const deleteBtn = document.querySelectorAll('.dropdown-delete-btn');
    deleteBtn.forEach((btn) => {
      btn.addEventListener('click', () => {
        this.cardDelete(btn.dataset.id);
      });
    });

    const postModal = document.querySelectorAll('.show_All');
    postModal.forEach((post) => {
      post.addEventListener('click', () => {
        const modalId = post.dataset.id;
        const modalData = this.data.find((data) => data.id === Number(modalId));
        exchangeModal(new PostModal(modalData, this.account));
      });
    });

    const commentPush = document.querySelectorAll('.btn-push');
    commentPush.forEach((btn) => {
      btn.addEventListener('click', () => {
        this.cardUpdate(btn.dataset.id);
      });
    });

    /* c. 사용자가 작성한 글 더보기 (토굴) */
    this.moreViewPosts();
  }
  /* fetch 사용 */
  /* 🟡 1.5 데이터 수정하기  */
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

  /* 🔴 1.6데이터 삭제하기  */
  async cardDelete(id) {
    await deletePost(id);

    const container = document.querySelector('.card-container');
    container.innerHTML = '';

    this.loadDatas();
  }

  async cardUpdate(id) {
    const commentInput = document.querySelector('.comment-input');
    const comment = commentInput.value;
    const postData = await getPostById(id);
    const { img, nickname } = this.account;
    postData.comments.push({ img, nickname, comment });
    await updatePost(id, postData);
    exchangeComponent(this, new Post(this.account));
  }

  /* 1.7.a. 좋아요 하트 색 변경  + 숫자 변경*/
  hearClick() {
    // 하트 이미지들
    const heartImgs = document.querySelectorAll('.use-heart-wrap>#hear_img');
    const countLikes = document.querySelectorAll('.count-like');
    /* 하트 객체 수 만큼 */
    heartImgs.forEach((heartImg, index) => {
      heartImg.addEventListener('click', () => {
        // 하트 색 변경
        this.data[index].likes++;
        if (this.data[index].likes > 0) {
          heartImg.src =
            'https://cdn-icons-png.flaticon.com/512/2107/2107845.png';
        }

        this.pushPatch(this.data[index]);

        // 하트 개수 하나씩 증가
        console.log(this.data[index].likes);
        countLikes[index].textContent = this.data[index].likes;
      });
    });
  } /* /hearClick */

  /* 1.7.c. 사용자가 작성한 글 더보기 (토굴) */
  moreViewPosts() {
    let showMore_El = this.querySelector('#showMore');
    let postContent_El = this.querySelector('.post-content');

    showMore_El.addEventListener('click', () => {
      postContent_El.classList.toggle('user-tag-on');
    });
    // let showMore_El = this.querySelector('#showMore');
    // let postContent_El = this.querySelector('.post-content');

    // showMore_El.addEventListener('click', () => {
    //   postContent_El.classList.toggle('user-tag-on');
    // });
  }

  /* 댓글 모두 보기 - 모달 클릭해서 열기 */
  moreViewComments() {
    let showAll_Els = this.querySelectorAll('.show_All');

    showAll_Els.forEach((showAll_El, index) => {
      showAll_El.addEventListener('click', () => {
        // let createdModal = new Modal(this.data);

        console.log(showAll_El[index]);
        console.log('댓글 모두보기 누름');
      });
    });
  }
}

/* 🟢  2. CardContainer */
class CardContainer {
  constructor(data, account) {
    // 46번 라인에서 데이터 전달 받아 값 전달
    this.data = data;
    this.account = account;
  }

  /* 2.1  다른 클래스들(Top, MainPost, UserWrite, Comment)의 인스턴스를 생성 하면서 카드의 HTML생성*/
  render() {
    let cardContainer = document.createElement('div');

    /* 2.2  배열의 각 항목을 돌면서 해당 항목에 대한 " .card = cardHTML" 클래스 이름을 가진 <div> 요소를 생성 
            받아온 데이터 수만큼 CARD 생성  / card로 받아온 데이터를 각각 forEach 로 따갬 = card
    */
    this.data.forEach((card) => {
      let cardHTML = document.createElement('div');
      cardHTML.className = 'card';

      /* 2.2.1 Top */ //  따개진 card를 Top 컴포넌트로 전달
      const top = new Top(card);
      cardHTML.innerHTML += top.render();

      /* 2.2.2 MainPost */ //  따개진 card를 MainPost 컴포넌트로 전달
      const main = new MainPost(card);
      cardHTML.innerHTML += main.render();

      /* 2.2.3 ".post-footer" 생성 후 cardHTML제일 아래에 추가 */
      cardHTML.innerHTML += `<div class="post-footer"> </div>`; /* 🟡 */

      let footer = cardHTML.querySelector('.post-footer'); /// ❓cardHTML 안에 있으면 document.querySelector 안하고 가능??

      /* 2.2.4 UserWrite */ //따개진 card를 UserWrite 컴포넌트로 전달
      const userWrite = new UserWrite(card);
      footer.innerHTML += userWrite.render(); /* 🟡 */

      /* 2.2.5 Comment */ //따개진 card를 Comment 컴포넌트로 전달
      if (this.account) {
        const comment = new Comment(card);
        footer.innerHTML += comment.render();
      }
       /* 🟡 */
      /* 🟢🟢🟢🟢🟢🟢🟢 모달 새로 추가 */
      // const modal = new Modal(card);
      // footer.innerHTML += modal.render();

      /* 생성된  클래스들(Top, MainPost, UserWrite, Comment) cardContainer에 전달*/
      cardContainer.appendChild(cardHTML);
    });

    return cardContainer.innerHTML;
  }
}

/* 🟢  3. Top */
class Top {
  constructor(data) {
    this.data = data;
  }

  render() {
    /* class="top"이 안에 이미 설정 되어 있음 */ //⭐ 이렇게 넣으면 return 할 때 div는 까지면서 안의 내용만 반환된다. ⭐
    let topHTML = document.createElement('div'); //

    topHTML.innerHTML += `
      <div class="top">
        <div class="top-container">
            <div class="top-item-image">
              <img class="top-img" src="${this.data.post_top_img}" alt="test">
            </div>
            <div class="top-item-account">
              <span class="account">
                <strong id="userAcct">${this.data.name}</strong>
              </span>
            </div>

            <div class="dropdown">
                <button class="btn cansel-modal" type="button" data-bs-toggle="dropdown" aria-expanded="true">
                  <span class="material-symbols-outlined">
                    more_horiz
                  </span>
                </button>
                <ul class="dropdown-menu isvisible">
                  <li><button class="dropdown-item dropdown-delete-btn" type="button">게시글 삭제</button></li>
                </ul>
            </div>
        </div>
      </div>
    `;

    const deleteBtn = topHTML.querySelector('.dropdown-delete-btn');
    deleteBtn.setAttribute('data-id', this.data.id);

    return topHTML.innerHTML; // 위에 있는 html내용 그대로 반환
  }
}

/* 🟢  4. MainPost */
class MainPost {
  constructor(data) {
    // ❓ card 갖
    this.data = data;
  }

  render() {
    let mainHTML = document.createElement('div'); // ⭐ 이렇게 넣으면 return 할 때 div는 까지면서 안의 내용만 반환된다. ⭐

    mainHTML.innerHTML += `
      <div class="main-container">
        <div class="items">
        </div>
      </div>
      
    `;
    let items = mainHTML.querySelector('.items'); // 위에 items 클래스

    const carouselImg = new CarouselImg(this.data);
    items.innerHTML += carouselImg.render(); // items 클래스 안에 캐러셀 넣기

    return mainHTML.innerHTML;
  }
}

/* 🟢  5. UserWrite */
class UserWrite {
  constructor(data) {
    this.data = data;

    // 하트 불들어 오게
    this.heartImg = 'https://cdn-icons-png.flaticon.com/512/5814/5814450.png';

    if (this.data.likes > 0) {
      this.heartImg = 'https://cdn-icons-png.flaticon.com/512/2107/2107845.png';
    }
  }

  render() {
    let userWriteHTML = document.createElement('div'); // ⭐ 이렇게 넣으면 return 할 때 div는 까지면서 안의 내용만 반환된다. ⭐

    userWriteHTML.innerHTML += `
      <div class="user-heart">
        <div class="user-heart-icon">
          <span class="use-heart-wrap">
            <img id="hear_img" src=${this.heartImg}>
          </span>
        </div>
      </div>
      <div class="user-count">
        <strong class="count-like">${this.data.likes}</strong>
        <div class="user-like">명이 좋아합니다</div>
      </div>
      <div class="user-write">
        <div class="user-tag">
          <span id="account">${this.data.name}</span>
          <div class="post-content">
            <span class="post">
              ${hashtagHighlight(this.data.post_content)} 
            </span>
          </div> 
          <span id="showMore">더보기</span>
        </div>
      </div>
      
      <button type="button" class="btn btn-primary button-custom show_All" data-bs-toggle="modal" data-bs-target="#swapModal">
        댓글 모두 보기
      </button>
    `;

    const showAll = userWriteHTML.querySelector('.show_All');
    showAll.setAttribute('data-id', this.data.id);

    return userWriteHTML.innerHTML;
  }
}

/* 🟢  6. Comment */
class Comment {
  constructor(data) {
    this.data = data;
  }

  render() {
    let commentHTML = document.createElement('div');

    commentHTML.innerHTML += `
    <div class="comment-wrap">
      <div class="comment">
        <textarea class="comment-input" aria-label="댓글 달기..." placeholder="댓글 달기..." id="myField"></textarea> 
      </div>
      <div class="comment-push">
          <button class="btn-push">게시</button>
      </div>
    </div>
    `;

    const commentPush = commentHTML.querySelector('.btn-push');
    commentPush.setAttribute('data-id', this.data.id);

    return commentHTML.innerHTML;
  }
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
    carouselSlide.id = `carouselAuto${this.data.id}`;
    carouselSlide.setAttribute('data-bs-ride', 'carousel'); // carouselSlide에 속성 설정

    /* prev 버튼 */
    const carouselControlPrev = document.createElement('button');
    carouselControlPrev.className = 'carousel-control-prev';
    carouselControlPrev.type = 'button';
    carouselControlPrev.setAttribute(
      'data-bs-target',
      `#carouselAuto${this.data.id}`
    );
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
    carouselControlNext.setAttribute(
      'data-bs-target',
      `#carouselAuto${this.data.id}`
    );
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

    if (Array.isArray(this.data.post_main_img)) {
      for (let i = 0; i < this.data.post_main_img.length; i++) {
        const carouselItem = document.createElement('div');
        const carouselIndicator = document.createElement('button');

        carouselIndicator.type = 'button';
        carouselIndicator.setAttribute('data-bs-target', '#carouselAuto');
        carouselIndicator.setAttribute('data-bs-slide-to', i);
        carouselIndicator.setAttribute('aria-label', `Slide ${i + 1}`);

        carouselItem.setAttribute('data-bs-interval', '10000');
        if (i === 0) {
          carouselItem.className = 'carousel-item active';
          carouselIndicator.className = 'active';
          carouselIndicator.setAttribute('aria-current', 'true');
        } else {
          carouselItem.className = 'carousel-item';
        }

        const img = document.createElement('div');
        img.className = 'img';
        if (/^http.*/.test(this.data.post_main_img[i])) {
          img.style.background = `url(${this.data.post_main_img[i]})`;
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

window.customElements.define('post-container', Post);

export default Post;
