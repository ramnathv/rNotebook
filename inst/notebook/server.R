library(shiny)
options(device.ask.default = FALSE)
allow_knit = TRUE
# addResourcePath('Library', '/Library')

createHTML <- function(src){
  library(knitr)
  figdir = tempdir(); on.exit(unlink(figdir))
  opts_knit$set(progress = FALSE, fig.path = figdir)
  if (length(src) == 0L || src == '')
    return('Nothing to show yet...')
  on.exit(unlink('figure/', recursive = TRUE)) # do not need the figure dir
  paste(try(knit2html(text = src, fragment.only = TRUE)),
    '<script>',
    '// highlight code blocks',
    "$('#nbOut pre code').each(function(i, e) {hljs.highlightBlock(e)});",
    'MathJax.Hub.Typeset(); // update MathJax expressions',
    '</script>', sep = '\n'
  )
}


shinyServer(function(input, output) {
  
  output$published <- renderText({
    input$publish
    if (input$publish == 0){
      return('Nothing to Publish')
    }
    isolate({
      gist <- createGist(list(
        'index.Rmd' = input$nbSrc, 
        'index.html' = createHTML(input$nbSrc)
      ))
      postGist(gist)
      return('Posted Gist')
    })
  })
  
  output$nbOut = reactive({
    src = input$nbSrc
    if (allow_knit == TRUE){
      library(knitr)
      figdir = tempdir(); on.exit(unlink(figdir))
      opts_knit$set(progress = FALSE, fig.path = figdir)
      if (length(src) == 0L || src == '')
        return('Nothing to show yet...')
      on.exit(unlink('figure/', recursive = TRUE)) # do not need the figure dir
      paste(try(knit2html(text = src, fragment.only = TRUE)),
            '<script>',
            '// highlight code blocks',
            "$('#nbOut pre code').each(function(i, e) {hljs.highlightBlock(e)});",
            'MathJax.Hub.Typeset(); // update MathJax expressions',
            '</script>', sep = '\n'
      )
    } else {
      paste(c(readLines('www/example.html'), readLines('www/highlight.html')),
        collapse = '\n')
    }
  })
})
