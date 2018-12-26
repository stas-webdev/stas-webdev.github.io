(function () {

  document.addEventListener('DOMContentLoaded', function () {
    initMainMenu();
  });

  function initMainMenu () {
    var menuBtn = document.getElementById('MainMenuBtn');
    var hamburger = menuBtn.querySelector('.hamburger');
    var menuOverlay = document.getElementById('MainMenuOverlay');
    var menuItems = document.querySelectorAll('.navbar-menu-item');
    var isMenuOpen = false;

    menuBtn.addEventListener('click', function (e) {
      e.preventDefault();
      if (isMenuOpen) closeMenu();
      else openMenu();
    });

    menuItems.forEach(function (menuItem) {
      menuItem.addEventListener('click', onMenuItemClick);
    });

    function onMenuItemClick () {
      if (isMenuOpen) closeMenu();
    }

    function openMenu () {
      menuBtn.classList.add('navbar-menu-btn--active');
      hamburger.classList.add('hamburger--active');
      menuOverlay.classList.add('navbar__menu--opened');
      isMenuOpen = true;
    }

    function closeMenu () {
      menuBtn.classList.remove('navbar-menu-btn--active');
      hamburger.classList.remove('hamburger--active');
      menuOverlay.classList.remove('navbar__menu--opened');
      isMenuOpen = false;
    }
  }

})();

(function () {

  document.addEventListener('DOMContentLoaded', initTriggerButtons);

  function initTriggerButtons () {
    const btns = document.querySelectorAll('[data-scroll-to]');
    btns.forEach(function (btn) {
      btn.addEventListener('click', onTriggerButtonClick);
    });
  }

  function onTriggerButtonClick (e) {
    var anchor = this.getAttribute('href');
    var targetEl = document.querySelector(anchor);
    if (!targetEl) return;
    e.preventDefault();
    var offset = getElOffset(targetEl);
    scrollWindowTo(offset.top, 500, function () {
      window.location.href = anchor;
    });
  }

  function getElOffset(el) {
    var rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
  }

  function scrollWindowTo(to, duration, callback) {
      var element = window;
      var start = element.scrollY;
      var change = to - start;
      var currentTime = 0;
      var increment = 20;

      animateScroll();

      function animateScroll (){
        currentTime += increment;
        var val = easeInOutQuad(currentTime, start, change, duration);
        element.scrollTo({ top: val });
        if(currentTime < duration) {
            setTimeout(animateScroll, increment);
        } else if (callback) {
          callback.call();
        }
      }

      //t = current time
      //b = start value
      //c = change in value
      //d = duration
      function easeInOutQuad (t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2  * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
      };
  }

})();
