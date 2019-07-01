// номер слайдер
var sliderId = 0;
// предыд.слайдер
var prevSlider = 'slider-1';
// цвета для фона и подсветки
var sliderColors = [ ['#c7ecd8', '#849D8F'], ['#c5d8e8', '#8996a6'], ['#e1ccc4', '#9d8b84'] ];

// поддержка LocalStorage
var isStorageSupport = true;

// элементы меню
var formSearch = document.querySelector(".form-search");
var buttonAuth = document.querySelector(".login-link");
var userAuth = document.querySelector(".user-auth");
var buttonBasket = document.querySelector(".basket")
var basket = document.querySelector(".basket-popup");

try {
  sliderId = localStorage.getItem("sliderId");
} catch {
  isStorageSupport = false;
}

// устанавливаем последний фоновый цвет и слайдер
sliderInit();
// показываем карту после её загрузки
showFrameMap();

// показ формы обратной связи
var feedbackForm = document.querySelector(".feedback-form");
if( feedbackForm ) {
  var feedback = document.querySelector(".our-adress button");
  feedback.addEventListener('click', showFeedback);
}

// открытие всплывающих блоков по нажатию Пробела
window.addEventListener("keydown", showPopupBySpace );
// закрытие формы обратной связи по нажатию ESC
window.addEventListener("keydown", evtCloseByEsc );


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
// скрытие корзины при потере фокуса
if(basket) {
  buttonBasket.addEventListener("focus", function() {
    basket.classList.remove("showed");
  });
  basketOrder = basket.querySelector('.button:last-child').addEventListener("blur", function() {
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
  var basketDelete = basketPopup.querySelectorAll(".product-rm");
    if(basketDelete.length) {
      basketDelete.forEach( function(elem) {
        elem.addEventListener("click", deleteBasketElem);
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
  priceRange = document.createElement("div");
  priceRange.className = "price-range";
  blockPrice.appendChild(priceRange);

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
  var sliders = document.getElementsByName("slider");  
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
  sliderId = sliderId - 1;
  if( sliderColors[ sliderId ] ) {
    document.body.style.backgroundColor = sliderColors[sliderId][1];
    if( !document.body.classList.contains('inner-pages') ) {
      document.body.style.backgroundImage = "radial-gradient(circle at center 450px, "+ sliderColors[sliderId][0] + ", " + sliderColors[sliderId][1] + " 30%)";
    }
  }
}

/**
 * Обработка нажатия пробела на пунктах меню и кнопках для доступности
 */
function showPopupBySpace(event) {
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
 * обработчик закрытия формы обратной связи
 */
function showFeedback() {
  feedbackForm.classList.remove('hidden');
  feedbackForm.querySelector("#feedback-name").focus();
  var feedbackClose = feedbackForm.querySelector('.button-close');
  feedbackClose.addEventListener('click', function(){
    feedbackForm.classList.add('hidden');
  });
}

/**
 * обработчик закрытия открытых модальных окон и оверлея по ESC 
 */
function evtCloseByEsc(event) {
  if( event.keyCode === 27 ) {
    if( !feedbackForm.classList.contains("hidden") ) {
      event.preventDefault();
      feedbackForm.classList.add('hidden');
    }
  }
}

/* обработчик удаление элементов корзины */
function deleteBasketElem(event) {
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
      sum = elem.innerText.slice(0, elem.innerText.indexOf(' руб.'));
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
  var officeMap = document.querySelector(".office-map");
  if( officeMap ) {
    var frameMap = officeMap.querySelector("iframe");
    if(frameMap === null ) {
      frameMap = document.createElement("iframe");
      frameMap.width = 1200;
      frameMap.height = 430;
      frameMap.src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1998.6036253003365!2d30.32085871651319!3d59.93871916905374!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4696310fca145cc1%3A0x42b32648d8238007!2z0JHQvtC70YzRiNCw0Y8g0JrQvtC90Y7RiNC10L3QvdCw0Y8g0YPQuy4sIDE5LzgsINCh0LDQvdC60YIt0J_QtdGC0LXRgNCx0YPRgNCzLCAxOTExODY!5e0!3m2!1sru!2sru!4v1561079752419!5m2!1sru!2sru"
      frameMap.title = frameMap.innerHTML = "Адрес главного офиса и офлайн-магазина: ул. Большая Конюшенная 19/8, Санкт-Петербург";
      officeMap.appendChild(frameMap);
      frameMap.addEventListener('load', function() {
        officeMap.removeChild( officeMap.querySelector("img"));
      });
    }
  }
}
