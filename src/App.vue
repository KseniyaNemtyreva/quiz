<script setup>
import axios from 'axios';
import { ref, computed, VueElement } from 'vue';
import { vMaska } from "maska";

import { RecaptchaV2, useRecaptcha } from "vue3-recaptcha-v2";
const { handleReset } = useRecaptcha();


const questions = ref([]);
axios({
  method: 'get',
  url: '/ajax/Creat_proekt.php',
}).then(function(response){
  questions.value = response.data;
})

const result = ref([])

const name = ref('')
const phone = ref('')
const email = ref('')

let arFiles = ref([])
let size = ref('')

const quizCompleted = ref(false)
const currentQuestion = ref(0)

const DropActive = ref(false);
let catalogURl = ref('')

const getCurrentQuestion = computed(() => {
  let question = questions.value[currentQuestion.value]
  question.index = currentQuestion.value
  return question
})

const SetAnswer = (e) => {
  questions.value[currentQuestion.value].selected = e.target.value
  e.target.value = null
}

const clearPhoneError = (e) =>{
  document.querySelector('#error-phone').innerHTML = '';
}

const clearEmailError = (e) =>{
  document.querySelector('#error-email').innerHTML = '';
}

let site_link = window.location.origin+'/catalog/all/?';
const params = new URLSearchParams();
const NextQuestion = () => {   
  let url = site_link + params.toString();
  let catalogUrlInter = new URL(url);
  if(result._rawValue[currentQuestion.value]){
    result._rawValue[currentQuestion.value].text = questions.value[currentQuestion.value].options[questions.value[currentQuestion.value].selected].text;
    catalogUrlInter.searchParams.forEach(function(value, key) {      
      if(key == getCurrentQuestion.value.index){
        params.delete(getCurrentQuestion.value.index);
      }      
    });
    params.append(getCurrentQuestion.value.index, questions.value[currentQuestion.value].options[questions.value[currentQuestion.value].selected].text);
  }
  else{
    params.append(getCurrentQuestion.value.index, questions.value[currentQuestion.value].options[questions.value[currentQuestion.value].selected].text);

    result.value.push(
      {
        question : getCurrentQuestion.value.question,
        text: questions.value[currentQuestion.value].options[questions.value[currentQuestion.value].selected].text
      }
    )
  }       
  url = site_link + params.toString();
  catalogUrlInter = new URL(url);
  catalogURl = catalogUrlInter.href
  
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


const onChange = (event) => {
  // приходится к input[type="file"] инициировать js, т.к. v-bind/ref не дают впоследствии его изменять
  let uploadInput = document.querySelector('#quiz-form__form-file')
  let validFiles = new DataTransfer();
  let validSize = 0;

  // starts when drop
  if (event.target == null) {
    if (event.files.length > 0) {
      if (event.files.length > 10) {
        alert("Вы не можете загружать больше 10 файлов");
        uploadInput.files = validFiles.files; // поставили пустое значение
        return;
      }
      arFiles.value.length = 0;
      for (const file of event.files) {
        if (isValidFile(file)) {
          validFiles.items.add(file);
          validSize += file.size
          arFiles.value.push(file);         
        }
      }      
      uploadInput.files = validFiles.files;  

      for (const child of document.querySelector('.quiz-form__form-file-block').children) {
        child.style.pointerEvents = "auto";
      }
    } else {
      console.log('error when drop')
    }
  }
  // starts when change
  else {
    if (event.target.files.length > 0) {
      if (event.target.files.length > 10) {
        alert("Вы не можете загружать больше 10 файлов");
        uploadInput.files = validFiles.files; // поставили пустое значение
        return;
      }
      arFiles.value.length = 0;
      for (const file of event.target.files) {
        if (isValidFile(file)) {
          validFiles.items.add(file);
          validSize += file.size
          arFiles.value.push(file);          
        }
      }
      uploadInput.files = validFiles.files;   

      for (const child of document.querySelector('.quiz-form__form-file-block').children) {
        child.style.pointerEvents = "auto";
      }
    } else {
      console.log('error change')
    }
  }
  var sizeFormat = new Array('Байт', 'КБ', 'МБ', 'ГБ'),  i=0;
  while(validSize>900){validSize/=1024;i++;}
  size = (Math.round(validSize*100)/100)+' '+sizeFormat[i];
}

const generateThumbnail = (file) => {
  console.log('generateImg')
  let fileSrc = URL.createObjectURL(file);
  setTimeout(() => {
    URL.revokeObjectURL(fileSrc);
  }, 1000);
  return fileSrc;
}

function remove(i) {
  let validFiles = new DataTransfer();
  let uploadInput = document.querySelector('#quiz-form__form-file')
  let validSize = 0;
  arFiles.value.splice(i, 1);
  for (const file of arFiles._rawValue) {
    if (isValidFile(file)) {
      validFiles.items.add(file);
      validSize += file.size
    }
  }
  uploadInput.files = validFiles.files;
  var sizeFormat = new Array('Байт', 'КБ', 'МБ', 'ГБ'),  i=0;
  while(validSize>900){validSize/=1024;i++;}
  size = (Math.round(validSize*100)/100)+' '+sizeFormat[i];
}

const removeAll = () => {
  arFiles.value.length = 0
  document.querySelector('#quiz-form__form-file').value = ''
}

const dragover = (e) => {
  e.preventDefault();
  DropActive.value = true;
  for (const child of document.querySelector('.quiz-form__form-file-block').children) {
    child.style.pointerEvents = "auto";
  }
}

const dragleave = () => {
  DropActive.value = false;
  for (const child of document.querySelector('.quiz-form__form-file-block').children) {
    child.style.pointerEvents = "auto";
  }
}

const dragenter = () => {
  DropActive.value = true;

  for (const child of document.querySelector('.quiz-form__form-file-block').children) {
    child.style.pointerEvents = "none";
  }
}

const drop = (e) => {
  e.preventDefault();
  const filesArr = e.dataTransfer.files;
  let validFiles = new DataTransfer();

  for (const file of filesArr) {
    if (isValidFile(file)) {
      validFiles.items.add(file);
    }
  }
  
  for (const child of document.querySelector('.quiz-form__form-file-block').children) {
    child.style.pointerEvents = "auto";
  }
  DropActive.value = false;
  onChange(validFiles);
}


function isValidFile(file) {
  const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'application/pdf',
  ];

  if (file.size > 20 * 1024 * 1024) {
    alert(file.name + ' слишком большой. Максимальный размер 20МБ!')
    return false;
  }

  if (!allowedTypes.includes(file.type)) {
    alert(file.name + ' имеет неподдерживаемый тип!')
    return false;
  }

  return true;
}


