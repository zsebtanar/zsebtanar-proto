# Környezetek

## Lépések:

 - Új firebase projekt készítése
   - Jogosúltságok beállítása 
   - Firebase plan beállítása "Blaze"-re (pay as you go)
   - Bejelentkezési módok beállítása
   - DB átelemése
     - DB exportálása
     - Publikált feladatok és felhasználók törlése, minden hivatkozással együüt
     - importáljuk a DB az új projektbe
 - Algolia 
   - Új app létrehozása
   - app id és publikus kulcs beállítása a firebase cloud fanction config-ban
 - Sentry 
   - Új app létrehozása 
 - CI
   - Firebase ci kulcs beállítása CI env variables-ben
   - `.circleci/config.yml` frissítése
 - Fejlesztői környezet átállítása
   - `.firebaserc` frissítése
   - `build/config.js` firssítése (firebase, sentry, algolia, ...) 
 - Dokumentáció
 

## Firebase

 - Test: `zsebtanar-test`
 - Production: `zsebtanar-proto-76083`
 
CI kulcs generálás:

    firebase --project=... login:ci

Cloud function konfigurálása

    firebase --project=... functions:config:set algolia.app_id="AppId" algolia.api_key="AdminApiKey"
    firebase --project=... functions:config:set recaptcha.secret_key="SecretKey"
 
### Service account credentials Firebase storage-hez

A Firebase kozolban:
 - válasszuk ki a **project settings** > **Service Accounts opciót** 
 - kattintsuk a **Generate New Private Key** gombra
 - állítsuk be a szükséges paraméterek a CI-ban
 
 
## Circle CI

[Zsebtanár Circle CI projekt](https://circleci.com/gh/zsebtanar/zsebtanar-proto)
 
## Algolia - szabadszavas kereső

AppId és API kulcs:

 - test: https://www.algolia.com/apps/J8PWVF536F/api-keys
 - production: https://www.algolia.com/apps/UE3Y6VH327/api-keys
  
 ## Sentry
 
 