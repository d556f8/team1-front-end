import { createAccount, getAccountByNickname } from '../api/accounts';

class SignUpPage extends HTMLDivElement {
  constructor() {
    super();

    document.title = 'SignUp';

    this.innerHTML = `
      <div class="signup-container">
        <div id="signUpPage">
          <main class="container">
            <a data-link href='/' class="signup-logo">2951</a>
            <h2>현지 학기제의 사진과 동영상을 보려면 가입하세요.</h2>
            <!--SignUp FORM-->
            <form id="signUpForm" class="signUp_wrap" onsubmit="saveUserData(event)">
              <input type="text" name="nickname" placeholder="아이디"/>
              <input type="text" name="name" placeholder="성명"/>
              <input type="password" name="password" placeholder="비밀번호"/>
              <button id="signUpBtn" type="button" disabled="true">가입</button>
            </form>
          </main>
          <main class="container_login">
            <!--//LOGIN FORM-->
            <p>계정이 있으신가요?</p>
            <a data-link href="/login" class="moveToLogin">로그인</a>
          </main>
        </div>
      </div>
    `;
    this.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && this.checkFormData()) {
        this.signUp();
      }
    });

    this.signUpForm = this.querySelector('#signUpForm');

    // input 공백 제거 및 입력값 확인
    this.querySelectorAll('input').forEach((input) => {
      input.addEventListener('keyup', () => {
        input.value = input.value.trim();
        this.checkFormData();
      });
    });

    this.signUpBtn = this.querySelector('#signUpBtn');
    this.signUpBtn.addEventListener('click', async () => await this.signUp());
  }

  connectedCallback() {
    sessionStorage.clear();
  }

  checkFormData() {
    const name = this.signUpForm['name'].value;
    const nickname = this.signUpForm['nickname'].value;
    const password = this.signUpForm['password'].value;

    const isAnyFieldEmpty = !(name && nickname && password);
    const isContainsSpaces =
      /\s/.test(name) || /\s/.test(nickname) || /\s/.test(password);

    if (isAnyFieldEmpty || isContainsSpaces) {
      this.signUpBtn.disabled = true;
      this.signUpBtn.style.background = '';
      return false;
    }

    this.signUpBtn.style.background = '#52adff';
    this.signUpBtn.style.cursor = 'pointer';
    this.signUpBtn.disabled = false;
    return true;
  }

  async signUp() {
    const name = this.signUpForm['name'].value;
    const nickname = this.signUpForm['nickname'].value;
    const password = this.signUpForm['password'].value;

    const isExist = await getAccountByNickname(nickname);

    if (isExist) return alert('이미 존재하는 유저네임입니다.');

    const formData = {
      name,
      nickname,
      password,
      img: 'https://www.svgrepo.com/show/311063/person.svg',
    };

    await createAccount(formData);
    alert('회원가입이 완료되었습니다');
    this.pageChange();
  }

  pageChange() {
    const moveToLogin = document.createElement('a');
    moveToLogin.setAttribute('data-link', '');
    moveToLogin.setAttribute('href', '/login');

    document.body.appendChild(moveToLogin);

    moveToLogin.click();
  }
}

window.customElements.define('sign-up-page', SignUpPage, { extends: 'div' });

export default SignUpPage;
