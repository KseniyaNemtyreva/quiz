<script setup>
import axios from 'axios';
import { ref, computed } from 'vue';
import { vMaska } from "maska"

const questions = ref([]);
axios({
  method: 'get',
  url: 'http://orehovo672.tw1.ru/ajax/Creat_proekt.php',
}).then(function(response){
  questions.value = response.data;
  console.log(response.data);
})

const result = ref([])

const name = ref('')
const phone = ref('')
const email = ref('')

const quizCompleted = ref(false)
const currentQuestion = ref(0)

const DropActive = ref(false);

const getCurrentQuestion = computed(() => {
  let question = questions.value[currentQuestion.value]
  question.index = currentQuestion.value
  return question
})

const SetAnswer = (e) => {
  questions.value[currentQuestion.value].selected = e.target.value
  e.target.value = null
}

const NextQuestion = () => {
  if(result._rawValue[currentQuestion.value]){
    result._rawValue[currentQuestion.value].text = questions.value[currentQuestion.value].options[questions.value[currentQuestion.value].selected].text;
  }
  else{
    result.value.push(
      {
        question : getCurrentQuestion.value.question,
        text: questions.value[currentQuestion.value].options[questions.value[currentQuestion.value].selected].text
      }
    )
  }
  
  if (currentQuestion.value < questions.value.length - 1) {
    currentQuestion.value++;
    return
  }
  
  quizCompleted.value = true
}
const PrevQuestion = () => {
  if (!currentQuestion.value == 0) {
    currentQuestion.value--
    return
  }
}



const onFileChange = (e) =>{
  document.querySelector('#quiz-file-preview').innerHTML ="";
  const currFiles = e.target.files;
  console.log(e.target.files)
  if(currFiles.length > 0){
      if(currFiles.length > 6){
          alert("Вы не можете загружать больше 6 файлов");
      }else{
          let imagePreviewDiv = document.querySelector('#quiz-file-preview')
          for (let i = 0; i < currFiles.length; i++) {
              let src = URL.createObjectURL(currFiles[i])
              let img = document.createElement('img');
              img.src = src;
              img.style.display = 'block';
              imagePreviewDiv.append(img);
          }
      }
  }
}
const onFileDropEnter = ()=>{
  console.log('dropenter');
  DropActive.value = true;
}
const onFileDropLeave = ()=>{
  console.log('dropleave');
  DropActive.value = false;
  
}
const onFileDrop = (event) =>{
  DropActive.value = false;
  event.preventDefault();
  const file = event.dataTransfer?.files[0];
  if (!file) {
    return
  }
  let uploadInput = event.target.querySelector('#quiz-form__form-file');
  uploadInput.files = event.dataTransfer.files;

  event.target.querySelector('#quiz-file-preview').innerHTML = "";

  if(uploadInput.files.length > 0){
    if(uploadInput.files.length > 6){
        alert("Вы не можете загружать больше 6 файлов");
    }else{
        let imagePreviewDiv = event.target.querySelector('#quiz-file-preview')
        for (let i = 0; i < uploadInput.files.length; i++) {
            let src = URL.createObjectURL(uploadInput.files[i])
            let img = document.createElement('img');
            img.src = src;
            img.style.display = 'block';
            imagePreviewDiv.append(img);
        }
    }
  }
}


const SendForm = (e)  => {
  e.preventDefault(); 

  let form = e.target.parentElement;
  let data = new FormData(form);

  let resultString = '';
  result._rawValue.forEach(element => {
    resultString += element.question + ': ' + element.text + '</br>'
  });
  data.append('quiz', resultString);

  axios({
  method: 'post',
  url: 'http://orehovo672.tw1.ru/ajax/Send-quiz-form.php',
  data: data,
  accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
  datatype: 'json',
  }).then(function(response){
    console.log(response.data);
  })

}
</script>

