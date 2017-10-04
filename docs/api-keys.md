# API kulcsok beállítása


## CI

[Zsebtanár Circle CI projekt](https://circleci.com/gh/zsebtanar/zsebtanar-proto)
 
Firebase CI kulcs generálás:

    firebase login:ci
 
## Algolia kereső

AppId és API kulcs:

    https://www.algolia.com/apps/UE3Y6VH327/api-keys

Firebase config beállítása:

    firebase functions:config:set algolia.app_id="myAlgoliaAppId" algolia.api_key="myAlgoliaApiKey" 
 
## Service account credentials Firebase storage-hez

A Firebase kozolban:
 - válasszuk ki a **project settings** > **Service Accounts opciót** 
 - kattintsuk a **Generate New Private Key** gombra
 - állítsuk be a szükséges paraméterek a CI-ban