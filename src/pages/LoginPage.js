import { login } from '../api/accounts';
import MainPage from './MainPage';

class LoginPage extends HTMLDivElement {
  constructor() {
    super();

    this.innerHTML = `
      <div id="login-page">
        <div class="login-container">

          <div class="login-left-container">
            <div class="left-image">
              <img src="https://cdn.pixabay.com/photo/2016/11/18/11/16/instagram-1834010_1280.png" alt="login-img">
            </div>
          </div>

          <div class="login-right-container">
            <div class="right-form">
              <a data-link href='/' class="login-logo">2951</a>
              <form id="loginForm">
                <input type="text" name="nickname" placeholder="Username" required>
                <input type="password" name="password" placeholder="Password" required>
                <button class="btn-login" type="button">로그인</button>
              </form>
            </div>
            <div class="right-footer">
              <p>계정이 없으신가요? <a data-link href="/signup">회원가입</a></p>
            </div>
          </div>

        </div>
      </div>
    `;

    this.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.tryLogin();
      }
    });

    this.loginForm = this.querySelector('#loginForm');
    this.loginBtn = this.querySelector('.btn-login');
    this.loginBtn.addEventListener('click', async () => await this.tryLogin());
  }

  async tryLogin() {
    const nickname = this.loginForm['nickname'].value;
    const password = this.loginForm['password'].value;

    try {
      const token = await login(nickname, password);
      sessionStorage.setItem('userToken', token);
    } catch (e) {
      alert(e.message);
      return;
    }

    this.pageChange();
  }

  pageChange() {
    const moveToLogin = document.createElement('a');
    moveToLogin.setAttribute('data-link', '');
    moveToLogin.setAttribute('href', '/');

    document.body.appendChild(moveToLogin);

    moveToLogin.click();
  }
}

window.customElements.define('login-page', LoginPage, { extends: 'div' });

export default LoginPage;
