## R Notebook Viewer and Shiny App

<style>p {text-align: justify;}</style>

<div id='video' style='display:block;margin-left:auto;margin-right:auto;'>
<iframe width="710" height="400" src="http://www.youtube.com/embed/3niqZhc_Nbo" frameborder="0" allowfullscreen></iframe>
</div>

Motivated by the excellent iPython notebook environment, I wanted to create a similar experience for R users. Yihui had already designed a Shiny app that let users knit an Rmd file in the cloud. However, it had to be taken down due to security concerns, as a user could potentially run any malicious code in the Rmd file.

I took Yihui's code and split it into two parts. The first part is an Rmd viewer that allows a user to view an Rmd file and the rendered HTML using a gist as source. Unlike iPython notebooks which only require an `.ipynb` file, the Rmd viewer requires both the source `Rmd` file and the knit `html`. This is not a deal breaker in reality, since it is possible to write wrapper functions that automatically upload the Rmd file and the rendered html as a gist (or as a github repo). Another approach to achieve a single source file would be to hide the Rmd file inside the rendered HTML using a script tag with text as MIMEtype, which can then be read by the viewer application.

The Rmd viewer allows a user to view the Rmd source and the rendered HTML side by side. The download button in the navbar allows a user to download the Rmd file to the desktop. Having downloaded it to the desktop, this Rmd file can be opened as a Shiny app, which constitutes the second part. The Shiny app has a UI very similar to the Rmd viewer, with the difference that a user can edit the Rmd file and render it using the Knit button on top.