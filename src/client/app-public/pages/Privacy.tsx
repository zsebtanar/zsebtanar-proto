import React from 'react'

import { PublicPage } from 'client/generic/components/PublicPage'
import { Markdown } from '../../generic/components/markdown/Markdown'

export function Privacy(): JSX.Element {
  return (
    <PublicPage>
      <div className="mx-auto">
        <div className="container">
          <Markdown
            source={`
## Zsebtanár Adatvédelmi Irányelvek

v2.0 (2020.05.02.)

1. Ez a dokumentum a zsebtanar.hu oldal által gyűjtött adatok köréről és azok felhasználásáról szóló tájékoztató. Az oldal használatával a felhasználó elfogadja a jelen dokumentumban foglaltakat, az oldal használatával tudomásul veszi, hogy a használat során keletkezett adatok az ezen dokumentumban foglaltak alapján tárolásra, felhasználásra kerülnek.

1. A Zsebtanár elkötelezett a felhasználói személyes adatinak védelmében. A személyes adatok kezelését az EU 2016/679 Általános Adatvédelmi Rendelete (GDPR) és az információs önrendelkezési jogról és az információszabadságról szóló 2011. évi CXII. törvény rendelkezései szerint végezzük.

1. Adatkezelő: Zsebtanár, m.me/zsebtanar

1. Adattárolás helye: a Zsebtanár Alapítvány, 6000 Kecskemét, Márvány utca 34. által biztosított infrastruktúra.

1. A Zsebtanár statisztikai adatokat gyűjt az oldal használatával kapcsolatban annak érdekében, hogy az oldal készítői és üzemeltetői minél alaposabban megismerjék a nyújtott szolgáltatás felhasználóinak felhasználói szokásait, igényeit. Ennek érdekében az alábbi adatokat gyűjti és kezeli:

   - A profiloldalon önkéntesen megadott adatok
   - A bejelentkezések idejére, illetve az oldal használata során a felhasználó böngészőprogramjára vonatkozó, és a böngészőprogram által megadott adatok.
   - A Zsebtanár használatával kapcsolatos adatok: keresések, szerkesztett vagy kitöltött feladatlapok, készített vagy saját feladatlaphoz felhasznált kérdések, kitöltési adatok.
   - A felhasználó beleegyezésével a felhasználó Google/Facebook profiljában tárolt és velünk a Google/Facebook API-n keresztül megosztott adatok. (pl. nem, nyelv, stb.)
  
1. A Zsebtanár a statisztikai adatok gyűjtéséhez külső szolgáltatásokat is használ. A látogatottság méréséhez a Google Analytics szolgáltatást, amely szintén szolgáltat látogatottsági statisztikákat is, míg a főoldalon a Zsebtanár Facebook oldalának népszerűsítéséhez a Facebook beépülő pluginját használja, illetve a Google Classroom platformra kínál megosztási lehetőséget.

1. A statisztikai adatok gyűjtéséhez valamint a felhasználók azonosításához a Zsebtanár sütiket (cookie) használ. A felhasznált sütik a következők:

   - Zsebtanár süti a felhasználói munkamenet (session) tárolására
   - Zsebtanár süti a kezelőfelület nyelvének tárolására
   - Facebook saját sütije
   - Google Analytics saját sütije.

1. A gyűjtött adatokat az ezen nyilatkozatban kifejezetten megjelölt eseteken túl kizárólag statisztikai összesítések készítésére használjuk, olyan módon, hogy az egyes, felhasználással kapcsolatos adatokról ne lehessen visszakövetni, hogy milyen természetes személyhez kötődik. A külső szolgáltatások adatkezelésére nincs ráhatásunk és rálátásunk, azokkal kapcsolatban a Facebook, illetve a Google adatkezelési nyilatkozatai az irányadók.

   - https://www.google.com/policies/privacy/
   - https://www.google.com/analytics/terms/us.html
   - https://www.facebook.com/privacy/explanation
   - https://www.facebook.com/policies
  
1. A Zsebtanár nem ellenőrzi a felhasználók által önkéntesen megadott adatok valódiságát, és az adatok valódiságával kapcsolatban minden felelősséget kizár mind az adott felhasználó, mind bármilyen harmadik fél felé.

1. A gyűjtött adatokat a Zsebtanár a szolgáltatásainak monitorozására, fejlesztésére, új szolgáltatáselemek vagy szolgáltatások fejlesztésére, illetve a védelmi rendszerének továbbfejlesztésére használja fel.

1. Felhasználói fiók törlésekor törlésre kerül minden, a felhasználó által szolgáltatott személyes adat. Nem kerülnek törlésre az adott felhasználó azon adatai, amelyek az oldal használatával kapcsolatosak és alkalmatlanok a törölt felhasználói fiók tulajdonosának beazonosítására (például névtelen statisztikai adatok).

1. A Zsebtanár tárolja az oldalon megjelölt, saját (Zsebtanár) kapcsolattartási e-mail címekre érkező leveleket.

1. A tárolt adatoknak a jelen Adatvédelmi nyilatkozatban leírtaktól eltérő célokra való felhasználása csak úgy valósulhat meg, ha előtte a felhasználó ebbe beleegyezik. A beleegyezés történhet írásban, böngésző használatával, vagy ráutaló magatartással. Az adatok eltérő (például egyetemi kutatási) célra való felhasználásáról a felhasználót félreérthetetlen módon tájékoztatjuk.

1. A Zsebtanár a felhasználók regisztrációjához és a bejelentkezési azonosításához a következő személyes adatokat kezeli:

   - Vezetéknév, keresztnév
   - E-mail cím
  
1. A jelenlegi adatvédelmi nyilatkozat nem jogosítja fel a Zsebtanár tulajdonosait, hogy a személyes adatokat megossza harmadik féllel, kivéve, ha az alábbi feltételek valamelyike fennáll:

   - erre az adott felhasználó külön engedélyt adott rá
   - erre jogszabály kötelezi.

1. Adatvédelmi hatóság:<br />Nemzeti Adatvédelmi és Információszabadság Hatóság<br />1125 Budapest, Szilágyi Erzsébet fasor 22/c<br />+36 1 391 1400<br />www.naih.huugyfelszolgalat@naih.hu

1. A Zsebtanár minden elvárhatót megtesz annak érdekében, hogy az adatvesztés kockázatát minimalizálja, ugyanakkor semmilyen jogi garanciát nem vállal a felhasználói adatok (beleértve az elkészített kérdések, feladatlapok) megőrzéséért, ezzel kapcsolatban minden felelősséget kizár mind a felhasználók, mind bármilyen harmadik fél felé.

1. A Zsebtanár fenntartja a jogot, hogy előzetes figyelmeztetés nélkül korlátozzon vagy töröljön olyan felhasználót, amihez kapcsolódóan az oldal hétköznapi, korrekt felhasználásán túlmenő tevékenységet észlel (pl. túlterheléses támadás, más felhasználók zaklatása, akadályozása, nemkívánatos tartalom feltöltése, stb).

1. A Zsebtanár legfrissebb adatvédelmi irányelveit, illetve a korábbi változatokat is hozzáférhetővé teszi a honlapján.

            `}
          />
        </div>
      </div>
    </PublicPage>
  )
}
