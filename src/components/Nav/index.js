import MainPage from '../../pages/MainPage';

import Post from '../Post';
import CreatePostModal from '../Modal/CreatePostModal';
import SearchModal from '../Modal/SearchModal';
import './Nav.css';

import { exchangeModal } from '../utils/exchangeModal';
import { exchangeComponent } from '../utils/exchangeComponent';

class Nav extends HTMLDivElement {
  constructor(account) {
    super();

    this.account = account;

    this.classList.add('nav-full');

    this.innerHTML = `
      <div class="nav-header-logo">
        <div class="header-logo">
          <div>
            <span class="logo-text">2951</span>
          </div>
        </div>
      </div>
      <div class="nav-list-contain flex-fill">
        <ul class="nav-list">
          <li class="nav-home">
            <div>
              <object data="/assets/image/icons/home.svg"></object>
              <span class="item-name">홈</span>
            </div>
          </li>
          <li class="nav-search" data-bs-toggle="modal" data-bs-target="#swapModal">
            <div>
              <object data="/assets/image/icons/search.svg"></object>
              <span class="item-name">검색</span>
            </div>
          </li>
          <li class="nav-add" data-bs-toggle="modal" data-bs-target="#swapModal">
            <div>
              <object data="/assets/image/icons/add.svg"></object>
              <span class="item-name">만들기</span>
            </div>
          </li>
        </ul>
        <div class="dropup">
          <div class="nav-other" data-bs-toggle="dropdown" aria-expanded="false">
            <object data="/assets/image/icons/other.svg"></object>
            <span class="item-name">더 보기</span>
          </div>
          <div class="other-menu dropdown-menu">  
            <div class="menu-list">
              <a class="other-settings">
                <div>
                  <object data="/assets/image/icons/settings.svg"></object>
                  <span class="item-name">설정</span>
                </div>
              </a>
              <a class="other-activities">
                <div>
                  <object data="/assets/image/icons/activities.svg"></object>
                  <span class="item-name">내 활동</span>
                </div>
              </a>
              <a class="other-logout">
                <div>
                  <span class="item-name">로그아웃</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
    this.navHome = this.querySelector('.nav-home');
    this.navSearch = this.querySelector('.nav-search');
    this.navAdd = this.querySelector('.nav-add');
    this.otherSettings = this.querySelector('.other-settings');
    this.otherActivities = this.querySelector('.other-activities');
    this.otherLogout = this.querySelector('.other-logout');

    // 1. 홈 버튼: 클릭 시 fetch 후 (`root` 모든 것을 재 렌더링), window의 스크롤을 최상단으로 이동
    this.navHome.addEventListener('click', this.homeEvent);

    // 2. 검색 버튼: 클릭 시 검색하는 창 띄우기 sidebar 옆으로
    this.navSearch.addEventListener('click', this.searchEvent);

    // 3. 만들기 버튼: 클릭 시 `사진과 동영상을 끌어다 놓으세요` 컴포넌트 작성
    this.navAdd.addEventListener('click', () => this.addEvent());

    // 4. 설정 버튼:
    this.otherSettings.addEventListener('click', () => {});

    // 5. 내 활동 버튼:
    this.otherActivities.addEventListener('click', () => {});

    this.otherLogout.addEventListener('click', () => this.logoutEvent());

    // 로그인 상태가 아니면 만들기 버튼 제거
    if (!this.account) {
      this.navAdd.remove();
    }
  }

  // root 재 렌더링
  homeEvent() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const postContainer = document.querySelector('post-container');
    exchangeComponent(postContainer, new Post(this.account));
  }

  // 만들기 버튼 클릭 시, 기존 Modal을 PostModal로 교체
  addEvent() {
    exchangeModal(new CreatePostModal(this.account));
  }

  // 검색 버튼 클릭 시, 기존 Modal을 SearchModal로 교체
  searchEvent() {
    exchangeModal(new SearchModal());
  }

  logoutEvent() {
    sessionStorage.removeItem('userToken');
    const root = document.querySelector('#root');
    root.innerHTML = '';
    root.appendChild(new MainPage());
  }
}

window.customElements.define('nav-component', Nav, { extends: 'div' });

export default Nav;
