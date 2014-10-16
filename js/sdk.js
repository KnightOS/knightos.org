var code = document.querySelectorAll('code');
for (var i = 0; i < code.length; ++i) {
  code[i].addEventListener('mouseenter', function(e) {
    if (document.body.createTextRange) { // ie
      var range = document.body.createTextRange();
      range.moveToElementText(e.target);
      range.select();
    } else if (window.getSelection) { // sane browsers
      var selection = window.getSelection();            
      var range = document.createRange();
      range.selectNodeContents(e.target);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }, false);
}
