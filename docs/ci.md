# CI

[Zsebtanár Circle CI projekt](https://circleci.com/gh/zsebtanar/zsebtanar-proto)
 

## Firebase CI kulcs generálás

    firebase login:ci
 
## Service account credentials Firebase storage-hez

A Firebase kozolban:
 - válasszuk ki a **project settings** > **Service Accounts opciót** 
 - kattintsuk a **Generate New Private Key** gombra
 - állítsuk be a szükséges paraméterek a CI-ban