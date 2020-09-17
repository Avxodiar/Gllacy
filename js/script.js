'use strict';

// номер слайдер
var sliderId = 0;
// предыд.слайдер
var prevSlider = 'slider-1';
// цвета для фона и подсветки
var sliderColors = [ 'bg-green', 'bg-blue', 'bg-light-brown' ];

// поддержка LocalStorage
var isStorageSupport = true;

// Логин пользователя сохраненный в LocalStorage
var storageLogin = '';

// элементы меню
var formSearch = document.querySelector(".form-search");
var searchField = formSearch.querySelector("[name='seach-text']");
var buttonAuth = document.querySelector(".login-link");
var userAuth = document.querySelector(".user-auth");
var loginField = userAuth.querySelector("[name='user-login']");
var paswdField = userAuth.querySelector("[name='user-password']");
var buttonBasket = document.querySelector(".basket")
var basket = document.querySelector(".basket-popup");
var formSubscribe = document.querySelector(".form-subscribe");
var formFeedback = document.querySelector(".form-feedback");


try {
  sliderId = localStorage.getItem("sliderId");
} catch (e) {
  isStorageSupport = false;
}

// устанавливаем последний фоновый цвет и слайдер
sliderInit();
// показываем карту после её загрузки
showFrameMap();

//проверяем введен ли логин. если нет - берем из localStorage
if ( isStorageSupport) {
  storageLogin = localStorage.getItem("login");
  if(!loginField.value && storageLogin ) {
    loginField.value = storageLogin;
  }
}


// открытие всплывающих блоков по нажатию пробела и закрытие формы обратной связи по нажатию ESC
window.addEventListener("keydown", evtWindowKeydown );

// валидация формы поиска при отправлении
formSearch.addEventListener("submit", evtFormSearchSubmitValidation );
// проверка полей формы авторизации при
searchField.addEventListener("input", evtFieldInputValidation );

// скрытие формы поиска при потере фокуса
formSearch.querySelector('input').addEventListener("blur", function() {
  formSearch.classList.remove("showed");
});
// скрытие формы авторизации при потере фокуса
buttonAuth.addEventListener("focus", function() {
  userAuth.classList.remove("showed");
});
userAuth.querySelector('a:last-child').addEventListener("blur", function() {
  userAuth.classList.remove("showed");
});

// валидация формы авторизации при отправлении
userAuth.addEventListener("submit", evtUserAuthSubmitValidation );
// проверка полей формы авторизации при изменении
loginField.addEventListener("input", evtFieldInputValidation );
paswdField.addEventListener("input", evtFieldInputValidation );

// валидация формы подписки при отправлении
if( formSubscribe ) {
  formSubscribe.addEventListener("submit", evtSubscribeValidation );
  // проверка полей формы авторизации при изменении
  var subscribeField = formSubscribe.querySelector("[name='subscribe-mail']");
  subscribeField.addEventListener("input", evtFieldInputValidation );
}

// показ формы обратной связи
if( formFeedback ) {
  var buttonFeedback = document.querySelector(".our-adress button");
  buttonFeedback.addEventListener('click', evtButtonFeedbackClick);

  // валидация формы обратной связи при отправлении
  formFeedback.addEventListener("submit", evtFeedbackValidation );

  var feedbackNameField = formFeedback.querySelector("[name='feedback-name']");
  var feedbackMailField = formFeedback.querySelector("[name='feedback-mail']");
  var feedbackMessField = formFeedback.querySelector("[name='feedback-message']");
  // проверка полей формы авторизации при изменении
  feedbackNameField.addEventListener("input", evtFieldInputValidation );
  feedbackMailField.addEventListener("input", evtFieldInputValidation );
  feedbackMessField.addEventListener("input", evtFieldInputValidation );
}

// скрытие корзины при потере фокуса
if(basket) {
  buttonBasket.addEventListener("focus", function() {
    basket.classList.remove("showed");
  });
  var basketOrder = basket.querySelector('.button:last-child').addEventListener("blur", function() {
    basket.classList.remove("showed");
  });
}
// скрытие авторизации по ESC
var catalogMenu = document.querySelector(".catalog-menu");
var catalogMenuLink = document.querySelector(".catalog-menu li:last-child a");
catalogMenuLink.addEventListener("blur", function() {
  document.querySelector(".main-menu li:first-child a").classList.remove("menu-item-hover");
  catalogMenu.classList.remove("showed");
});

