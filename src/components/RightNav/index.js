import './RightNav.css';
import '../Story';
import Post from '../Post';
import { getCategories } from '../../api/categories';
import { exchangeComponent } from '../utils/exchangeComponent';
import { uploadImg } from '../../api/thumbsnap';
import { getAccountById, updateProfileImg } from '../../api/accounts';

class RightNav extends HTMLElement {
  constructor(account) {
    super();

    this.account = account;
    this.categories = [];
  }

  async connectedCallback() {
    try {
      this.categories = await getCategories();
      this.render();
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    this.innerHTML = `
    <div class="right-nav-container">
      <div class="right-nav-box">

        <div class="right-nav-header">
          <div class="nav-info">
            
          </div>
        </div>

        <div class="right-nav-body">
          <div class="right-nav-body-header">카테고리</div>
          <div class="right-nav-body-content">
            <div class="right-nav-body-content-item">
              ${new NavItem(this.categories).render()}
            </div>
          </div>
        </div>

      </div>
    </div>
    `;

    if (this.account) {
      const navInfo = this.querySelector('.nav-info');
      navInfo.innerHTML = `
      <div class="nav-info-img-box">
        <div class="nav-info-img">
          <label for="profileImgFile">
            <img src="${this.account.img}" alt="프로필 사진">
          </label>
          <input id="profileImgFile" type="file" hidden>
        </div>
      </div>   
      <div class="nav-info-text">
        <span class="info-nickname">${this.account.nickname}</span>
        <span class="info-name">${this.account.name}</span>
      </div>
      `;

      const profileImgFile = this.querySelector('#profileImgFile');
      profileImgFile.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        const img = await uploadImg(file);
        await updateProfileImg(this.account.id, img);
        this.account = await getAccountById(this.account.id);
        exchangeComponent(this, new RightNav(this.account));
      });
    } else {
      const navInfo = this.querySelector('.nav-info');
      navInfo.innerHTML = `
        <div class="not-login">
          <div class="not-login-text">
            <span><a data-link href="/login">로그인</a>이 필요합니다.</span>
          </div>
        </div>
        `;
    }

    const rightNavItems = this.querySelectorAll('.right-nav-item');
    rightNavItems.forEach((item) => {
      item.addEventListener('click', () => {
        const id = item.dataset.id;
        const postContainer = document.querySelector('post-container');
        exchangeComponent(postContainer, new Post(this.account, id));
      });
    });
  }
}

class NavItem {
  // data = categories의 개체
  constructor(data) {
    this.account = data;
    this.render();
  }

  render() {
    let NavItem = document.createElement('div');

    this.account.forEach((item) => {
      NavItem.innerHTML += `
        <div class="right-nav-item" data-id="${item.id}">
          <div class="right-nav-item-contain">
            <div class="nav-info">
              <div class="nav-info-img-box">
                <div class="nav-info-img">
                  <img src="${item.img}" alt="프로필 사진">
                </div>
              </div>
              <div class="nav-info-text">
                <span class="info-nickname">${item.name}</span>
                <span class="info-name">${item.info}</span>
              </div>
            </div>
          </div>  
        </div>
      `;
    });

    return NavItem.innerHTML;
  }
}

window.customElements.define('rightnav-component', RightNav);

export default RightNav;