let widgetIdGlob;
const handleWidgetId = (widgetId) => {
  console.log("Widget ID: ", widgetId);
  widgetIdGlob = widgetId;
};

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
  url: '/ajax/Send-quiz-form.php',
  data: data,
  accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
  datatype: 'json',
  }).then(function(response){
    let calcProjectForm= document.querySelector('.calculate-project__type-build');
    
    handleReset(widgetIdGlob);

    if(response.data['code'] == 4){
      document.querySelector('#error-phone').innerHTML = '<span style="text-align:left;color:var(--red);font-size:14px;font-weight:600;">Вы не указали телефон!</span>';
    }
    if(response.data['code'] == 3){
      document.querySelector('#error-email').innerHTML = '<span style="text-align:left;color:var(--red);font-size:14px;font-weight:600;">Вы не указали почту!</span>';
    }
    if(response.data['code'] == 2){
      document.querySelector('#error-quiz').innerHTML = '<span style="text-align:left;color:var(--red);font-size:20px;font-weight:700;">Произошла неизвестная ошибка!</span>';
    }
    if(response.data['code'] == 0){
      calcProjectForm.innerHTML = `
      <div class="success-form__quiz-block">
        <div>
          <svg width="132" height="132" viewBox="0 0 132 132" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_1432_19613)">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M66 0C29.5969 0 0 29.5969 0 66C0 102.403 29.5969 132 66 132C102.403 132 132 102.403 132 66C132 29.5969 102.403 0 66 0Z" fill="#4BAE4F"/>
          <path d="M53.2898 96.1899C44.8594 87.7594 36.4805 79.2516 28.0242 70.8211C27.0961 69.893 27.0961 68.3461 28.0242 67.418L37.7438 57.6985C38.6719 56.7704 40.2188 56.7704 41.1469 57.6985L55.043 71.5946L90.7758 35.836C91.7297 34.9079 93.2508 34.9079 94.2047 35.836L103.95 45.5813C104.904 46.5352 104.904 48.0563 103.95 48.9844L56.693 96.1899C55.7648 97.1438 54.2438 97.1438 53.2898 96.1899Z" fill="white"/>
          </g>
          <defs>
          <clipPath id="clip0_1432_19613">
          <rect width="132" height="132" fill="white"/>
          </clipPath>
          </defs>
          </svg>
        </div>
        <div class="success-form-quiz">
          <span>Спасибо! Ваша заявка отправлена</span>
        </div>
        <a class="success-form__quiz-url" href="${catalogURl}">
          Посмотреть похожие проекты
        </a>
      </div>
      
      `
    }
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
      <button class="type-build__back btn-white" @click="PrevQuestion">
        Назад
      </button>
      <button type="submit" class="type-build__next btn-red" @click="NextQuestion" :disabled="!getCurrentQuestion.selected">
        Далее
      </button>
    </div>
  </div>

  <div class="calculate-project__type-build" v-else>
    <h2 class="calculate-project__type-build__result">Результат:</h2>
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
              <input v-model="name" type="text" class="quiz-form__form-name" id="quiz-form__form-name" name="name" placeholder="Имя*">
              <div id="error-phone"></div>
              <input v-model="phone" type="phone" @change="clearPhoneError" v-maska data-maska="+7(###)###-##-##" class="quiz-form__form-phone" id="quiz-form__form-phone" name="phone" required placeholder="Телефон для связи*">
              <div id="error-email"></div>
              <input v-model="email" type="email" @change="clearEmailError" class="quiz-form__form-email" id="quiz-form__form-email" name="email" required placeholder="E-mail*">
            </div>
          </div> 
          <a class="quiz-url" :href="catalogURl">
            Посмотреть похожие проекты
          </a>        
          <div class="quiz-form__form-file-block" v-bind:class="{_active: DropActive}" id="file-enter-zone" @dragover="dragover" @dragleave="dragleave" @drop="drop" @dragenter="dragenter" @dragover.prevent @dragenter.prevent>
            <div class="quiz-file-preview-info">
              <span id="quiz-file-count" v-if="arFiles.length">{{ size }}</span>
              <span id="quiz-file-size" v-if="arFiles.length">{{ arFiles.length }} файла</span>
              <button @click="removeAll" type="button" id="quiz-file-remove-all" v-if="arFiles.length"> Удалить все</button>
            </div>
            <div class="preview" id="quiz-file-preview">                    
              <div v-for="(file, index) in arFiles" :key="file.name" :data-id="index" class="quiz-file__preview-img" >
                <img :src="generateThumbnail(file)" style="display: block;">
                <button class="quiz-file__preview-close" type="button" @click="remove(arFiles.indexOf(file))">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <g clip-path="url(#clip0_319_6585)">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M7 0C10.8654 0 14 3.13462 14 7C14 10.8654 10.8654 14 7 14C3.13462 14 0 10.8654 0 7C0 3.13462 3.13462 0 7 0ZM3.46197 9.53372L5.99569 7L3.46197 4.46628C3.31662 4.32087 3.31662 4.0837 3.46197 3.93835L3.93835 3.46197C4.0837 3.31662 4.32087 3.31662 4.46628 3.46197L7 5.99569L9.53372 3.46197C9.67913 3.31662 9.9163 3.31662 10.0616 3.46197L10.538 3.93835C10.6834 4.0837 10.6834 4.32087 10.538 4.46628L8.00431 7L10.538 9.53372C10.6834 9.67913 10.6834 9.9163 10.538 10.0616L10.0616 10.538C9.9163 10.6834 9.67913 10.6834 9.53372 10.538L7 8.00431L4.46628 10.538C4.32087 10.6834 4.0837 10.6834 3.93835 10.538L3.46197 10.0616C3.31662 9.9163 3.31662 9.67913 3.46197 9.53372Z" fill="#F5F5F2"></path>
                    </g>
                    <defs>
                      <clipPath id="clip0_319_6585">
                        <rect width="14" height="14" fill="white"></rect>
                      </clipPath>
                    </defs>
                  </svg>
                </button>
              </div>
            </div>
            <label for="quiz-form__form-file" class="btn-white">Добавить фото
              <input type="file" @change="onChange" multiple class="quiz-form__form-file" id="quiz-form__form-file" name="file[]" aria-describedby="hint">
            </label>            
          </div>
          <div class="custom-cuptha">
            <RecaptchaV2 @widget-id="handleWidgetId"/>
          </div>
          <div class="text-danger" id="recaptchaError"></div>
          <div class="quiz-form__form-approval">
            <input type="checkbox" id="switch4" checked required /><label for="switch4">Toggle</label>
            <span>Даю согласие на <a href="">обработку персональных данных</a></span>
          </div>
        </div>
          <button class="type-build__next btn-red" @click="SendForm">
            Отправить заявку
          </button>
          <div id="error-quiz"></div>
      </form>
    </div>
  </div>
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
  position:relative;
  z-index: 2;
  max-width: 650px;
  background-color: #fff;
  max-height: 670px;
  overflow-y: auto;
  color: #2A333E;
  padding: 50px 14px;
}
/* Скрываем scrollbar для Chrome, Safari и Opera */
.calculate-project__type-build::-webkit-scrollbar {
  display: none;
}

/* Скрываем scrollbar для IE, Edge и Firefox */
.calculate-project__type-build {
  -ms-overflow-style: none;  /* IE и Edge */
  scrollbar-width: none;  /* Firefox */
}

.calculate-project__type-build h2 {
  margin-bottom: 30px;
  font-size: 30px;
  font-weight: 500;
  line-height: 36px;
  text-align: center
}

.type-build__blocks {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  user-select: none
}

.block__picture img {
  width: 100%;
  max-width: 290px;
  max-height: 164px;
  overflow: hidden;
}

.type-build__blocks .item-block {
  text-align: center;
  position: relative;
  cursor: pointer;
}

.type-build__blocks .block__picture {
  margin-bottom: -25px;
  z-index: -1;
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

form#quiz {
  display: flex;
  flex-direction: column;
}
.type-build__next {
  background-color: #BD3A48;
  font-size: 16px;
  font-weight: 500;
  color: white;
  border-left: 6px solid #2A333E;
  padding: 10px 15px 12px 13px;
  width: fit-content;
  align-self: center;
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
  margin-bottom: 10px;
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
.quiz-form__form-file{
  visibility:hidden;
  position: absolute;
}
.quiz-form__form-file-block {
  flex-direction: column;
  padding: 50px 20px;
  overflow: hidden;  
  position: relative;
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

.quiz-form__form-file-block .preview{
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  left: 0;
  top: 0px;
  width: 100%;
}
.success-form-quiz{
  margin-top: 10px;

  font-size: 30px;
  font-weight: 500;
  line-height:36px;
  text-align: center;
}
#error-phone,
#error-email{
  text-align: left;
}
.success-form__quiz-block{
  display: flex;
    flex-direction: column;
    align-items: center;
}

.type-build__blocks{
  min-height: 365px;
}
h2.question{
  min-height: 75px;
}


.quiz-file-preview-info {
  position: absolute;
  top: 11px;
  left: 30px;
}

.quiz-file-preview-info span {
  margin-right: 10px;
}

.quiz-file__preview-close {
  background: unset;
  position: absolute;
  top: 3px;
  right: 2px;
}

.quiz-file__preview-img {
  position: relative;
  height: 104px;
}
.quiz-file__preview-img:last-child{
  margin-bottom: 20px;
}
.quiz-file__preview-img img {
  height: 100%;
  object-fit: cover;
  width: 100%;
}
span#quiz-file-count {
color: #2A333E;
font-size: 14px;
font-weight: 500;
line-height: 160%;
letter-spacing: 0.42px;
}
span#quiz-file-size{
  color: #7B7A79;
  font-size: 14px;
  font-weight: 500;
  line-height: 160%;
  letter-spacing: 0.42px;
}
button#quiz-file-remove-all{
  color: #7B7A79;
  background: unset;
  font-family: Montserrat;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 160%; /* 22.4px */
  letter-spacing: 0.42px;
}
.quiz-form__form-file-block._active{
  background-color: #bd3a4826;
  transition: all 0.2s ease-in-out;
}
.success-form__quiz-url:hover,
.quiz-ur:hover{
  text-decoration: underline;
}

.quiz-url{
  color: #BD3A48;
  margin: 10px 0;
  text-align: center;
}
</style> 