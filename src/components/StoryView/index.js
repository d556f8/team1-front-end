import './storyview.css';
import {
  getProfiles,
  getProfileById,
  updateProfile,
  deleteProfile,
} from '../../api/profiles.js';
import { exchangeModal } from '../utils/exchangeModal';
import { gsap } from 'gsap';
import StoryModal from '../Modal/StoryModal';

class StoryView extends HTMLDivElement {
  constructor(account) {
    super();

    this.account = account;

    this.storyWrapper = document.createElement('div');
    this.storyWrapper.className = 'story-modal-wrapper';
    this.modalWrapper = document.createElement('div');
    this.modalWrapper.className = 'modal-wrapper';

    this.handleEditButtonClicked = this.handleEditButtonClicked.bind(this);
  }

  connectedCallback() {
    document.addEventListener(
      'editButtonClicked',
      this.handleEditButtonClicked
    );
    this.loadDatas();
  }

  disconnectedCallback() {
    document.removeEventListener(
      'editButtonClicked',
      this.handleEditButtonClicked
    );
  }

  // 데이터 불러오기
  async loadDatas() {
    try {
      this.profileData = await getProfiles();
      this.render();
    } catch (error) {
      console.error(error);
    }
  }

  handleEditButtonClicked(event) {
    this.changeCarouselImg(event.detail);
  }

  render() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = parseInt(urlParams.get('id'));

    const index = this.profileData.findIndex((data) => data.id === id);

    // 왼쪽, 오른쪽 스토리 있는지 확인하고 데이터 저장
    let prevData = '',
      nextData = '';
    if (index > 0) prevData = this.profileData[index - 1];
    if (index < this.profileData.length - 1)
      nextData = this.profileData[index + 1];

    // 스토리 만들기
    this.modalWrapper.innerHTML = `
      ${index > 0 ? new SideStory(prevData).render('left') : ''}
      ${new CenterStory(this.profileData[index], this.account).render()}
      ${
        index < this.profileData.length - 1
          ? new SideStory(nextData).render('right')
          : ''
      }
    `;

    this.storyWrapper.appendChild(this.modalWrapper);

    this.appendChild(this.storyWrapper);

    const leftStory = this.querySelector('.story-container.left');
    const rightStory = this.querySelector('.story-container.right');

    // 왼쪽 스토리 클릭시 애니메이션 실행하고 스토리 이동
    if (leftStory) {
      leftStory.addEventListener('click', () => {
        this.moveStory('left');
      });
    }

    // 오른쪽 스토리 클릭시 애니메이션 실행하고 스토리 이동
    if (rightStory) {
      rightStory.addEventListener('click', () => {
        this.moveStory('right');
      });
    }

    this.sizeChange(); // 사이즈 변경

    const editStory = this.querySelector('#edit-story');
    const deleteStory = this.querySelector('#del-story');

    // 수정 버튼 클릭시 현재 정보 가져와서 모달창 열어주기
    editStory.addEventListener('click', () => {
      const active = this.querySelector('.carousel-item.active');
      const activeImg = active.querySelector('.img');
      const activeText = active.querySelector('.text-area');
      const background = activeImg.style.background;
      const text = activeText.value;
      const textColor = activeText.style.color;
      exchangeModal(new StoryModal('edit', background, text, textColor));
    });

    // 삭제 버튼 클릭시
    deleteStory.addEventListener('click', () => {
      this.deleteCarouselImg();
    });

    this.textAreaResize();

