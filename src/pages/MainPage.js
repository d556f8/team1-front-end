import Nav from '../components/Nav';
import Header from '../components/Header';
import Post from '../components/Post';
import RightNav from '../components/RightNav';
import { logon } from '../api/accounts';
import { exchangeComponent } from '../components/utils/exchangeComponent';

class MainPage extends HTMLDivElement {
  constructor() {
    super();
    this.classList.add('main');

    this.account = null;
    this.userToken = sessionStorage.getItem('userToken');

    // 기본 템플릿
    this.innerHTML = `
    <div class="main-nav">
      <div is="nav-component" id="nav"></div>
    </div>

    <main class="main-body-wrapper">

      <div class="right-body">
        <div class="main-body">
          <Header-component id="header"></Header-component>
          <div class="inner">
            <post-container id="post"></post-container>
          </div>
        </div>

        <div class="right-nav">
          <rightnav-component id="right-nav"></rightnav-component>
        </div>
      </div>
      
    </div>
    `;

    this.navComponent = this.querySelector('#nav');
    this.headerComponent = this.querySelector('#header');
    this.postComponent = this.querySelector('#post');
    this.rightNavComponent = this.querySelector('#right-nav');
  }

  async connectedCallback() {
    // 현재 접속한 유저 정보를 받아온다.
    try {
      this.account = await logon(this.userToken);
    } catch (error) {
      console.error(error);
    }

    // 로그온 이후 렌더링
    this.render();
  }

  render() {
    exchangeComponent(this.navComponent, new Nav(this.account));
    exchangeComponent(this.headerComponent, new Header(this.account));
    exchangeComponent(this.postComponent, new Post(this.account));
    exchangeComponent(this.rightNavComponent, new RightNav(this.account));
  }
}

window.customElements.define('main-page', MainPage, { extends: 'div' });

export default MainPage;
