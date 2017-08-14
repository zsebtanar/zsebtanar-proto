# Zsebtanár 3.0 prototípus

[![Join the chat at https://gitter.im/zsebtanar-dev/Lobby](https://badges.gitter.im/zsebtanar-dev/Lobby.svg)](https://gitter.im/zsebtanar-dev/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
![Travis build](https://travis-ci.org/zsebtanar/zsebtanar-proto.svg?branch=master)

...


## Fejlesztőknek:

### A projekt futtatásához szükséged lesz:
 - [nodejs 6+](https://nodejs.org/en/)

### Hasznos parancsok
 
- Függőségek telepítése: `npm install`
- Oldal futtatása fejlesztői módban: `npm run dev`
- Éles verzió létrehozása: `npm run build`
- Éles verzió létrehozása és telepítése: `npm run deploy`

*telepítéshez Firebase konzol hozzáférésre van szükség*

 
### Cloud functions telepítése

Fontos, hogy a telpítéskor a `service-account-credentials.json` fájl már a `functions` könyvtárban legyen mert enélkül nem működik a bélyegkép generálás.

Sajnos a tartalma miatt ezt a fájlt nem tölthetjük fel a repository-ba.

Ha újat kell létrehozni akkor a következőt kell tenni a Firebase kozolban :
 - válasszuk ki a **project settings** > **Service Accounts opciót** 
 - kattintsuk a **Generate New Private Key** gombra
 - mentsük a `json` fájlt a `functions` könyvtárban 
 - nevezzük át `service-account-credentials.json`
 - végül telepítsük `npx firebase deploy --only functions`
 