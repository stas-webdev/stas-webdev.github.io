(function (document) {

  window.Loader = Loader;

  function Loader (overlay) {
    this.overlay = overlay || document.getElementById('LoaderOverlay');
  }

  Loader.prototype.hideOverlay = function () {
    this.overlay.classList.add('loader-overlay--hidden');
  }

})(document);