    // 캐러셀 이동할때 사이즈 변경해주기
    const myCarousel = document.querySelector('#carouselAuto');
    myCarousel.addEventListener('slid.bs.carousel', () => {
      this.textAreaResize();
    });
  }

  // 글 사이즈 변경해주기
  textAreaResize() {
    const textInput = this.querySelectorAll('.text-area');
    textInput.forEach((text) => {
      text.style.height = text.scrollHeight + 'px';
    });
  }

  // 사이즈 변경
  sizeChange() {
    this.reSize();

    window.addEventListener('resize', () => {
      this.reSize();
    });
  }

  // 사이즈 크기에 맞게 변경
  reSize() {
    let viewportWidth = window.innerWidth;
    let containerHeight = viewportWidth >= 940 ? 840 : viewportWidth - 100;

    let storyContainers =
      this.storyWrapper.querySelectorAll('.story-container');
    let imgSizes = this.storyWrapper.querySelectorAll('.img-size');

    imgSizes.forEach((imgSize) => {
      imgSize.style.width = containerHeight / 2 + 'px';
      imgSize.style.height = containerHeight - 40 + 'px';
    });

    storyContainers.forEach((storyContainer) => {
      storyContainer.style.width = containerHeight / 2 + 'px';
      storyContainer.style.height = containerHeight - 40 + 'px';
    });

    let containerElement = this.storyWrapper;
    containerElement.style.maxWidth = viewportWidth + 'px';
    containerElement.style.maxHeight = containerHeight + 'px';
  }

  // 스토리 클릭 했을 때 애니메이션
  moveStory(directions) {
    const urlParams = new URLSearchParams(window.location.search);
    const id = parseInt(urlParams.get('id'));
    const data = this.profileData.find((data) => {
      if (directions === 'left') {
        return data.id === id - 1;
      }
      return data.id === id + 1;
    });
    let direction = '';

    const currentId = parseInt(urlParams.get('id'));

    if (directions === 'left') {
      direction = 'left';
      if (data.id === 1 || currentId === this.profileData.length) {
        direction = 'endLeft';
      }
    } else if (directions === 'right') {
      direction = 'right';
      if (data.id === this.profileData.length || currentId === 1) {
        direction = 'endRight';
      }
    }

    const sideStoryLeft = this.modalWrapper.querySelector(
      '.story-container.left'
    );
    const originalStory = this.modalWrapper.querySelector(
      '.story-container.center'
    );
    const sideStoryRight = this.modalWrapper.querySelector(
      '.story-container.right'
    );

    const tl = gsap.timeline({
      onComplete: () => {
        while (this.modalWrapper.firstChild) {
          this.modalWrapper.firstChild.remove();
        }

        const newURL =
          window.location.origin + window.location.pathname + '?id=' + data.id;
        history.pushState(null, null, newURL);

        this.render();
        this.sizeChange();
      },
    });
    if (direction === 'right') {
      // 클릭한 스토리가 오른쪽에 있을 때
      tl.add(
        gsap.to(sideStoryRight, {
          duration: 1,
          scale: 1.2,
          x: `-140%`,
        })
      );

      tl.add(
        gsap.to(originalStory, {
          duration: 1,
          scale: 0.3,
          x: '-140%',
        }),
        '<'
      );

      tl.add(
        gsap.to(sideStoryLeft, {
          duration: 1,
          x: '-140%',
          opacity: 0,
        }),
        '<'
      );
    } else if (direction === 'endLeft') {
      tl.add(
        gsap.to(sideStoryLeft, {
          duration: 1,
          scale: 1.2,
          x: '70%',
        })
      );

      tl.add(
        gsap.to(originalStory, {
          duration: 1,
          scale: 0.3,
          x: '70%',
        }),
        '<'
      );

      tl.add(
        gsap.to(sideStoryRight, {
          duration: 1,
          x: '70%',
          opacity: 0,
        }),
        '<'
      );
    } else if (direction === 'endRight') {
      tl.add(
        gsap.to(sideStoryRight, {
          duration: 1,
          scale: 1.2,
          x: '-70%',
        })
      );

      tl.add(
        gsap.to(originalStory, {
          duration: 1,
          scale: 0.3,
          x: '-70%',
        }),
        '<'
      );

      tl.add(
        gsap.to(sideStoryLeft, {
          duration: 1,
          x: '-70%',
          opacity: 0,
        }),
        '<'
      );
    } else {
      // 클릭한 스토리가 왼쪽에 있을 때
      tl.add(
        gsap.to(sideStoryLeft, {
          duration: 1,
          scale: 1.2,
          x: '140%',
        })
      );

      tl.add(
        gsap.to(originalStory, {
          duration: 1,
          scale: 0.3,
          x: '140%',
        }),
        '<' // 이전 애니메이션과 동시에 실행
      );

      tl.add(
        gsap.to(sideStoryRight, {
          duration: 1,
          x: '140%',
          opacity: 0,
        }),
        '<'
      );
    }
  }

  // 현재 캐러셀 이미지 삭제
  async deleteCarouselImg() {
    const activeCarouselItem = this.querySelector('.carousel-item.active');
    const activeIndex = activeCarouselItem.dataset.index;

    const id = this.account.id;

    const data = await getProfileById(id);

    const storyImg = data.storyImg;
    const storyText = data.storyText;

    storyImg.splice(activeIndex, 1);
    storyText.splice(activeIndex, 1);

    // 주소창에서 id 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const siteId = parseInt(urlParams.get('id'));

    if (storyImg.length === 0) {
      let loadId = siteId;
      if (siteId === 1) {
        loadId = siteId + 1;
      } else {
        loadId = siteId - 1;
      }

      await deleteProfile(id);

      this.innerHTML = '';

      const newURL =
        window.location.origin + window.location.pathname + '?id=' + loadId;
      history.pushState(null, null, newURL);

      this.loadDatas();
    } else {
      const currentData = this.profileData.find((data) => data.id === siteId);

      currentData.storyImg = storyImg;
      currentData.storyText = storyText;

      await updateProfile(currentData);

      this.innerHTML = '';

      this.render();
    }
  }

  // 이미지 변경할 때 기본값들 넘겨주기
  changeCarouselImg(detail) {
    const activeCarouselItem = this.querySelector('.carousel-item.active');
    const activeIndex = activeCarouselItem.dataset.index;

    const id = this.account.id;
    const background = detail.background;
    const text = detail.text;
    const color = detail.textColor;

    this.updateStory(id, activeIndex, background, text, color);
  }

  // 현재 캐러셀 이미지 변경
  async updateStory(id, activeIndex, background, text, color) {
    const data = await getProfileById(id);
    const { storyImg, storyText } = data;

    storyImg.splice(activeIndex, 1, background);
    storyText[activeIndex].text = text;
    storyText[activeIndex].color = color;

    const index = this.profileData.findIndex((data) => data.userId === id);
    this.profileData[index].storyImg = storyImg;
    this.profileData[index].storyText = storyText;

    await updateProfile(this.profileData[index]);

    this.modalWrapper.innerHTML = '';

    this.loadDatas();
  }
}
// 중간 스토리 생성
class CenterStory {
  constructor(data, account) {
    this.profileData = data;
    this.account = account;
  }
  render() {
    let container = document.createElement('div');
    container.innerHTML = `
      <div class="story-container center">
        <div class="modal-story">
          <div class="story-item">
            <div class="story-header">
              <div class="story-head">
                <div class="story-profile">
                  <img class="story-small-img" src="${this.profileData.img}">
                  <div class="story-name">${this.profileData.name}</div>
                </div>
                
              </div>
            </div>
            <button class="slide-button prevB" type="button" data-bs-target="#carouselAuto" data-bs-slide="prev">
              <div class="btn-prev"></div>
            </button>
            <button class="slide-button nextB" type="button" data-bs-target="#carouselAuto" data-bs-slide="next">
              <div class="btn-next"></div>
            </button>
            <div class="img-container">
              <div class="img-size">
              
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    if (this.profileData.userId === this.account.id) {
      const storyHead = container.querySelector('.story-head');
      storyHead.innerHTML += `
      <div class="story-tool">
        <span class="material-symbols-outlined" id="edit-story" data-bs-target="#swapModal" data-bs-toggle="modal">
          edit
        </span>
        <span class="material-symbols-outlined" id="del-story">
          delete_forever
        </span>
      </div>
      `;
    }

    let imgSize = container.querySelector('.img-size');

    const carouselImg = new CarouselImg(this.profileData);
    imgSize.appendChild(carouselImg.render());

    return container.innerHTML;
  }
}

// 캐러셀 이미지 생성
class CarouselImg {
  constructor(data) {
    this.profileData = data;
  }
  render() {
    const carouselSlide = document.createElement('div');
    carouselSlide.className = 'carousel slide';
    carouselSlide.id = 'carouselAuto';

    const carouselIndicators = document.createElement('div');
    carouselIndicators.className = 'carousel-indicators';

    const carouselInner = document.createElement('div');
    carouselInner.className = 'carousel-inner';

    if (
      Array.isArray(this.profileData.storyImg) &&
      Array.isArray(this.profileData.storyText)
    ) {
      for (let i = 0; i < this.profileData.storyImg.length; i++) {
        const carouselItem = document.createElement('div');
        const carouselIndicator = document.createElement('button');

        carouselIndicator.type = 'button';
        carouselIndicator.setAttribute('data-bs-target', '#carouselAuto');
        carouselIndicator.setAttribute('data-bs-slide-to', i);
        carouselIndicator.setAttribute('aria-label', `Slide ${i + 1}`);

        carouselItem.dataset.index = i;
        if (i === 0) {
          carouselItem.className = 'carousel-item active';
          carouselIndicator.className = 'active';
          carouselIndicator.setAttribute('aria-current', 'true');
        } else {
          carouselItem.className = 'carousel-item';
        }

        const img = document.createElement('div');
        img.className = 'img';
        if (/^http.*/.test(this.profileData.storyImg[i])) {
          img.style.background = `url(${this.profileData.storyImg[i]})`;
          img.style.backgroundRepeat = 'no-repeat';
          img.style.backgroundSize = 'cover';
        } else {
          img.style.background = this.profileData.storyImg[i];
        }

        const textItem = this.profileData.storyText[i];

        const textContainer = document.createElement('div');
        textContainer.className = 'text-container';

        const textElement = document.createElement('textarea');
        textElement.className = 'text-area';
        textElement.setAttribute('disabled', 'true');
        textElement.innerHTML = textItem.text;
        textContainer.appendChild(textElement);

        textElement.style.color = textItem.color;

        carouselItem.appendChild(img);
        carouselInner.appendChild(carouselItem);
        carouselIndicators.appendChild(carouselIndicator);
        carouselItem.appendChild(textContainer);
      }
    }

    carouselSlide.appendChild(carouselIndicators);
    carouselSlide.appendChild(carouselInner);

    return carouselSlide;
  }
}

// 사이드 스토리 생성
class SideStory {
  constructor(data) {
    this.profileData = data;
  }
  render(name) {
    const container = document.createElement('div');

    container.innerHTML = `
      <div class="story-container ${name}" style="transform: scale(0.5)">
        <div class="side-story">
          <div class="img-container">
            <div class="img-size">
              <div class="img-item">
                <div class="img-div">
                  <div class="back-div"></div>
                  <div class="side-story-wrapper">
                    <div class="side-story-container">
                      <div class="side-story-img-container">
                        <span class="side-story-img-item">
                          <img class="side-story-img" src="${this.profileData.img}">
                        </span>
                      </div>
                      <div class="side-story-text-container">
                        <span class="side-story-text">${this.profileData.name}</span>
                      </div>
                    </div>
                  </div>
                  <div class="side-img"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // 이미지 배경 쓸 때 http 로 시작하는 주소면 url 로 인식하고 아니면 그냥 배경으로 인식
    const sideImg = container.querySelector('.side-img');
    if (/^http.*/.test(this.profileData.storyImg[0])) {
      sideImg.style.background = `url(${this.profileData.storyImg[0]})`;
    } else {
      sideImg.style.background = this.profileData.storyImg[0];
    }

    return container.innerHTML;
  }
}

window.customElements.define('storyview-component', StoryView, {
  extends: 'div',
});

export default StoryView;
