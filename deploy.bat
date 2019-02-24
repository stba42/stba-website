robocopy css/ dist/css/ /s /e
robocopy img/ dist/img/ /s /e
robocopy js/ dist/js/ /s /e
robocopy private-session/ dist/private-session/ /s /e
robocopy vendor/ dist/vendor/ /s /e
copy *.html dist
REM ncftpput -R -v -u "stefanbaust@spltscreen.de" esm19.siteground.biz / dist/*
TODO TRAVIS-CI
