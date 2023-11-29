<script setup>
import axios from 'axios';
import { ref, computed, VueElement } from 'vue';
import { vMaska } from "maska";

import { RecaptchaV2, useRecaptcha } from "vue3-recaptcha-v2";
const { handleReset } = useRecaptcha();


// const questions = ref([]);
// axios({
//   method: 'get',
//   url: '/ajax/Creat_proekt.php',
// }).then(function(response){
//   questions.value = response.data;
// })

const questions = ref([
  {"question":"\u0421\u043a\u043e\u043b\u044c\u043a\u043e \u044d\u0442\u0430\u0436\u0435\u0439 \u0431\u0443\u0434\u0435\u0442?","options":[{"text":"\u041e\u0434\u0438\u043d","image":"\/upload\/iblock\/b6f\/nwuqyvrhejd6sqdf0yvazwdo786xiasu.jpeg"},{"text":"\u0414\u0432\u0430","image":"\/upload\/iblock\/479\/k5d12vkldkqwby90q4l03z4ux7ihk21q.jpeg"},{"text":"\u0422\u0440\u0438","image":"\/upload\/iblock\/717\/3znx8igzqqim0ghse1pg1xb084om015k.jpeg"},{"text":"\u0415\u0449\u0451 \u043d\u0435 \u0440\u0435\u0448\u0438\u043b","image":"\/upload\/iblock\/809\/2e1kocbth91667mkwiyuot5mahkz5bxd.png"}],"selected":null},
  {"question":"\u0418\u0437 \u043a\u0430\u043a\u043e\u0433\u043e \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u0430 \u043f\u043b\u0430\u043d\u0438\u0440\u0443\u0435\u0442\u0435 \u0441\u0442\u0440\u043e\u0438\u0442\u044c \u0434\u043e\u043c?","options":[{"text":"\u041a\u0430\u0440\u0430\u043a\u0430\u0441\u043d\u043e-\u0449\u0438\u0442\u043e\u0432\u043e\u0439","image":"\/upload\/iblock\/b2a\/5qg6hgs6don3tvz19w30pvkbiiva78ya.jpeg"},{"text":"\u0411\u0440\u0443\u0441\u043e\u0432\u044b\u0439","image":"\/upload\/iblock\/db8\/hrczeyqkdkbpencyhzk4dpghm92usvkm.jpeg"},{"text":"\u0411\u043b\u043e\u0447\u043d\u044b\u0439","image":"\/upload\/iblock\/002\/jrbbcne65xipxtz2aguvade17cqitzbm.jpeg"},{"text":"\u0411\u043b\u043e\u043a-\u043a\u0438\u0440\u043f\u0438\u0447","image":"\/upload\/iblock\/1cf\/vzq6mia5bctsas6jlghw1fykn5dbfq9y.jpeg"},{"text":"\u0418\u043d\u043d\u043e\u0431\u043b\u043e\u043a","image":"\/upload\/iblock\/71f\/0854g8jhtyesss12ak6qisex6ww59dvd.jpeg"},{"text":"\u0415\u0449\u0435 \u043d\u0435 \u0440\u0435\u0448\u0438\u043b","image":"\/upload\/iblock\/809\/2e1kocbth91667mkwiyuot5mahkz5bxd.png"}],"selected":null},
])

const result = ref([])

const name = ref('')
const phone = ref('')
const email = ref('')

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

