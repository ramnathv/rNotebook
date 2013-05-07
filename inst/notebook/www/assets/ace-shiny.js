$(document).ready(function() {
  var editor = setupAceEditor('notebook', 'nbSrc');
  var h = window.location.search;
  function setSrc(msg) {
    if (msg) {
      alert('unable to read URL ' + h + '\n\nusing default R Markdown example');
    }
    $('#nbSrc').val(editor.getValue());
    $('#proxy button').trigger('click');
  }
  var w = Math.max($(window).width()/2, 300);
  $('#notebook').width(w - 10);
  $('#nbOut').css('left', w + 10 + 'px');
  if (h) {
    // pass a url as a query string after ? in the url
    h = h.replace('?', '');
    $.get(h, {}, function(res) {
      var data = res.data, str = data.content;
      if (typeof(str) != 'string') return(setSrc(true));
      if (data.encoding == 'base64') {
        str = str.replace(/\n/g, '');
        str = decodeURIComponent(escape(window.atob( str )));
      }
      if (str) {
        editor.setValue(str);
        editor.gotoLine(1);
        setSrc(false);
      } else setSrc(true);
    }, 'jsonp')
    .error(function() {
      setSrc(true);
    });
  } else setSrc(false);
})

// Get source Rmd passed as a query string after ? in the url
function getSrc(){
  var h = window.location.search;
  if (h) {
    h = h.replace('?', '');
    $.get(h, {}, function(res) {
      var data = res.data, str = data.content;
      if (typeof(str) != 'string') return(setSrc(true));
      if (data.encoding == 'base64') {
        str = str.replace(/\n/g, '');
        str = decodeURIComponent(escape(window.atob( str )));
      }
      if (str) {
        editor.setValue(str);
        editor.gotoLine(1);
        setSrc(false);
      } else setSrc(true);
    }, 'jsonp')
    .error(function() {
      setSrc(true);
    });
  } else setSrc(false);
}

function setSrc(msg) {
  if (msg) {
    alert('unable to read URL ' + h + '\n\nusing default R Markdown example');
  }
  $('#nbSrc').val(editor.getValue());
  $('#proxy button').trigger('click');
}

function setWidths(){
  var w = Math.max($(window).width()/2, 300);
  $('#notebook').width(w - 10);
  $('#nbOut').css('left', w + 10 + 'px');
}

/*
function loadGist(id) {
  var gistUrl = 'https://api.github.com/gists/' + id;
  xhr(gistUrl, function(err, x) {
    if (err) {
      return 'Error loading Gist';
    } else {
      var d = JSON.parse(x.responseText);
      var c = (values(d.files || {}).filter(function(file) {
        return (file.filename.indexOf('.md') !== -1 || file.filename.indexOf('.txt') !== -1);
      })[0] || {}).content;
    });
}
*/

function gitAjax(){
  $.ajax({
      type: "GET",
      url : "http://api.github.com/gists/329519485740729e38af",
      data: {},
      dataType : "jsonp",
      success : function ( returndata ){
        console.log(returndata)
      }
  });
}
