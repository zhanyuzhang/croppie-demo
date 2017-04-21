(function () {
  function remResize(originWidth) {
    originWidth = originWidth || 750;
    var screenWidth = document.documentElement.clientWidth;
    document.documentElement.style.fontSize = ((screenWidth / originWidth) * 100) + 'px';
  }
  remResize();
  window.addEventListener('resize', function () {
    remResize();
  }, false);
}());