const onFileChange = (e) =>{
  let imageCount = document.querySelector("#quiz-file-count")
  let imageSize = document.querySelector("#quiz-file-size")
  let imageAllRemove = document.querySelector("#quiz-file-remove-all")

  imageCount.innerHTML = "";
  imageSize.innerHTML = "";
  imageAllRemove.innerHTML = "";


  document.querySelector('#quiz-file-preview').innerHTML ="";
  const currFiles = e.target.files;
  if(currFiles.length > 0){
    if(currFiles.length > 10){
        alert("Вы не можете загружать больше 10 файлов");
    }else{
      let imagePreviewDiv = document.querySelector('#quiz-file-preview');
      let imagePrevSize = 0
      for (let i = 0; i < currFiles.length; i++) {
        let div = document.createElement('div');
        div.dataset.id = i;
        div.classList.add('quiz-file__preview-img'); 
        let src = URL.createObjectURL(currFiles[i])
        let img = document.createElement('img');
        img.src = src;
        img.style.display = 'block';
        let close = document.createElement('button'); 
        close.addEventListener('click',()=>{
          close.parentElement.remove();

          let files = e.target.files;
          let validFiles = new DataTransfer();

          let j = 0;
          for (const file of files) {
            if(div.dataset.id != j){
              validFiles.items.add(file);
            }
            j++;
          }
          e.target.files.value = '';
          e.target.files = validFiles.files;
          
        })
        close.classList.add('quiz-file__preview-close'); 
        close.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
          <g clip-path="url(#clip0_319_6585)">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M7 0C10.8654 0 14 3.13462 14 7C14 10.8654 10.8654 14 7 14C3.13462 14 0 10.8654 0 7C0 3.13462 3.13462 0 7 0ZM3.46197 9.53372L5.99569 7L3.46197 4.46628C3.31662 4.32087 3.31662 4.0837 3.46197 3.93835L3.93835 3.46197C4.0837 3.31662 4.32087 3.31662 4.46628 3.46197L7 5.99569L9.53372 3.46197C9.67913 3.31662 9.9163 3.31662 10.0616 3.46197L10.538 3.93835C10.6834 4.0837 10.6834 4.32087 10.538 4.46628L8.00431 7L10.538 9.53372C10.6834 9.67913 10.6834 9.9163 10.538 10.0616L10.0616 10.538C9.9163 10.6834 9.67913 10.6834 9.53372 10.538L7 8.00431L4.46628 10.538C4.32087 10.6834 4.0837 10.6834 3.93835 10.538L3.46197 10.0616C3.31662 9.9163 3.31662 9.67913 3.46197 9.53372Z" fill="#F5F5F2"/>
          </g>
          <defs>
            <clipPath id="clip0_319_6585">
              <rect width="14" height="14" fill="white"/>
            </clipPath>
          </defs>
        </svg>`;
        div.append(img)
        div.append(close)
        imagePreviewDiv.append(div);
        imagePrevSize += currFiles[i].size
      }
      var fSExt1 = new Array('Байт', 'КБ', 'МБ', 'ГБ'),
      i=0;
      while(imagePrevSize>900)
      {imagePrevSize/=1024;i++;}
      var exactSize1 = (Math.round(imagePrevSize*100)/100)+' '+fSExt1[i];

      let imageCount = document.querySelector("#quiz-file-count")
      let imageSize = document.querySelector("#quiz-file-size")
      let imageAllRemove = document.querySelector("#quiz-file-remove-all")
      imageCount.innerHTML = currFiles.length + " файла"
      imageSize.innerHTML = exactSize1
      imageAllRemove.innerHTML = "Удалить все"
      imageAllRemove.type = "button" 
      imageAllRemove.addEventListener('click',()=>{
        Array.from(currFiles).length = 0;
        imageSize.innerHTML = ""
        imageCount.innerHTML = ""
        imageAllRemove.innerHTML =""
        document.querySelector('#quiz-file-preview').innerHTML = ""
      })

      let observ = new MutationObserver(()=>{      
        let imagePrevSize = 0 // все проблемы оказываются из-за того что currFiles.length не считывает изменение количества
        for (let i = 0; i < currFiles.length; i++) {
          imagePrevSize += currFiles[i].size
          console.log(imagePrevSize)
        }
        i=0;
        while(imagePrevSize>900)
        {imagePrevSize/=1024;i++;}
        var exactSize = (Math.round(imagePrevSize*100)/100)+' '+fSExt1[i];
        imageCount.innerHTML = currFiles.length + " файла"	
        imageSize.innerHTML = exactSize           
      })
      observ.observe(imagePreviewDiv,{
        childList: true,
        subtree: true
      })
    }
  }
  for (const child of document.querySelector('.quiz-form__form-file-block').children) {
    child.style.pointerEvents = "auto";
  }
}

const onFileDropEnter = ()=>{
  console.log('dropenter');
  DropActive.value = true;

  
  for (const child of document.querySelector('.quiz-form__form-file-block').children) {
    child.style.pointerEvents = "none";
  }
}

const onFileDropLeave = ()=>{
  console.log('dropleave');
  DropActive.value = false;
  for (const child of document.querySelector('.quiz-form__form-file-block').children) {
    child.style.pointerEvents = "auto";
  }
}

const onFileDrop = (event) =>{
  DropActive.value = false;
  event.preventDefault();
  const file = event.dataTransfer?.files[0];
  if (!file) {
    return
  }
  for (const child of document.querySelector('.quiz-form__form-file-block').children) {
    child.style.pointerEvents = "auto";
  }
  let uploadInput = event.target.querySelector('#quiz-form__form-file');
  uploadInput.files = event.dataTransfer.files;

  event.target.querySelector('#quiz-file-preview').innerHTML = "";

  if(uploadInput.files.length > 0){
    if(uploadInput.files.length > 10){
        alert("Вы не можете загружать больше 10 файлов");
    }else{
      let imagePreviewDiv = event.target.querySelector('#quiz-file-preview')
      let imagePrevSize = 0
      for (let i = 0; i < uploadInput.files.length; i++) {
        let div = document.createElement('div');
        div.dataset.id = i;
        div.classList.add('quiz-file__preview-img'); 
        let src = URL.createObjectURL(uploadInput.files[i])
        let img = document.createElement('img');                       
        img.src = src;
        img.style.display = 'block';
        let close = document.createElement('button');
        close.addEventListener('click',()=>{
            close.parentElement.remove();

            let files = event.target.querySelector('#quiz-form__form-file').files;
            let validFiles = new DataTransfer();

            let j = 0;
            for (const file of files) {
              if(div.dataset.id != j){
                validFiles.items.add(file);
              }
              j++;
            }
            event.target.querySelector('#quiz-form__form-file').files.value = '';
            event.target.querySelector('#quiz-form__form-file').files = validFiles.files;
            
          })
        close.classList.add('quiz-file__preview-close'); 
        close.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
          <g clip-path="url(#clip0_319_6585)">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M7 0C10.8654 0 14 3.13462 14 7C14 10.8654 10.8654 14 7 14C3.13462 14 0 10.8654 0 7C0 3.13462 3.13462 0 7 0ZM3.46197 9.53372L5.99569 7L3.46197 4.46628C3.31662 4.32087 3.31662 4.0837 3.46197 3.93835L3.93835 3.46197C4.0837 3.31662 4.32087 3.31662 4.46628 3.46197L7 5.99569L9.53372 3.46197C9.67913 3.31662 9.9163 3.31662 10.0616 3.46197L10.538 3.93835C10.6834 4.0837 10.6834 4.32087 10.538 4.46628L8.00431 7L10.538 9.53372C10.6834 9.67913 10.6834 9.9163 10.538 10.0616L10.0616 10.538C9.9163 10.6834 9.67913 10.6834 9.53372 10.538L7 8.00431L4.46628 10.538C4.32087 10.6834 4.0837 10.6834 3.93835 10.538L3.46197 10.0616C3.31662 9.9163 3.31662 9.67913 3.46197 9.53372Z" fill="#F5F5F2"/>
          </g>
          <defs>
            <clipPath id="clip0_319_6585">
              <rect width="14" height="14" fill="white"/>
            </clipPath>
          </defs>
        </svg>`;
        div.append(img)
        div.append(close)
        imagePreviewDiv.append(div);
        imagePrevSize += uploadInput.files[i].size
      }
      var fSExt = new Array('Байт', 'КБ', 'МБ', 'ГБ'),
      i=0;
      while(imagePrevSize>900)
      {imagePrevSize/=1024;i++;}
      var exactSize = (Math.round(imagePrevSize*100)/100)+' '+fSExt[i];

      let imageCount = document.querySelector("#quiz-file-count")
      let imageSize = document.querySelector("#quiz-file-size")
      let imageAllRemove = document.querySelector("#quiz-file-remove-all")        
      imageCount.innerHTML = uploadInput.files.length + " файла"
      imageSize.innerHTML = exactSize
      imageAllRemove.innerHTML = "Удалить все"
      imageAllRemove.type = "button" 
      imageAllRemove.addEventListener('click',()=>{
        Array.from(uploadInput).length = 0;
        imageSize.innerHTML = ""
        imageCount.innerHTML = ""
        imageAllRemove.innerHTML =""
        document.querySelector('#quiz-file-preview').innerHTML = ""
      })

      let obs = new MutationObserver(()=>{    
        let imagePrevSize = 0
        // А эта хуйня uploadInput.files.length через раз считывает изменения
        for (let i = 0; i < uploadInput.files.length; i++) {	
          imagePrevSize += uploadInput.files[i].size          
        }
        i=0;
        while(imagePrevSize>900)
        {imagePrevSize/=1024;i++;}
        var exactSize = (Math.round(imagePrevSize*100)/100)+' '+fSExt[i];
        imageCount.innerHTML = uploadInput.files.length + " файла"	
        imageSize.innerHTML = exactSize
      })
      obs.observe((imagePreviewDiv),{
        childList: true
      })
    }
  }
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
          <div class="quiz-form__form-file-block" v-bind:class="{_active: DropActive}" id="file-enter-zone" @drop="onFileDrop" @dragenter="onFileDropEnter" @dragleave="onFileDropLeave"  @dragover.prevent @dragenter.prevent>
            <div class="quiz-file-preview-info">
              <span id="quiz-file-count"></span>
              <span id="quiz-file-size"></span>
              <button type="button" id="quiz-file-remove-all"></button>
            </div>
            <div class="preview" id="quiz-file-preview">              
            </div>
            <label for="quiz-form__form-file" class="btn-white">Добавить фото
              <input type="file" @change="onFileChange" multiple style="visibility:hidden;position: absolute;" class="quiz-form__form-file" id="quiz-form__form-file" name="file[]" accept="image/*" aria-describedby="hint">
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
  grid-template-columns: repeat(2, 1fr);
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
color: var(--dark);
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
</style> 