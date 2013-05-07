// namespace
window.application = {
  editor: "",
  apiLimit:1500,
  enabeAutoReload:false,
  enableShortcut:false,
  md:"",
  viewer:"",
  db:localStorage,
  converter:"marked", // default converter is `marked`
  isRendering:false,
  rmdfile: "example.Rmd"
};
window.URL = window.URL || window.webkitURL;


// Dom Ready
$(function(){
  
  // initialize ace editor
  application.editor = setupAceEditor('notebook', 'nbSrc');
  
  // handle file
  $("#lefile").change(function() {
    $('#fileinput').val($(this).val());
  }); 
  
  // button binding
  $(".view").each(function(){
    var self = this;
    $(self).bind("hover",function(){
      $(self).tooltip({
        placement:"bottom",
        delay: { show: 100, hide: 100 }
      });
    })
    .bind("click",function(event){
      event.preventDefault();
      handleOnClick($(self).attr("id"));
    });
  });
  
  // checkbox binding
  $("#autoReload").change(function() {
    application.enabeAutoReload = ($(this).attr("checked") === "checked");
    autoReload();
  });
  
  // checkbox binding
  $("#enableShortcut").change(function() {
    application.enableShortcut = ($(this).attr("checked") === "checked");
  }); 
  
  
  // checkbox binding
  $('[name="optionsConverter"]').change(function() {
    application.converter = $(this).val();
    convert();
  });
  
  // theme dropdown binding from dillinger.
  $('#theme-list')
    .find('li > a')
    .bind('click', function(e){
      changeAceTheme(e)
      return false
    })
    
  // binding for downloadRmd
    $('#downloadRmd').bind('click', function(e){
       createDownload();
      $(this).trigger('click')
      $(this).trigger('click')
      return false;
    })  
  
  
  $("body").keydown( function(event) {
    if (application.enableShortcut){ 
      var code = (event.keyCode ? event.keyCode : event.which)
      ,ctrl = event.ctrlKey
      ,alt = event.altKey
      ,shift = event.shiftKey
      ,cmd = event.metaKey;
      // browse file `ctrl + o`
      if ((ctrl || cmd) && code == 79) {
        event.preventDefault();
        $("#lefile").click();
        return;
      }
      // read file `ctrl + r`
      if ((ctrl || cmd) && code == 82) {
        event.preventDefault();
        readFile();
        return;
      }
      // raw .md file `ctrl + m`
      if ((ctrl || cmd) && code == 77) {
        event.preventDefault();
        viewRaw("md");
        return;
      }
      // raw .html file `ctrl + alt + h`
      if ((ctrl || cmd) && !alt && code == 72) {
        event.preventDefault();
        viewRaw("html");
        return;
      }
      // view .html file `ctrl + alt + h`
      if ((ctrl || cmd) && alt && code == 72) {
        event.preventDefault();
        openViewer();
        return;
      }
      // exec convert `ctrl + e`
      if ((ctrl || cmd) && code == 69) {
        event.preventDefault();
        convert();
        return;
      }
    }
  });
})


function handleOnClick(id){
  switch (id) {
    case "btnBrowse":
      // show file browse dialogue
    $("#lefile").click();
    break;
    case "btnRead":
      // read local file    
    readFile();
    // readGist();
    break;    
    case "btnRawMd":
      // show Raw .md file    
    viewRaw("md");
    break;
    case "btnRawHtml":
      // show Raw .html file
    viewRaw("html");
    break;
    case "btnHtml":
      // view .html
    openViewer();
    break;
    case "btnConv":
      // exec convert  
    convert();
    break;
    case "btnConv2":
      console.log("Knitting...")
    break;
    
    default:
      console.log("Error:invalid case");
    break;
  }
}

// read local file
function readFile(f){
  var fileData = f || document.getElementById("lefile").files[0];
  if (!fileData){
    showAlert("File was not found.");
    return;
  }
  if (fileData.type && !fileData.type.match('text.*')) {
    showAlert("Cannot read file. Please set plain text file.");
    return;
  }
  var reader = new FileReader();
  reader.onerror = function (evt) {
    showAlert("Cannot read file, some eroor occuerd.");
    return;
  }
  reader.onload = function(evt){
    $("#nbSrc").val(evt.target.result);
    application.editor.setValue(evt.target.result);
    application.editor.gotoLine(1)
  }
  reader.readAsText(fileData, "utf-8");
}


// save file to data url
function viewRaw(file){
  var text,blobBuilder,blob;
  switch (file) {
    case "md":
      text = application.editor.getValue();
    break;
    case "html":
      // text = $("#out").html();
      text = $("#nbOut").html();
    break;
    default:
      console.log("invalid param");
    return;
  }
  blob = new Blob([text], {type: "text/plain",charset:"utf-8"});
  window.open(window.URL.createObjectURL(blob),"_blank","width=800,height=800,titlebar=no,toolbar=yes,scrollbar=yes")
}

// create download
// refactor so that blob creation is a function that can be used by
// viewRaw and createDownload
function createDownload(){
   var text,blobBuilder,blob;
   var text = application.editor.getValue();
   var blob = new Blob([text], {type: "text/plain",charset:"utf-8"});
   var url = window.webkitURL.createObjectURL(blob);
   $("#downloadRmd").attr({href: url, download: application.rmdfile});
}


