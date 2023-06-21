import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import MainPage from './pages/MainPage.js';
import StoryPage from './pages/StoryPage.js';
import LoginPage from './pages/LoginPage.js';
import SignUpPage from './pages/SignUpPage.js';

var root = document.querySelector('#root');

// 페이지 전환
// history.pushState(state, title, URL) : 현재 페이지의 상태를 변경하지 않고, 새로운 주소를 추가
const routerLink = (url) => {
  history.pushState(null, null, url);
  router();
};

const router = async () => {
  // 경로 설정
  const routes = [
    { path: '/', view: MainPage },
    { path: '/login', view: LoginPage },
    { path: '/story', view: StoryPage },
    { path: '/signup', view: SignUpPage },
    { path: '/404', view: () => console.log('Viewing 404') },
  ];

  // 현재 접속되어있는 주소와 일치하는 경로를 찾기
  const matchedPage = routes.find((route) => route.path === location.pathname);

  // 일치하는 경로가 없으면 404(맨 마지막 위치)로 이동
  if (!matchedPage) {
    matchedPage = routes[routes.length - 1];
  }

  root.innerHTML = '';
  root.appendChild(new matchedPage.view());
  // root.appendChild(new SignUpPage());
};

// 뒤로가기나 새로고침을 했을 때 router함수 실행
window.addEventListener('popstate', router);

// 렌더링 되면 router함수 실행
document.addEventListener('DOMContentLoaded', () => {
  // 클릭했을 때 data-link 속성이 있으면 routerLink 함수 실행
  document.body.addEventListener('click', (e) => {
    if (e.target.matches('[data-link]')) {
      e.preventDefault();
      routerLink(e.target.href);
    }
  });

  window.addEventListener('popstate', router);

  router();
});