// удаление элементов корзины
var basketPopup = document.querySelector('.basket-popup');
if( basketPopup ) {
  var buttonBasketDelete = basketPopup.querySelectorAll(".product-rm");
    if(buttonBasketDelete.length) {
      buttonBasketDelete.forEach( function(basketDelete) {
        basketDelete.addEventListener("click", evtBasketDeleteClick);
      });
    }
}

/**
 * Работа двойного ползунка range + доступность
*/
var blockPrice = document.querySelector(".price-by");
var priceFrom = document.querySelector("#filter-price-from");
var labelFrom = document.querySelector(".label-price-from");
var priceTo = document.querySelector("#filter-price-to");
var labelTo = document.querySelector(".label-price-to");
// расчет для цены от 100р до 500р
const PRICE_MIN = 100;
const PRICE_MAX = 500;
const PRICE_DIAPAZON = PRICE_MAX - PRICE_MIN;
const RANGE_MARGIN = 21;
const RANGE_WIDTH = 176;
if( blockPrice ) {
  var priceRange = document.createElement("div");
  priceRange.className = "price-range";
  blockPrice.appendChild(priceRange);

  // инициализируем состояние ползунков (ff игнорирует значение value даже после перезагрузки страницы)
  labelFrom.innerText = priceFrom.value;
  labelTo.innerText = priceTo.value;
  changePriceFrom();

  // доступность для блока сортировка по цене
  priceFrom.addEventListener("focus", function() {
    blockPrice.classList.add("focus");
  });
  priceFrom.addEventListener("blur", function() {
    blockPrice.classList.remove("focus");
  });
  priceTo.addEventListener("focus", function() {
    blockPrice.classList.add("focus");
  });
  priceTo.addEventListener("blur", function() {
    blockPrice.classList.remove("focus");
  });

  priceFrom.addEventListener("input", changePriceFrom);
  priceTo.addEventListener("input", changePriceTo);
}

var blockFat = document.querySelector(".filter-form ul.fat");
if( blockFat ){
  var fieldsFat = blockFat.querySelectorAll(".input-type [type='radio']");
  if(fieldsFat.length) {
    fieldsFat.forEach( function(elem) {
      elem.addEventListener("focus", function() {
        blockFat.classList.add("focus");
      });
      elem.addEventListener("blur", function() {
        blockFat.classList.remove("focus");
      });
    });
  }
}
var blockFiller = document.querySelector(".filter-form ul.fillers");
if( blockFiller ){
  var fieldsFiller = blockFiller.querySelectorAll(".input-type [type='checkbox']");
  if(fieldsFiller.length) {
    fieldsFiller.forEach( function(elem) {
      elem.addEventListener("focus", function() {
        blockFiller.classList.add("focus");
      });
      elem.addEventListener("blur", function() {
        blockFiller.classList.remove("focus");
      });
    });
  }
}

/* обработчик изменения ползунка цены ОТ */
function changePriceFrom() {
  var range = priceTo.value - priceFrom.value;
  if( range < 0) {
    priceFrom.value = priceTo.value;
    range = 0;
  }
  labelFrom.innerText = priceFrom.value;

  priceRange.style.left = RANGE_MARGIN + parseInt( (priceFrom.value - PRICE_MIN)/ PRICE_DIAPAZON * RANGE_WIDTH ) + "px";
  priceRange.style.width = parseInt( range / PRICE_DIAPAZON * RANGE_WIDTH ) +"px";
}

/* обработчик изменения ползунка цены ДО */
function changePriceTo() {
  var range = priceTo.value - priceFrom.value;
  if( range < 0) {
    priceTo.value = priceFrom.value;
    range = 0;
  }
  labelTo.innerText = priceTo.value;
  priceRange.style.width = parseInt( range / PRICE_DIAPAZON * RANGE_WIDTH ) + "px";
}


/**
 * Установка последнего выбранного слайдера и соответствующего цвета
  */