<template>
  <div class="calculate-project__type-build" v-if="!quizCompleted">
    <h2 class="question">{{ getCurrentQuestion.question }}</h2>

    <div class="type-build__blocks">
      <div class="item-block" v-for="(option, index) in getCurrentQuestion.options">
        <label :for="'option' + index" :class="`custom-radio`">
          <div class="block__picture">
            <img :src="option.image" :alt="option.text">
          </div>
          <input type="radio" :id="'option' + index" :name="getCurrentQuestion.index" :value="index"
            v-model="getCurrentQuestion.selected" @change="SetAnswer">
          <span>{{ option.text }}</span>
        </label>
      </div>
    </div>

    <div class="type-build__buttons">
      <button class="type-build__back" @click="PrevQuestion">
        Назад
      </button>
      <button class="type-build__next" @click="NextQuestion" :disabled="!getCurrentQuestion.selected">
        Далее
      </button>
    </div>
  </div>

  <div class="calculate-project__type-build" v-else>
    <h2>Результат:</h2>
    <div class="calculate-project__result">
      <p  v-for="(resultData, resultIndex) in result" :key="resultIndex">
        {{ resultIndex+1 }}. {{ resultData.question }} : {{ resultData.text }}
      </p>
    </div>

    <div class="quiz-form" id="quiz-form">
      <form id="quiz" method="post" enctype="multipart/form-data" >
        <div class="quiz-form__form">
          <div class="quiz-form__form-block">
            <div class="quiz-form__form-block-inputs">
              <input v-model="name" type="text" class="quiz-form__form-name" id="quiz-form__form-name" name="name" placeholder="Ваше имя">
              <input v-model="phone" v-maska data-maska="+7(###)###-##-##" type="text" class="quiz-form__form-phone" id="quiz-form__form-phone" name="phone" required placeholder="Телефон для связи*">
              <input v-model="email" type="email" class="quiz-form__form-email" id="quiz-form__form-email" name="email" required placeholder="E-mail*">
            </div>
          </div>
          
          <div class="quiz-form__form-file-block" :class="{_active: DropActive}" id="file-enter-zone" @drop="onFileDrop" @dragenter="onFileDropEnter" @dragleave="onFileDropLeave"  @dragover.prevent @dragenter.prevent>
            <label for="quiz-form__form-file">Добавить ваше фото
              <input type="file"  @change="onFileChange" multiple style="visibility:hidden;position: absolute;" class="quiz-form__form-file" id="quiz-form__form-file" name="file[]" accept="image/*" aria-describedby="hint">
            </label>

            <div class="preview" id="quiz-file-preview">
              
            </div>
          </div>
          
          <div class="g-recaptcha" data-callback='captchaSubmit4' data-sitekey="6Lf-sVQoAAAAAJ0Pnxkv7nSbVJgyKMgzy8x6pD3C"></div>
          <div class="text-danger" id="recaptchaError"></div>
          <div class="quiz-form__form-approval">
            <input type="checkbox" id="switch4" checked required /><label for="switch4">Toggle</label>
            <span>Даю согласие на <a href="">обработку персональных данных</a></span>
          </div>
        </div>
          <button class="type-build__next" @click="SendForm">
            Отправить заявку
          </button>
      </form>
    </div>

  </div>
  <div style="width: 600px;margin: 0 auto;"></div>
</template>

<style scoped>
.asd{
  font-size: 30px;
  font-weight: 700;
  line-height: 34px;
}
.calculate-project__result{
  text-align: start;
  padding-bottom: 30px;
}
.custom-radio>input {
  position: absolute;
  z-index: -1;
  opacity: 0;
}

/* для элемента label связанного с .custom-radio */
.custom-radio>span {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* создание в label псевдоэлемента  before со следующими стилями */
.custom-radio>span::before {
  content: '';
  display: inline-block;
  height: 34px;
  width: 34px;
  border: 3px solid white;
  border-radius: 50%;
  background-repeat: no-repeat;
  background-position: center center;
  background-color: #D6DFEA;
  background-image: url("data:image/svg+xml,%3Csvg width='23' height='15' viewBox='0 0 23 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M3.06254 3.38229L12.6792 12.9989L10.4164 15.2617L0.799794 5.64503L3.06254 3.38229Z' fill='white'/%3E%3Cpath d='M22.8615 2.8166L10.4164 15.2617L8.1537 12.9989L20.5988 0.553862L22.8615 2.8166Z' fill='white'/%3E%3C/svg%3E ");
  transition: all 0.3s ease-in-out;
}

/* стили при наведении курсора на радио */
.custom-radio:hover span::before {
  background-color: #BD3A48;
}

/* стили для активной радиокнопки (при нажатии на неё) */
.custom-radio>input:not(:disabled):active+span::before {
  background-color: #BD3A48;
}

/* стили для радиокнопки, находящейся в состоянии checked */
.custom-radio>input:checked+span::before {
  background-color: #BD3A48;
}



* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Ubuntu', sans-serif;
}

body {
  background-color: #271c36;
  color: #2A333E;
}

.app {
  display: flex;
  flex-direction: column;
  padding: 2rem;
  height: 100vh;
  text-align: center;
}

button:disabled {
  opacity: 0.8;
}

.calculate-project__type-build {
  z-index: 2;
  max-width: 650px;
  background-color: #fff;
  max-height: 670px;
  overflow-y: auto;
  color: #2A333E;
  padding: 50px 14px
}

.calculate-project__type-build h2 {
  margin-bottom: 30px;
  font-size: 30px;
  font-weight: 500;
  line-height: 36px
}

.type-build__blocks {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  user-select: none
}

.block__picture img {
  width: 100%;
  max-width: 265px;
  max-height: 148px;
  overflow: hidden;
}

.type-build__blocks .item-block {
  text-align: center;
  position: relative;
  cursor: pointer;
}

.type-build__blocks .block__picture {
  margin-bottom: -25px;
}