// showAlert
function showAlert(msg,option){
  $("#alertMessage").alert("close");
  if(!option) option = "alert-error";
  $("#alertMessage>p").text(msg);
  $("#alertMessage")
  .removeClass("display-none")
  .removeClass("out")
  .addClass(option)
  .addClass("in")
  .bind("close", function (evt) {
    evt.preventDefault();
    $(this)
    .removeClass("in")
    .addClass("out")
    .trigger("closed");
  })
  .bind("closed", function () {
    var self = this;
    $(self)
    .addClass("display-none")
    .removeClass(option);
  });
}

// open view window
function openViewer(){
  if(application.viewer) application.viewer.close();
  application.viewer = open('view.html','_blank','width=800,height=800,titlebar=no,toolbar=no,scrollbar=yes');
}

// change ace editor theme
function changeAceTheme(e){
  // check for same theme
  var $target = $(e.target), $theme  = $('#theme-list');
  $theme.find('li > a.selected').removeClass('selected')
  $target.addClass('selected')
  var newTheme = $target.attr('data-value')
  $(e.target).blur()
  application.editor.setTheme(newTheme)       
}

// Setup ace editor and tie it to a textarea
// Author: Yihui Xie, Ramnath Vaidyanathan
function setupAceEditor(aceEl, textEl){
  var editor = ace.edit(aceEl);
  
  editor.setTheme("ace/theme/solarized_light");
  editor.getSession().setMode('ace/mode/markdown');
  editor.getSession().setUseWrapMode(true);
  editor.getSession().setTabSize(2);
  editor.getSession().setFoldStyle('markbegin');
  
  editor.getSession().on('change', function(e) {
    $('#' + textEl).val(editor.getValue()).change();
  });
  
  editor.getSession().selection.on('changeSelection', function(e) {
    var s = editor.session.getTextRange(editor.getSelectionRange());
    if (s == '') s = editor.getValue();
    $('#' + textEl).val(s).change();
  });
  
  editor.commands.addCommand({
    name: 'insertChunk',
    bindKey: 'Ctrl-Alt-I',
    exec: function(editor) {
      editor.insert('```{r}\n\n```\n');
      editor.navigateUp(2);
    }
  });
  
  editor.commands.addCommand({
    name: 'compileNotebook',
    bindKey: 'F4|Ctrl-Shift-H',
    exec: function(editor) {
      $('#btnConv2 button').trigger('click');
    }
  });
  
  return(editor)
}

function readGist2(){
  var id = $('#fileinput').val()
  $.getJSON('https://api.github.com/gists/' + id + '?callback=?', function(res) {
    rmd = res.data.files['test.Rmd'].content
    application.editor.setValue(rmd)
    application.editor.gotoLine(1)
    html = res.data.files['test.html'].content
    $('#nbOut').html(html)
    $('pre code').each(function(i, e) {hljs.highlightBlock(e)});
    MathJax.Hub.Typeset();
  });
};

function insertOut(html){
  $('#nbOut').empty().append(html)
  $('pre code').each(function(i, e) {hljs.highlightBlock(e)});
  MathJax.Hub.Typeset();
  exec_body_scripts('#nbOut');
} 

function readGist(id){
  var id = id || $('#fileinput').val()
  $.getJSON('https://api.github.com/gists/' + id + '?callback=?', function(res) {
    files = res.data.files
    for (file in files){
      ext = file.split('.').pop();
      if (ext === 'html'){
        html = files[file].content
        insertOut(html)
      } 
      if (ext === 'Rmd'){
        rmd = files[file].content
        application.rmdfile = file
        application.editor.setValue(rmd)
        application.editor.gotoLine(1)
      }
    }
  });
};


// http://stackoverflow.com/questions/2592092/executing-script-elements-inserted-with-innerhtml?lq=1
function exec_body_scripts(body_el) {
  // Finds and executes scripts in a newly added element's body.
  // Needed since innerHTML does not run scripts.
  //
  // Argument body_el is an element in the dom.

  function nodeName(elem, name) {
    return elem.nodeName && elem.nodeName.toUpperCase() ===
      name.toUpperCase();
  };

  function evalScript(elem) {
    var data = (elem.text || elem.textContent || elem.innerHTML || "" ),
        head = document.getElementsByTagName("head")[0] ||
                  document.documentElement,
        script = document.createElement("script");

    script.type = "text/javascript";
    try {
      // doesn't work on ie...
      script.appendChild(document.createTextNode(data));      
    } catch(e) {
      // IE has funky script nodes
      script.text = data;
    }

    head.insertBefore(script, head.firstChild);
    head.removeChild(script);
  };

  // main section of function
  var scripts = [],
      script,
      children_nodes = body_el.childNodes,
      child,
      i;

  for (i = 0; children_nodes[i]; i++) {
    child = children_nodes[i];
    if (nodeName(child, "script" ) &&
      (!child.type || child.type.toLowerCase() === "text/javascript")) {
          scripts.push(child);
      }
  }

  for (i = 0; scripts[i]; i++) {
    script = scripts[i];
    if (script.parentNode) {script.parentNode.removeChild(script);}
    evalScript(scripts[i]);
  }
}; 