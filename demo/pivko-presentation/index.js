(function (document, window) {

  const loader = new window.Loader();


  document.addEventListener('DOMContentLoaded', () => {

    initHomeBgVideo();
    initAboutScreen();

  });

  function initHomeBgVideo () {
    const videoEl = document.getElementById('HomeBgVideo');
    const playBtn = document.getElementById('HomeBgVideoPlayBtn');
    let isPlaying = false;

    videoEl.addEventListener('canplay', () => {
      loader.hideOverlay();
      startHomeScreen();
      videoEl.play();
    }, { once: true });
    videoEl.addEventListener('playing', () => {
      isPlaying = true;
      playBtn.classList.remove('play-btn--paused');
    });
    videoEl.addEventListener('pause', () => {
      isPlaying = false;
      playBtn.classList.add('play-btn--paused');
    });

    playBtn.addEventListener('click', () => isPlaying ? videoEl.pause() : videoEl.play());
  }

  function startHomeScreen () {
    const sectionEl = document.querySelector('.section-home');
    sectionEl.classList.add('section-home--opened');
    sectionEl.classList.remove('section-home--pre');

    const nextSlideBtn = document.getElementById('HomeNextSlideBtn');
    nextSlideBtn.addEventListener('click', onHomeNextSlideBtnClick);

    slideInRightOverlayButtons()

    function onHomeNextSlideBtnClick (e) {
      e.preventDefault();
      slideOutHomeScreen();
      slideOutLeftOverlayButtons();
      slideInAboutScreen();
    }
  }

  function initAboutScreen () {
    const backBtn = document.getElementById('AboutBackBtn');
    const sidebarBackBtn = document.getElementById('AboutSidebarBackBtn');
    backBtn.addEventListener('click', onBackBtnClick);
    sidebarBackBtn.addEventListener('click', onBackBtnClick);

    const imageSliderEl = document.querySelector('.section-about .image-slider');
    const imageSliderContentEl = imageSliderEl.querySelector('.image-slider__content');
    const imageSliderPrevBtn = imageSliderEl.querySelector('.image-slider-control--prev');
    const imageSliderNextBtn = imageSliderEl.querySelector('.image-slider-control--next');

    const $slider = $(imageSliderContentEl);
    $slider.owlCarousel({
      items: 1,
      margin: 5,
      smartSpeed: 1000
    });

    imageSliderPrevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      $slider.trigger('prev.owl.carousel');
    });
    imageSliderNextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      $slider.trigger('next.owl.carousel');
    });

    function onBackBtnClick (e) {
      e.preventDefault();
      slideOutAboutScreen();
      slideInHomeScreen();
    }
  }

  function slideInHomeScreen () {
    const sectionEl = document.querySelector('.section-home');
    sectionEl.classList.add('section-home--slide-in');
    sectionEl.classList.remove('section-home--slide-out');
    sectionEl.classList.remove('section-home--opened');
    sectionEl.classList.remove('section-home--pre');
    setTimeout(slideInLeftOverlayButtons, 0);
  }

  function slideOutHomeScreen () {
    const sectionEl = document.querySelector('.section-home');
    sectionEl.classList.add('section-home--slide-out');
    sectionEl.classList.remove('section-home--slide-in');
    sectionEl.classList.remove('section-home--opened');
    sectionEl.classList.remove('section-home--pre');
  }

  function slideInAboutScreen () {
    const sectionEl = document.querySelector('.section-about');
    sectionEl.classList.add('section-about--slide-in');
    sectionEl.classList.remove('section-about--slide-out');
    setTimeout(slideInRightOverlayButtons, 700);
  }

  function slideOutAboutScreen () {
    const sectionEl = document.querySelector('.section-about');
    sectionEl.classList.add('section-about--slide-out');
    sectionEl.classList.remove('section-about--slide-in');
    slideOutRightOverlayButtons();
  }

  function slideInRightOverlayButtons () {
    removeAllAnimationClassesOnOverlayButtons();
    const menuBtn = document.getElementById('MenuBtn');
    menuBtn.classList.add('menu-btn--appeared');
    const infoBtn = document.getElementById('InfoBtn');
    infoBtn.classList.add('info-btn--appeared');
  }

  function slideInLeftOverlayButtons () {
    removeAllAnimationClassesOnOverlayButtons();
    const menuBtn = document.getElementById('MenuBtn');
    menuBtn.classList.add('menu-btn--slide-in-left');
    const infoBtn = document.getElementById('InfoBtn');
    infoBtn.classList.add('info-btn--slide-in-left');
  }

  function slideOutLeftOverlayButtons () {
    removeAllAnimationClassesOnOverlayButtons();
    const menuBtn = document.getElementById('MenuBtn');
    menuBtn.classList.add('menu-btn--slide-out-left');
    const infoBtn = document.getElementById('InfoBtn');
    infoBtn.classList.add('info-btn--slide-out-left');
  }

  function slideOutRightOverlayButtons () {
    removeAllAnimationClassesOnOverlayButtons();
    const menuBtn = document.getElementById('MenuBtn');
    menuBtn.classList.add('menu-btn--slide-out-right');
    const infoBtn = document.getElementById('InfoBtn');
    infoBtn.classList.add('info-btn--slide-out-right');
  }

  function removeAllAnimationClassesOnOverlayButtons () {
    const menuBtn = document.getElementById('MenuBtn');

    menuBtn.classList.remove('menu-btn--slide-in-right');
    menuBtn.classList.remove('menu-btn--slide-in-left');
    menuBtn.classList.remove('menu-btn--slide-out-right');
    menuBtn.classList.remove('menu-btn--slide-out-left');
    menuBtn.classList.remove('menu-btn--appeared');
    menuBtn.classList.remove('menu-btn--hidden');

    const infoBtn = document.getElementById('InfoBtn');
    infoBtn.classList.remove('info-btn--slide-in-right');
    infoBtn.classList.remove('info-btn--slide-in-left');
    infoBtn.classList.remove('info-btn--slide-out-right');
    infoBtn.classList.remove('info-btn--slide-out-left');
    infoBtn.classList.remove('info-btn--appeared');
    infoBtn.classList.remove('info-btn--hidden');
  }

})(document, window);