.block__text {
  font-weight: 500;
  font-size: 18px;
  display: block;
  margin-top: 20px;
}

.item-block button {
  border: 3px solid white;
  background-color: #D6DFEA;
  border-radius: 50%;
  height: 34px;
  width: 34px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  position: absolute;
  bottom: -15px;
  left: 0;
  right: 0;
  margin: 0 auto;
  -webkit-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
}

.item-block button.active,
.item-block button:hover {
  background-color: #BD3A48;
}

.type-build__buttons {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  margin-top: 24px;
}

.type-build__back {
  font-size: 16px;
  font-weight: 500;
  color: #BD3A48;
  background-color: inherit;
  border: 1px solid #BD3A48;
  border-left: 6px solid #BD3A48;
  padding: 10px 15px 12px 13px
}

.type-build__next {
  margin-top: 10px;
  background-color: #BD3A48;
  font-size: 16px;
  font-weight: 500;
  color: white;
  border-left: 6px solid #2A333E;
  padding: 10px 15px 12px 13px
}

@media (min-width: 480px) {
  .type-build__blocks {
    grid: auto-flow/1fr 1fr;
  }

  .calculate-project__type-build {
    padding: 50px
  }
}


.quiz-form__title {
  text-align: center;
}
.quiz-form__title h2 {
  font-size: 30px;
  font-weight: 600;
  color: #2A333E;
}
.quiz-form__form {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
      -ms-flex-direction: column;
          flex-direction: column;
}
.quiz-form__form textarea,
.quiz-form__form input {
  background-color: #FFFFFF;
  border: 1px solid #BD3A48;
  font-size: 18px;
  font-weight: 500;
  color: #2A333E;
  padding: 15px;
}
.quiz-form__form textarea::-webkit-input-placeholder,
.quiz-form__form input::-webkit-input-placeholder {
  color: #2A333E;
}
.quiz-form__form textarea:not(:last-child),
.quiz-form__form input:not(:last-child) {
  margin-bottom: 20px;
}
.quiz-form__form-approval {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
      -ms-flex-align: center;
          align-items: center;
}
.quiz-form__form-approval input[type=checkbox] {
  height: 0;
  width: 0;
  visibility: hidden;
}
.quiz-form__form-approval label {
  cursor: pointer;
  text-indent: -9999px;
  width: 65px;
  height: 22px;
  background: grey;
  display: block;
  border-radius: 100px;
  position: relative;
}
@media (min-width: 480px) {
  .quiz-form__form-approval label {
    width: 35px;
  }
}
.quiz-form__form-approval label:after {
  content: "";
  position: absolute;
  top: 3px;
  left: 3.5px;
  width: 15px;
  height: 15px;
  background: #fff;
  border-radius: 90px;
  -webkit-transition: 0.3s;
  transition: 0.3s;
}
.quiz-form__form-approval input:checked + label {
  background: #BD3A48;
}
.quiz-form__form-approval input:checked + label:after {
  left: calc(100% - 5px);
  -webkit-transform: translateX(-100%);
          transform: translateX(-100%);
}
.quiz-form__form-approval label:active:after {
  width: 30px;
}
.quiz-form__form-approval span {
  font-weight: 500;
  color: #2A333E;
  margin-left: 10px;
}
.quiz-form__form-approval span a {
  color: #BD3A48;
  text-decoration: underline;
}
.quiz-form__form-btn {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
      -ms-flex-pack: center;
          justify-content: center;
  margin-top: 40px;
}
.quiz-form__form-btn button {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
      -ms-flex-pack: center;
          justify-content: center;
  -webkit-box-align: center;
      -ms-flex-align: center;
          align-items: center;
  background-color: #BD3A48;
  border-left: 6px solid #2A333E;
  color: #FFFFFF;
  padding: 10px 20px 12px 20px;
}
.quiz-form__form-file-block {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
      -ms-flex-pack: center;
          justify-content: center;
  -webkit-box-align: center;
      -ms-flex-align: center;
          align-items: center;
  padding: 50px 10px 70px 10px;
  border: 2px dashed #BD3A48;
  border-radius: 30px;
  margin-bottom: 20px;
}
.quiz-form__form-file-block label {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
      -ms-flex-align: center;
          align-items: center;
  padding: 10px 20px;
  background-color: inherit;
  border: 1px solid #BD3A48;
  border-left: 6px solid #BD3A48;
  color: #BD3A48;
}
.quiz-form__form-block {
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
  margin-bottom: 30px;
}

.quiz-form__form-block-inputs {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
      -ms-flex-direction: column;
          flex-direction: column;
}
.quiz-form__form-block-textarea {
  margin-top: 30px;
}
@media (min-width: 1024px) {
  .quiz-form__form-block-textarea {
    margin-top: unset;
  }
}
.quiz-form__form-block-textarea textarea {
  height: 100%;
  width: 100%;
}
</style>