function sliderInit() {
  // sliderId = 1 пропускаем, т.к. он по умолчанию и обрабатывать не нужно
  if(sliderId > 1) {
    /* устанавливаем последний выбранный слайдер */
    var slider = document.querySelector('#slider-' + sliderId);
    if(slider) {
      slider.checked = true;  
    }
    /* устанавливаем соответствующие цвета */
    setBackground(sliderId);
  }
  setSliderListeners();
}

/**
 * Установка обработчиков на изменения слайдера
 * сохраняет последний слайдер в localStorage для последующей установки фонового цвета
 */
function setSliderListeners() {
  var sliders = document.querySelectorAll("input[name='slider']");
  if(sliders) {
    for (var i = 0; i < sliders.length; i++) {
      sliders[i].addEventListener("change", function(event) {
        setBackground( event.target.id[7] );
        if( isStorageSupport ) {
          localStorage.setItem("sliderId", event.target.id[7]);
        }
      });
    }
  }
}

/**
 * Установка фонового цвета и градиента по номеру слайдера
 * @param int sliderId - номер слайдера, отсчет с 1!
 */
function setBackground(sliderId) {
  document.body.classList.remove('bg-green', 'bg-blue', 'bg-light-brown');
  sliderId = sliderId - 1;
  if( sliderColors[ sliderId ] ) {
    document.body.classList.add( sliderColors[ sliderId ] );
  }
}

/**
 * Обработка нажатия кнопок 
 * - пробела на пунктах меню и кнопках для доступности
 * - ESC для закрытия открытых модальных окон
 */
function evtWindowKeydown(event) {
  // ESC
  if( event.keyCode === 27 ) {
    if( !formFeedback.classList.contains("hidden") ) {
      event.preventDefault();
      formFeedback.classList.add('hidden');
    }
  }
  // пробел
  if( event.keyCode === 32 ) {
    var showSearch = event.target.classList.contains('button-search');
    var showLogin = event.target.classList.contains('login-link');
    var showBasket = event.target.classList.contains('basket-link');
    var buttonCatalog = !!( event.target.nextElementSibling &&
      event.target.nextElementSibling.classList.contains('catalog-menu') );

    /* показ подменю*/
    if( buttonCatalog ) {
        event.preventDefault();
        event.target.classList.toggle("menu-item-hover");
        catalogMenu.classList.toggle("showed");
    }
    /* показ формы поиска */
    if( showSearch && !isVisible(formSearch) ) {
        event.preventDefault();
        formSearch.classList.add("showed");
        formSearch.querySelector('input').focus();
    }
    /* показ формы авторизации */
    if( showLogin && !isVisible(userAuth) ) {
        event.preventDefault();
        userAuth.classList.add("showed");
        userAuth.querySelector('input').focus();
    }
    /* показ корзины */
    if( showBasket && basket ) {
      event.preventDefault();
      basket.classList.toggle("showed");
    }

  }
}

/**
 * обработчик показая формы обратной связи
 */
function evtButtonFeedbackClick() {
  formFeedback.classList.remove('hidden');
  formFeedback.querySelector("#feedback-name").focus();
  var feedbackClose = formFeedback.querySelector('.button-close');
  feedbackClose.addEventListener('click', function(){
    formFeedback.classList.add('hidden');
  });
}


/**
 * Валидация формы поиска при отправке
 */
function evtFormSearchSubmitValidation(event) {
  if( !searchField.value) {
    event.preventDefault();
    showEventError(searchField);
  }
}

/**
 * удаление класса для индикации ошибки при изменении и не пустом значении
 */
function evtFieldInputValidation(event) {
  var target = '';
  switch(event.target.name) {
    case "seach-text":
      target = searchField;
      break;
    case "user-login":
      target = loginField;
      break;
    case "user-password":
      target = paswdField;
      break;
    case "subscribe-mail":
      target = subscribeField;
      break;
    case "feedback-name":
      target = feedbackNameField;
      break;
    case "feedback-mail":
      target = feedbackMailField;
      break;
    case "feedback-message":
      target = feedbackMessField;
      break;
  }
  if( target && target.value) {
    target.classList.remove("border-error");
  }
}

/**
 * Валидация формы авторизации при отправке
 */
