## R Notebook Viewer and Shiny App

### Quick Start

You can install the package from github using `devtools` and use `viewNotebook` to open a local instance of the notebook

```coffee
require(devtools)
install_github('rNotebook', 'devtools')
rNotebook::viewNotebook()
```

An online Rmd viewer is available at http://ramnathv.github.io/rNotebook. This can load gists that contain the Rmd source file and the knit html (with the option fragment.only = TRUE). You can try this gist as an example https://gist.github.com/ramnathv/329519485740729e38af.

### Motivation

Motivated by the excellent iPython notebook environment, I wanted to create a similar experience for R users. Yihui had already designed a Shiny app that let users knit an Rmd file in the cloud. However, it had to be taken down due to security concerns, as a user could potentially run any malicious code in the Rmd file.

I took Yihui's code and split it into two parts. The first part is an Rmd viewer that allows a user to view an Rmd file and the rendered HTML using a gist as source. Unlike iPython notebooks which only require an `.ipynb` file, the Rmd viewer requires both the source `Rmd` file and the knit `html`. This is not a deal breaker in reality, since it is possible to write wrapper functions that automatically upload the Rmd file and the rendered html as a gist (or as a github repo). Another approach to achieve a single source file would be to hide the Rmd file inside the rendered HTML using a script tag with text as MIMEtype, which can then be read by the viewer application.

The Rmd viewer allows a user to view the Rmd source and the rendered HTML side by side. The download button in the navbar allows a user to download the Rmd file to the desktop. Having downloaded it to the desktop, this Rmd file can be opened as a Shiny app, which constitutes the second part. The Shiny app has a UI very similar to the Rmd viewer, with the difference that a user can edit the Rmd file and render it using the Knit button on top.

Screencast: http://www.youtube.com/embed/3niqZhc_Nbo

### Credits

This package uses code from several open source packages.

1. [KnitR](https://github.com/yihui/knitr)
2. [Shiny](https://github.com/rstudio/shiny)
3. [Markdown-Edit](https://github.com/georgeOsdDev/markdown-edit)
4. [Dillinger](https://github.com/joemccann/dillinger)
5. [Ace Editor](https://github.com/ajaxorg/ace)
6. [Highlight JS](https://github.com/isagalaev/highlight.js)
