# Google-identity

## Instructions

1. Require your google archive (https://takeout.google.com/settings/takeout)
2. Download archive after you get the email from google
3. Copy the files form the `/download/takeout/searches` to `/Google-identity/google-data-extractor/json` 
4. Install node.js on your computer (https://nodejs.org/en/)
5. Open terminal app on your computer and got to the folder `/Google-identity/google-data-extractor`
6. Type command `npm install node-modul`
7. Type command `npm install moment`
8. Type command `node runExtractor.js`
9. Create a server for the folder `/Google-identity/html` with the following command in your terminal `python -m SimpleHTTPServer 8080` 
10. Go to http://localhost:8080 and look at your data