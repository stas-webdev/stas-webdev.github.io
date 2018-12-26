(function (document, window, $, Swiper) {

  $(document).ready(function () {
    var bgSlider = new AutoSlider('.bg-slider');
    var navPanelBtn = new ToggleButton('.nav-panel-btn');
    var mainMenu = new MainMenu('.main-menu');
    var sectionsController = new SectionsController('.l-page-section');
    var gallery = new Gallery('.gallery');
    var projectModal = new ProjectModal('.l-project-modal');

    navPanelBtn.on('pressed', function () {
      $('.l-nav-panel').addClass('l-nav-panel--expanded');
    });
    navPanelBtn.on('released', function () {
      $('.l-nav-panel').removeClass('l-nav-panel--expanded');
    });

    $('.main-header__wrapper').click(closeActiveSection);
    $('.l-page-section__underlay').click(closeActiveSection);

    mainMenu.on('active:changed', function ($activeMenuItem) {
      $('.l-nav-panel').removeClass('l-nav-panel--expanded');
      navPanelBtn.release();
      var menuItemHref = $activeMenuItem.find('a').attr('href');
      var targetSectionName = menuItemHref.substring(1);
      projectModal.close();
      sectionsController.openSection(targetSectionName);
      if ('gallery' == targetSectionName)
        gallery.open();
      else
        gallery.close();
      $('.l-bg').addClass('l-bg--hidden-mobile');
    });

    gallery.on('thumbnail:click', function (projectUrl) {
      projectModal.open();
      $.ajax({
        url: projectUrl,
        success: function (responseText) {
          var $dom = $('<div>').html(responseText);
          var $projectView = $dom.find('.project-view');
          projectModal.putContent($projectView);
          var projectView = new ProjectView($projectView);
        }
      });
    });

    function closeActiveSection () {
      sectionsController.closeActiveSection();
      gallery.close();
      projectModal.close();
      mainMenu.dropActive();
      $('.l-bg').removeClass('l-bg--hidden-mobile');
    }
  });

  function ToggleButton (el) {
    var api = new EventEmitter();
    var $el = api.$el = $(el);
    var pressedClass = 'nav-panel-btn--pressed';
    var releasedClass = 'nav-panel-btn--released';

    api.isPressed = function () {
      return this.$el.hasClass(pressedClass);
    };

    api.press = function () {
      if (this.isPressed()) return this;
      this.$el.addClass(pressedClass);
      this.$el.removeClass(releasedClass);
      this.trigger('pressed');
      return this;
    }

    api.release = function () {
      if (!this.isPressed()) return this;
      this.$el.addClass(releasedClass);
      this.$el.removeClass(pressedClass);
      this.trigger('released');
      return this;
    }

    api.toggle = function () {
      if (this.isPressed()) this.release();
      else this.press();
      return this;
    }

    $el.click(function (e) {
      e.preventDefault();
      api.toggle();
    });

    return api;
  }

  function MainMenu (el) {
    var api = new EventEmitter();
    var $el = api.$el = $(el);
    var itemClass = 'main-menu__item';
    var itemActiveClass = 'main-menu__item--active';
    var $items = $el.find('.' + itemClass);

    $items.click(function (e) {
      e.preventDefault();
      var $activeItem = $(e.currentTarget);
      api.dropActive();
      $activeItem.addClass(itemActiveClass);
      api.trigger('active:changed', [$activeItem]);
    });

    api.dropActive = function () {
      $items.removeClass(itemActiveClass);
      return this;
    };

    return api;
  }

  function SectionsController (sections) {
    var api = {};
    var $sections = api.$sections = $(sections);
    var $activeSection = null;
    var sectionOpenedClass = 'l-page-section--opened';

    api.openSection = function (name) {
      var $targetSection = $sections.filter('[data-section="' + name + '"]');
      if (!$targetSection) return this;
      this.closeActiveSection();
      $targetSection.addClass(sectionOpenedClass);
      $activeSection = $targetSection;
      return this;
    };

    api.closeActiveSection = function () {
      if ($activeSection) $activeSection.removeClass(sectionOpenedClass);
      $activeSection = null;
      return this;
    };

    return api;
  }

  function Gallery (el) {
    var api = new EventEmitter();
    var $el = api.$el = $(el);

    var slidesBlockExpandedClass = 'gallery--slides-expanded';
    var slidesBlockCollapsedClass = 'gallery--slides-collapsed';
    var slidesBlockExpandControlSelector = '.gallery__slides-overlay';
    var $slidesBlockExpandControl = $el.find(slidesBlockExpandControlSelector);

    var slider;

    api.open = function () {
      slider = api.slider = new GallerySlider($el.find('.gallery-slider'));
      $el.find('.thumbnail').on('click', onThumbnailClick.bind(this));
      return this;
    }

    api.close = function () {
      this.$el.removeClass(slidesBlockExpandedClass);
      this.$el.removeClass(slidesBlockCollapsedClass);
      $('html body').unmousewheel();
      if (slider) slider.destroy();
      slider = null;
      $el.find('.thumbnail').off('click');
      $('.section-gallery__slides-collapse-btn').css('display', 'none');
      return this;
    }

    api.expandSlidesBlock = function () {
      $el.addClass(slidesBlockExpandedClass);
      $el.removeClass(slidesBlockCollapsedClass);
      slider.swiper.stopAutoplay();
      slider.swiper.params.speed = 400;
      slider.swiper.update();
      window.setTimeout(function (e) {
        slider.swiper.update();
      }, 300);
      $('html body').mousewheel(function (e, delta) {
        e.preventDefault();
        if (delta > 0) {
          $('html body').unmousewheel();
          api.collapseSlidesBlock();
        }
      });
      $('.section-gallery__slides-collapse-btn').css('display', 'block');
    }

    api.collapseSlidesBlock = function () {
      slider.swiper.startAutoplay();
      slider.swiper.params.speed = 1400;
      slider.swiper.update();
      $el.addClass(slidesBlockCollapsedClass);
      $el.removeClass(slidesBlockExpandedClass);
      $('.section-gallery__slides-collapse-btn').css('display', 'none');
    };

    function onThumbnailClick (e) {
      e.preventDefault();
      var projectUrl = e.currentTarget.href;
      api.trigger('thumbnail:click', [projectUrl])
    };

    $slidesBlockExpandControl.click(api.expandSlidesBlock.bind(api));
    $('.section-gallery__slides-collapse-btn').click(function (e) {
      e.preventDefault();
      api.collapseSlidesBlock();
    });
    return api;
  }

  function ProjectModal (el) {
    var api = {};
    var $el = api.$el = $(el);
    var $content = $el.find('.l-project-modal__content');
    var $closeBtn = $el.find('.l-project-modal__close');
    var openedClass = 'l-project-modal--opened';


    api.open = function () {
      $el.addClass(openedClass);
      return this;
    };

    api.close = function () {
      $el.removeClass(openedClass);
      $content.empty();
      return this;
    };

    api.putContent = function (el) {
      $content.empty().append(el);
      return this;
    };

    $closeBtn.click(function (e) {
      e.preventDefault();
      api.close();
    });

    return api;
  }

  function ProjectView (el) {
    var api = {};
    var $el = api.$el = $(el);

    var slider = new Swiper($el.find('.project-slider'), {
      pagination: '.slider-controls__pagination',
      paginationType: 'fraction',
      nextButton: '.slider-controls__arrow-next',
      prevButton: '.slider-controls__arrow-prev'
    });

    $el.find('.project-slider__slide').click(function () {
      slider.slideNext();
    });
  }

  function Slider (el, options) {
    options = options || {};

    var api = new EventEmitter();
    var $el = api.$el = $(el);
    api.options = options;

    var swiper;

    api.initialize = function () {
      var swiperOptions = this.options.swiper || {};
      swiper = this.swiper = new Swiper($el, swiperOptions);
      this.trigger('initialized');
      return this;
    };

    api.destroy = function () {
      if (swiper) swiper.destroy();
      swiper = null;
      this.trigger('destroyed');
      return this;
    };

    api.initialize();
    return api;
  }

  function AutoSlider (el) {
    return new Slider(el, {
      swiper: {
        autoplay: 3800,
        autoplayDisableOnInteraction: false,
        speed: 2200,
        loop: true,
        effect: 'fade'
      }
    });
  }

  function GallerySlider (el) {
    var api = new Slider(el, {
      swiper: {
        autoplay: 3800,
        speed: 1400,
        pagination: '.slider-controls__pagination',
        paginationType: 'fraction',
        nextButton: '.slider-controls__arrow-next',
        prevButton: '.slider-controls__arrow-prev'
      }
    });

    var $slides = api.$el.find('.gallery-slider__slide');
    $slides.on('click', onSlideClick);
    api.on('destroyed', function () {
      $slides.off('click', onSlideClick);
    });

    function onSlideClick (e) {
      api.swiper.slideNext();
    }

    return api;
  }
})(document, window, $, Swiper);