function evtUserAuthSubmitValidation(event) {
  if( !loginField.value || !paswdField.value ) {
    event.preventDefault();
    if ( !loginField.value ) {
      loginField.placeholder = "Введите логин";
      showEventError(loginField);
    } else if ( !paswdField.value ) {
      paswdField.placeholder = "Введите пароль";
      showEventError(paswdField);
    }
  } else {
    /* сохраняем в LS логин если форма отправлена */
    if( isStorageSupport ) {
      localStorage.setItem("login", loginField.value);
    }
  }
}

/**
 * Обработка отправления формы подписки
 */
function evtSubscribeValidation(event) {
  if( !subscribeField.value) {
    event.preventDefault();
    showEventError(subscribeField);
  }
}

/**
 * Обработка отправления формы обратной связи
 */
function evtFeedbackValidation(event) {
  if( !feedbackNameField.value || !feedbackMailField.value || !feedbackMessField.value) {
    event.preventDefault();
    if( !feedbackNameField.value) {
      showEventError(feedbackNameField);
    } else if( !feedbackMailField.value) {
      showEventError(feedbackMailField);
    } else if( !feedbackMessField.value) {
      showEventError(feedbackMessField);
    }
  }
}

/**
 * Отображение ошибки в указанном объекте
 * @param  object target - выбранный DOM объект
 */
function showEventError(target) {
  if (typeof target === 'object' ) {
    target.classList.add("border-error");
    target.classList.remove("error");
    target.classList.add("error");
    setTimeout(function() {
      target.classList.remove("error");
    }, 700);
  }
}


/* обработчик удаление элементов корзины */
function evtBasketDeleteClick(event) {
  var tr = event.target.closest("tr");
  tr.remove();

  /* пересчитываем корзину */
  if (!basketPopup) {
    return false;
  }
  var basketSum = 0;
  var basketCount = 0;
  var productSum = basketPopup.querySelectorAll(".basket-list .product-sum");
  if(productSum.length) {
    productSum.forEach( function(elem) {
      basketCount++;
      var sum = elem.innerText.slice(0, elem.innerText.indexOf(' руб.'));
      sum = sum.replace(/\s/g, '');
      basketSum += +sum;
    });
  }

  /* показываем изменения */
  var basketButton = document.querySelector(".main-nav .basket");

  if( basketSum || basketCount ) {
    var orderSum = basketPopup.querySelectorAll(".basket-sum span");
    orderSum[0].innerText = basketSum;

    basketButton.querySelector(".basket-link").innerText = basketCount + " товар";
  } else {
    basketPopup.style.display = 'none';
    basketPopup.remove();

    basketButton.classList.remove('not-empty');
    basketButton.querySelector(".basket-link").innerText = "Пусто"; 
  }
  
}

/**
 * Проверка элемента на видимость
 */
function isVisible(element) {
  return getComputedStyle( element ).display == "block";
}

/**
 * Динамическая загрузка гугл-карты и замена статичного jpg в модальном окне карты
 */
function showFrameMap() {
  var officeMap = document.querySelector(".office-map .map");
  if( officeMap ) {
    var frameMap = officeMap.querySelector("iframe");
    if(frameMap === null ) {
      frameMap = document.createElement("iframe");
      frameMap.width = 1200;
      frameMap.height = 430;
      frameMap.className = "hidden";
      frameMap.src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1998.6036253003365!2d30.32085871651319!3d59.93871916905374!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4696310fca145cc1%3A0x42b32648d8238007!2z0JHQvtC70YzRiNCw0Y8g0JrQvtC90Y7RiNC10L3QvdCw0Y8g0YPQuy4sIDE5LzgsINCh0LDQvdC60YIt0J_QtdGC0LXRgNCx0YPRgNCzLCAxOTExODY!5e0!3m2!1sru!2sru!4v1561079752419!5m2!1sru!2sru"
      frameMap.title = frameMap.innerHTML = "Адрес главного офиса и офлайн-магазина: ул. Большая Конюшенная 19/8, Санкт-Петербург";
      officeMap.appendChild(frameMap);
      frameMap.addEventListener('load', function() {
        frameMap.classList.remove("hidden");
      });
    }
  }
}
