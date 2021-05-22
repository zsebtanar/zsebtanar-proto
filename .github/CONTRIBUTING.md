# Közreműködés

Segíteni szeretnél? Rengeteg lehetőséged van, hogy részt vegyél a munkában.

## Tratalomjegyzék

* [Új feladat létrehozása](#uj-feladat-letrehozasa)
  * [Hibabejelentés](#hibabejelentes)
  * [Új funkció kérése](#uj-funkcio-kerese)
  * [Címkék](#cimkek)
  * [Kódhozzájárulás](kódhozzájárulás)
    * [Zsebtanár futtatása saját gépen](zsebtanár-futtatasa-sajat-gepen)
    * [Repository fork-olása és clone-ozása](repository-fork-olasa-és-clone-ozasa)
    * [Kód függőségek telepítése](kod-fuggosegek-telepitese)
    * [Alkalmazás futtatása](alkalmazas-futtatasa)
    * [Tesztek futtatása](tesztek-futtatasa)
    * [Zsebtanár build](zsebtanar-build)
    * [Alkalmazás telepítése](alkalmazas-telepitese)
  * [Módosítások lépésről-lépésre](modositasok_lepesrol-lepesre)
    * [1. lépés: Ellenőrzés](1-lepes-ellenorzes)
    * [2. lépés: Repository frissítése](2-lepes-repository-frissitese)
    * [3. lépés: Branch](3-lepes-branch)
    * [4. lépés: Commit](4-lepes-commit)
    * [5. lépés: Teszt](5-lepes-teszt)
    * [6. lépés: Push és Pull Request készítés](6-lepes-push-es-pull-request-keszites)
  * [Kód Style Guide](kod-style-guide)
* [Developer's Certificate of Origin 1.1](developers-certificate-of-origin-11)
* [A dokumentációról](a-dokumentaciprol)

## Új feladat létrehozása

A [GitHub Issues][issues] funkcióját használjuk minden az oldal működését érintő 
kérdés megvitatására, mint például **hibák**, **új fejlesztések** és egyéb 
ötletek megbeszélése.

A feladat leírása mindig magyar nyelven történik.

### Hibabejelentés

Azt tekintjük hibának amely szorosan kapcsolód az oldal kódbázisához vagy 
annak funkcionalitásához. A részletes és jó hibabejelentések rendkívül hasznosak
a számunkra

Előre is köszönjük!

#### Útmutató a hibabejelentéshez

1. Használd a [GitHub issue keresőt][issues] és ellenőrizd, hogy a feladat 
   nem szerepel-e már a nyitott feladtok között.
1. Mindig ellenőrizd, hogy a talált hibát reprodukálni tudod a [teszt szerveren][test]
   és ha van rá módod akkor a saját fejlesztői környezetedben a `develop` ágon.  
1. Válaszolj meg minden a [feladat mintában][repo issue tpl] szereplő kérdést.
   Ha szükségesnek látod mellékelj képernyőképet vagy videót.
   
A fenti pontok pontos kitöltésével nagyon sokban segítheted a fejlesztők munkáját 
illetve csökkentheted az oda-vissza kérdések számát.
   
**[Új hiba bejelentése][new issues]**

### Új funkció kérése

1. Használd a [GitHub issue keresőt][issues] és ellenőrizd, hogy nincs-e már
   hasonló kérés a feladatok között. Ha kérés már szerepel adj hozzá +1-et vagy
   fűzz hozzá megjegyzést ha nem teljes a leírás.
1. Ha még nincs hasonló kérés akkor hozz létre egy újat. Kérlek részletesen és
   a lehető legpontosabban írd le a kért funkciót. Mellékelj példákat is.
1. A kérés megírásában is segítségedre lehet a [feladat minta][repo issue tpl].

Nagyon fontos, hogy részletes írd le mi a célja és, hogy miért van szükség az új funkcióra. 
Ennek legegyszerűbb módja ha írsz egy vagy több felhasználói esetet (use case) arról, hogy mikor hasznos a kért módosítás. 

**[Új funkció kérése][new issues]**


### Címkék

A feladatokat címkékkel látjuk el az egyszerűbb kereshetőség érdekében

| Címke neve | feladat vagy PR | Leírás |
|-------|-------------|-------------|
| 1-13 pont | Feladat | A feladat nehézségi szintje / komplexitás, ahol a 1 triviális falat a 13 pedig akár több hetes munka is lehet (lást [Story points][]). |
| Várhat, Normál, Fontos, Kritikus | Feladat | A fontosságot jelöli. |
| Hiba | Feladat | Rendszerrel kapcsolatos hiba |
| Új funkció | Feladat | Új fejlesztés vagy meglévő modul bővítése. |
| *Sötétkék címkék:* UI/UX, Admin, Backend, Optimalizáció, ...| Feladat | A feladat által érintett modulok. |
| Megbeszélés | Feladat | Valódi feladat helyett egyfajta fórum topikot jelöl ahol közösen megvitathatjuk az adott témát. A téma lezárása után jöhetnek létre a kapcsolódó feladatok. |
| Döntésre van szükség | Feladat | Az így megjelölt feladatok elakadtak vagy már elévültek és a legközelebbi élő megbeszélésen döntést kell hozni a további sorsáról. |
| *Fehér címkék:* greenkeeper, ... | feladat | GitHub bővítmények címkéi. |

A címkék feladathoz rendelését kérlek hagyd az adminisztrátorokra, kivéve ha **Hiba** jegyről van szó.

A **Hiba** és **Új feladat** esetén mindig adjuk meg a *fontosságot*, a *nehézségez*, és a *kapcsolódó modult* (ha lehetséges).  
  

## Kódhozzájárulás

Mindenek előtt fontos, hogy el tudd indítani az oldalt a saját számítógépeden és, hogy
képes legyél futtatni a teszteket.

A minimális fejlesztőkörnyezet kialakításához **git**-re és **NodeJS**-re lesz szükséged,
melyeket a következőképpen [telepíthetsz][Wiki setup env].

### Zsebtanár futtatása saját gépen

#### Repository fork-olása és clone-ozása

Először is [fork](http://help.github.com/fork-a-repo/) -oldnod kell a Zsebtanár repository-ját (kódbázisát) amit a jobb felső sarokban lévő gombbal tehetsz meg. 
A fork során készül egy másolat a Zsebtanár repository-ról a te fiókod alatt, ebben tudsz majd dolgozni.
 

A munka megkezdéséhez le kell töltened a saját számítógépedre az imént fork-olt repository-t, melyet a `git clone` paranccsal tehetsz meg:

```sh
git clone https://github.com/<your-username>/zsebtanar-proto.git
```

Lépj át a frissen létrehozott könyvtárba

```sh
cd zsebtanar-proto
```

Ahhoz, hogy mindig naprakészen tudd tartani a saját repository-dat érdemes összekapcsolni az eredeti (upstream) repository-val

```sh
git remote add upstream https://github.com/zsebtanar/zsebtanar-proto.git
```

> A jövőben, ha szükséged van a legfrissebb változtatásokra a Zsebtanár repository-ból  és már beállítottad az "upstream" linket, akkor elég meghívni a következő parancsokat: 
>
> ```sh
> git remote update
> git checkout develop
> git pull upstream develop
> ```

#### Kód függőségek telepítése

A NodeJS modulokat a node package manager-rel (npm) tudjuk telepíteni:

```sh
npm install
```

Az npm segítségével általunk definiált parancsokat (lásd `packapge.json`) is futtathatunk.

#### Alkalmazás futtatása

A következő paranccsal indíthatjuk el az alkalmazást, fejlesztői módban. 

```sh
npm run start
```

A futó alkalmazás megnyitásához csak használd a következő linket: [http://localhost:8080](http://localhost:8080). 

Lehetőség van más eszközökön (pl.: mobil, tablet) is futtatni az app-ot, lásd [itt][Wiki dev test] 

> A port szám eltérő lehet ha már foglalt a 8080, ilyenkor mindig a terminálban látható link a helyes

A fejlesztői módban több szempontból is különbözik az éles változattól:

- Nincs méret optimalizáció
- Minden kód módosítás után automatikusan frissül az oldal
- A futó kód *nem* íródik ki a fájlrendszerre (`/bin`)
- A kód számos hibakeresést segítő funkciót tartalmaz 
- Sourcemap elérhető
- Bizonyos szolgáltatások nem aktívak (sentry, stb.) 

#### Tesztek futtatása

```sh
npm test
```

#### Zsebtanár build

A fejlesztői és éles környezet nagyban különbözik ezért külön parancs van a végleges telepíthető alkalmazás előállításához (build)

```sh
npm run build
```

A build parancs hatására létrejön a `/bin` könyvtár amely tartalmazza az összes az alkalmazás futtatásához szükséges (kliens és szerver oldali) komponenst.


#### Alkalmazás telepítése 

Az alkalmazás telepítéséhez szükséged lesz egy Firebase fiókra és be is kell jelentkezned az általad használt terminálban. Bővebb információért nézd meg [Firebase CLI dokumentációját](https://firebase.google.com/docs/cli/)

> Ha saját firebase app-ként szeretnél telepíteni akkor állítsd be a project ID-t a `.firebaserc` fájlban

A következő parancs lefuttatja a build-et és telepítést

```sh
npm run deploy
```

> A Zsebtanár test és prod szerverre csak megfelelő hozzáféréssel tudsz telepíteni. 


### Módosítások lépésről-lépésre

#### 1. lépés: Ellenőrzés

Akár hozzáadni készülsz egy új funkciót, vagy egy hibát szeretnél kijavítani, esetleg csak javítani szeretnél a minőségen, mindenek előtt nézd át az összes kapcsolódó [feladatot][issues] (a lezártakat is) és a kapcsolódó megjegyzéséket, hogy minél pontosabban megértsd a rendszer javítani kívánt részeit. 
Ha találsz egy feladatot, de még senki nem dolgozik rajta, csak írj egy megjegyzést, hogy te vállalod. Ha még nincs feladat a problémára amin dolgoznál, hozz létre egy újat az [útmutató](uj-feladat-letrehozasa) alapján. 


#### 2. lépés: Repository frissítése

Mielőtt munkához látsz bizonyosodj meg arról, hogy minden módosítás rendelkezésre áll a helyi repository-dban:

```sh
git remote update
git checkout develop
git rebase upstream/develop
```

#### 3. lépés: Branch

A legjobb munkát egy új branch-en (ág) végzed. A Zsebtanár projektben mindig a `develop` ágat használjuk fejlesztésre, tehát ebből ágaztasd el a saját branch-edet is. 

```sh
git checkout develop
git checkout -b my-branch
```

> jó ha a branch neve 3-6 szóban leírja a munka célját és ha van kapcsolódó feladat akkor a feladat számát is beleírhatod. pl.: 99-ie11-fejlec-javitas

#### 4. lépés Commit

A fejlesztés során commit-olj rendszeresen és írj egy rövid megjegyzést a hozzáadott módosításokról.
A commit megjegyzése magyar nyelven íródjon a következők szerint:

1. Az első sor kettős keresztel kezdődik majd a kapcsolódó feladat száma következik végül egy rövid összefoglalás a commit-ról. Az első sor maximum 50 karakter hosszú lehet
1. A további sorok (a megjegyzés törzse) csak nagyobb módosítás esetén szükséges. Itt részletesebben is kifejtheted mi és miért úgy változott ahogy, esetleg felhívhatod a figyelmet pl böngésző specifikus dolgokra, stb.

```sh
git add src/xzy/abc.tsx
git commit
```

Példa commit megjegyzés: 

```tsx
#99 IE 11 fejléc javítása

Módosítottam a fejlécében a szín megadást mert az IE11 nem támogatja az rgba módot
```

> Commit előtt ellenőrizd, hogy helyesek a git név és email cím beállításaid:
>
> ```sh
> git config --global user.name "Kis Pista"
> git config --global user.email "kis.pista@example.com"
> ```

#### 5. lépés: Teszt

Ha módosítottál kódot akkor a PR létrehozása előtt ellenőrizd, hogy minden teszt lefut-e és hiba esetén módosítsd a szükséges kódot vagy magát a tesztesetet.
Hibajavítás esetén írj tesztet mely sikeresen lefut a módosított kóddal, de hibát jelez az módosítás előttivel.    

```sh
npm test
```

Bővebben a [teszt futtatásról itt][#tesztek-futtatasa]

#### 6. lépés: Push és Pull Request készítés

```sh
git push origin branch-neve
```

Majd irány a [Zsebtanár repository][repo] és kattints a "Pull Request" gombra és töltsd ki a pull request megjegyzés üres mezőit, lásd [pull request minta][repo pr tpl].

### Kód Style Guide

A Zsebtanár projekt a [Prettier][prettier] kód style-t alkalmazza
Our javascript is linted using [videojs-standard][linter].

## [Developer's Certificate of Origin 1.1](https://developercertificate.org/)

By making a contribution to this project, I certify that:

* (a) The contribution was created in whole or in part by me and I
  have the right to submit it under the open source license
  indicated in the file; or

* (b) The contribution is based upon previous work that, to the best
  of my knowledge, is covered under an appropriate open source
  license and I have the right under that license to submit that
  work with modifications, whether created in whole or in part
  by me, under the same open source license (unless I am
  permitted to submit under a different license), as indicated
  in the file; or

* (c) The contribution was provided directly to me by some other
  person who certified (a), (b) or (c) and I have not modified
  it.

* (d) I understand and agree that this project and the contribution
  are public and that a record of the contribution (including all
  personal information I submit with it, including my sign-off) is
  maintained indefinitely and may be redistributed consistent with
  this project or the open source license(s) involved.

## A dokumentációról

Ez a dokumentáció más open source projektek leírása alapján készült, többek kötött a [contribute.md template](https://github.com/contribute-md/contribute-md-template),
és a [vidoe.js CONTRIBUTING.md](https://github.com/videojs/video.js/blob/master/CONTRIBUTING.md).

[repo]: https://github.com/zsebtanar/zsebtanar-proto
[issues]: https://github.com/zsebtanar/zsebtanar-proto/issues
[new issues]: https://github.com/zsebtanar/zsebtanar-proto/issues/new
[repo pr tpl]: pull_request_template.md
[repo issue tpl]: issue_template.md
[test]: http://zsebtanar-test.firebaseapp.com/

[Story points]: https://www.google.com/search?q=story+points
[Wiki setup env]: /zsebtanar/zsebtanar-proto/wiki/Fejlesztői-környezet-beállítása
[Wiki dev test]: /zsebtanar/zsebtanar-proto/wiki/Tesztelése-különböző-böngészőben

[prettier]: https://prettier.io/
