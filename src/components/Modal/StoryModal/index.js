import './storymodal.css';
class StoryModal extends HTMLDivElement {
  constructor(
    mode,
    defaultColor = '#ffffff',
    defaultText = '',
    defaultTextColor = '#000000'
  ) {
    super();
    this.className = 'modal-dialog';

    let id;
    this.defaultColor = defaultColor;
    this.defaultText = defaultText;
    this.defaultTextColor = defaultTextColor;

    if (mode === 'main') {
      id = 'storyModal';
    } else if (mode === 'edit') {
      id = `editStoryModal`;
    }

    this.id = id;
    this.mode = mode;
    this.check = false;

    this.num = 0;
    this.render();
  }

  render() {
    this.num = 0;
    this.check = false;
    this.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div id="num-0" class="num">
          <div class="color-picker">
            <div class="colors" style="background-color: #ffffff;"></div>
            <div class="colors" style="background-color: #ffadad;"></div>
            <div class="colors" style="background-color: #ffd6a5;"></div>
            <div class="colors" style="background-color: #fdffb6;"></div>
            <div class="colors" style="background-color: #caffbf;"></div>
            <div class="colors" style="background-color: #9bf6ff;"></div>
            <div class="colors" style="background-color: #a0c4ff;"></div>
            <div class="colors" style="background-color: #bdb2ff;"></div>
            <div class="colors" style="background-color: #000000;"></div>
          </div>

          <div class="img picker"> 
            <div class="mb-3">
              <label for="formFile" class="form-label"></label>
              <input class="form-control" type="file" id="formFile">
            </div>
          </div>
        </div>

        <div id="num-1" class="num" style="display: none;">
          <div class="writing" style="background: rgb(255, 255, 255);">
            <textarea class="text-write"></textarea>
          </div>
          <div class="font-color">
            <div class="fontColors" style="background-color: #ffffff;"></div>
            <div class="fontColors selected" style="background-color: #000000;"></div>
            <div class="fontColors" style="background-color: #2f4f4f;"></div>
          </div> 

        </div>
      </div>
      <div class="modal-footer">
        <button id="prev-button" type="button" class="btn btn-secondary" style="display: none;">Prev</button>
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button id="next-button" type="button" class="btn btn-primary">Next</button>
        <button id="finish-button" type="button" class="btn btn-primary" style="display: none;" data-bs-dismiss="modal">Finish</button>
        <button id="edit-button" type="button" class="btn btn-primary" style="display: none;" data-bs-dismiss="modal">Edit</button>
      </div>
    </div>`;

    // 만약 기본값이 다른 값이라면 그 값을 설정
    if (
      this.defaultColor != '#ffffff' ||
      this.defaultText != '' ||
      this.defaultTextColor != '#000000'
    ) {
      this.check = true;
      const colors = this.querySelectorAll('.colors');
      const rgbString = this.defaultColor.match(/rgb\(.*?\)/);
      if (this.defaultColor.match(/http/)) {
        this.pick = this.defaultColor;
      } else {
        colors.forEach((color) => {
          if (color.style.backgroundColor === rgbString[0]) {
            color.classList.add('selected');
          }
        });
      }

      const writingElement = this.querySelector('.writing');
      writingElement.style.background = this.defaultColor;

      const textWrite = this.querySelector('.text-write');
      textWrite.value = this.defaultText;
      textWrite.style.color = this.defaultTextColor;
    }

    // 다음 버튼 클릭시
    this.querySelector('#next-button').addEventListener('click', () => {
      if (this.num === 1) {
        return;
      }
      this.num++;

      const writingElement = this.querySelector('.writing');
      writingElement.style.background = this.pick;
      writingElement.style.backgroundRepeat = 'no-repeat';
      writingElement.style.backgroundSize = 'cover';
      writingElement.style.backgroundPosition = 'center';

      if (this.check === false) {
        writingElement.style.background = '#ffffff';
      }

      this.updateNum();
    });

    // 이전 버튼 클릭시
    this.querySelector('#prev-button').addEventListener('click', () => {
      this.num--;
      this.updateNum();
    });

    // 이미지 프리뷰
    const imagePreview = this.querySelector('#formFile');
    imagePreview.addEventListener('change', () => {
      this.check = true;
      const file = imagePreview.files[0];
      this.renderImg(file);
    });

    // 완료 버튼 클릭시 버블로 넘기기
    this.querySelector('#finish-button').addEventListener('click', (e) => {
      let background = this.querySelector('#formFile').files[0];
      if (background === undefined) {
        background = this.querySelector('.writing').style.background;
      }
      const textWrite = this.querySelector('.text-write');
      const text = textWrite.value;
      const textColor = textWrite.style.color;

      const event = new CustomEvent('finishButtonClicked', {
        bubbles: true,
        detail: { background, text, textColor },
      });
      document.dispatchEvent(event);
    });

    // 수정 버튼 클릭
    this.querySelector('#edit-button').addEventListener('click', (e) => {
      const writingElement = this.querySelector('.writing');
      const background = writingElement.style.background;
      const textWrite = this.querySelector('.text-write');
      const text = textWrite.value;
      const textColor = textWrite.style.color;

      // 새로운 커스텀 이벤트 생성해서 버블로 storyview 로 넘기기
      const event = new CustomEvent('editButtonClicked', {
        bubbles: true,
        detail: { background, text, textColor },
      });

      // 이벤트 발생
      document.dispatchEvent(event);
    });

    // 색깔 고를때 효과 + 고른 색 selected 클래스 추가 + 고른색으로 배경 변경
    this.colors = this.querySelectorAll('.colors');
    this.colors.forEach((color) => {
      color.addEventListener('click', (e) => {
        this.pick = e.target.style.backgroundColor;

        this.check = true;

        this.colors.forEach((color) => {
          color.classList.remove('selected');
        });

        e.target.classList.add('selected');
      });
    });

    // 글자색 변경
    this.fontColors = this.querySelectorAll('.fontColors');
    this.fontColors.forEach((fColor) => {
      fColor.addEventListener('click', (e) => {
        this.pick = e.target.style.backgroundColor;

        const textWrite = this.querySelector('.text-write');
        textWrite.style.color = this.pick;

        this.fontColors.forEach((fColor) => {
          fColor.classList.remove('selected');
        });

        e.target.classList.add('selected');
      });
    });

    // 배경 클릭해도 입력창 클릭되게
    const writingElement = this.querySelector('.writing');
    writingElement.addEventListener('click', () => {
      this.querySelector('.text-write').focus();
    });

    const textInput = this.querySelector('.text-write');
    textInput.addEventListener('input', function () {
      this.style.display = 'block';
      this.style.height = textInput.scrollHeight + 'px';
    });
  }

  // 이미지 미리보기
  renderImg(file) {
    const reader = new FileReader();
    reader.onload = () => {
      const writingElement = this.querySelector('.writing');
      writingElement.style.background = `url(${reader.result})`;
    };
    reader.readAsDataURL(file);
  }

  // 다음, 이전 버튼 클릭시 화면 업데이트
  updateNum() {
    this.querySelectorAll('.num').forEach((num) => {
      num.style.display = 'none';
    });

    this.querySelector(`#num-${this.num}`).style.display = 'flex';

    this.querySelector('#prev-button').style.display =
      this.num > 0 ? 'block' : 'none';
    this.querySelector('#next-button').style.display =
      this.num < 1 ? 'block' : 'none';

    if (this.num === 1) {
      if (this.mode === 'main') {
        this.querySelector('#finish-button').style.display = 'block';
        this.querySelector('#edit-button').style.display = 'none';
      } else if (this.mode === 'edit') {
        this.querySelector('#finish-button').style.display = 'none';
        this.querySelector('#edit-button').style.display = 'block';
      }
    } else {
      this.querySelector('#finish-button').style.display = 'none';
      this.querySelector('#edit-button').style.display = 'none';
    }
  }
}

window.customElements.define('story-modal', StoryModal, { extends: 'div' });

export default StoryModal;
