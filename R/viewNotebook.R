viewNotebook = function (rmdFile = NULL) {
  if (!is.null(rmdFile)) {
    options(NOTEBOOK_TO_OPEN = normalizePath(rmdFile))
    on.exit(options(NOTEBOOK_TO_OPEN = NULL))
  }
  app <- system.file("notebook", package = "rNotebook")
  shiny::runApp(app)
}

createGist <- function(files, description = "", public = TRUE){
  require(rjson)
  files = lapply(files, function(y) list(content = y))
  body = list(description = description, public = public, files = files)
  return(toJSON(body))
}

postGist <- function (gist, viewer = getOption("GIST_VIEWER", "http://pagist.github.io")){
  require(httr)
  if (is.null(getOption("github.username")) || is.null(getOption('github.password'))) {
    paste("Please set your github username and password as options")
    return()
  }
  response = POST(
    url = "https://api.github.com/gists", body = gist, 
    config = c(authenticate(getOption("github.username"), getOption("github.password"), 
      type = "basic"), add_headers(`User-Agent` = "Dummy"))
  )
  html_url = content(response)$html_url
  return(html_url)
  ## message("Your gist has been published")
  ## message("View chart at ", paste(viewer, basename(html_url), sep = "/"))
}

