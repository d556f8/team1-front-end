import './Header.css';
import Story from '../Story';
import { getProfiles } from '../../api/profiles';
import { exchangeComponent } from '../utils/exchangeComponent';

class Header extends HTMLElement {
  constructor(account) {
    super();

    this.currentOffset = 0;
    this.account = account;

    this.loadDatas();
  }

  async loadDatas() {
    try {
      this.profileData = await getProfiles();
      this.render();
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    this.innerHTML = `
    <div class="header">
      <div class="header-body">
        <div class="menu-wrapper">
          <div class="menu">
            <div class="story-wrapper">
              <story-component></story-component>
            </div>
            <button class="slider-button prev">
              <div class="btnN"></div>
            </button>
            <button class="slider-button next">
                <div class="btnN"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
    `;

    this.storyComponent = this.querySelector('story-component');
    exchangeComponent(this.storyComponent, new Story(this.account));

    const prevButton = this.querySelector('.prev');
    const nextButton = this.querySelector('.next');
    this.prevBtnHidden(prevButton);
    this.nextBtnHidden(nextButton);

    const prev = this.querySelector('.prev');
    prev.addEventListener('click', () => {
      this.slidePrev();
    });

    const next = this.querySelector('.next');
    next.addEventListener('click', () => {
      this.slideNext();
    });

    this.nextButtonCheck();
  }

  nextButtonCheck() {
    if (this.profileData.length > 7) {
      const nextButton = document.querySelector(".next");
      nextButton.classList.remove("hidden");
    }
  }

  // prev 버튼 숨기기
  prevBtnHidden(button) {
    if (this.currentOffset < 0) {
      button.classList.remove('hidden');
    } else {
      button.classList.add('hidden');
    }
  }

  // next 버튼 숨기기
  nextBtnHidden(button) {
    const sliderWrapper = this.querySelector('.story-wrapper');
    const sliderWidth = sliderWrapper.scrollWidth;
    const containerWidth = sliderWrapper.offsetWidth;
    const minOffset = -(sliderWidth - containerWidth);
    
    if (this.currentOffset == minOffset) {
      button.classList.add('hidden');
    } else {
      button.classList.remove('hidden');
    }
  }

  // 왼쪽으로 슬라이드
  slidePrev() {
    const sliderWrapper = this.querySelector('.story-wrapper');
    const itemWidth = 80;
    const maxOffset = 0;

    if (this.currentOffset < maxOffset) {
      this.currentOffset += itemWidth;
      if (this.currentOffset > maxOffset) {
        this.currentOffset = maxOffset;
      }
      sliderWrapper.scrollTo({
        left: -this.currentOffset,
        behavior: 'smooth',
      });
    }

    const prevButton = this.querySelector('.prev');
    this.prevBtnHidden(prevButton);
    const nextButton = this.querySelector('.next');
    this.nextBtnHidden(nextButton);
  }

  // 오른쪽으로 슬라이드
  slideNext() {
    const sliderWrapper = this.querySelector('.story-wrapper');
    const sliderWidth = sliderWrapper.scrollWidth; // story-wrapper의 총 너비
    const itemWidth = 80; // 아이템 크기
    const containerWidth = sliderWrapper.offsetWidth; // 컨테이너의 너비
    const minOffset = -(sliderWidth - containerWidth);

    if (this.currentOffset > minOffset) {
      this.currentOffset -= itemWidth;
      if (this.currentOffset < minOffset) {
        this.currentOffset = minOffset;
      }
      sliderWrapper.scrollTo({
        left: -this.currentOffset,
        behavior: 'smooth',
      });
    }

    const prevButton = this.querySelector('.prev');
    this.prevBtnHidden(prevButton);
    const nextButton = this.querySelector('.next');
    this.nextBtnHidden(nextButton);
  }
}

window.customElements.define('header-component', Header);

export default Header;
