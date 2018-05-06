import React from 'react'
import Button from '../general/Button'

export function MarkdownHelpModal(props) {
  return (
    <div className="modal-dialog modal-lg" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Szövegszerkesztő használata</h5>
          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden={true} onClick={props.close}>
              &times;
            </span>
          </button>
        </div>
        <div className="modal-body">
          <h3>Alapok</h3>
          <div className="mx-4">
            <p>
              A szöveszerkesztő a <em>markdown</em> jelölő nyelvet használja kiegészítve a{' '}
              <em>Katex</em> matematikai jelrendszerrel
            </p>
            <ul>
              <li>
                <a target="_blank" href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet">
                  Markdown formázás példákkal
                </a>
              </li>
              <li>
                <a target="_blank" href="https://khan.github.io/KaTeX/function-support.html">
                  Katex dokumentáció példákkal
                </a>
              </li>
            </ul>
          </div>

          <h3>Kiegészítések</h3>

          <div className="mx-4">

            <p>A Zsebtanár tárolójába feltöltött képeket az alábbi módon lehet beszúrni:</p>

            <p><code>@[kép neve.jpeg](6336e63799 =100x200)</code></p>

            <p>ahol</p>
            <ul>
              <li>
                <code>@</code> - Zsebtanár kép beszúrás bővítmény kezdő karaktere
              </li>
              <li>
                <code>[kép neve.jpeg]</code> - teszőleges szöveg ami akor jelenik meg ha a kép nem
                tud betöltődni, vagy amikor a felhasználó a kép fölé viszi az egeret. Ezen felül a
                képernyőolvasó programok is ezt a szöveget olvassák fel, ezért erősen ajánlott
                megfelelő szöveg megadása.
              </li>
              <li>
                <code>6336e63799</code> - a tárolt kép egyedi azonosítója
              </li>
              <li>
                <code>=100x200</code> - A kép mérete pixelben (szélesség x magasság). Nem kötelező
                megadni. Az alábbi formában használható.
                <ul>
                  <li>
                    ha teljesen elhagyjuk akkor a kép eredeti méretben fog megjelenni
                  </li>
                  <li>
                    <code>=100x</code> - csak a szélességet állítjuk 100px-re, a magasság arányosan
                    változik
                  </li>
                  <li>
                    <code>=x200</code> - csak a magasságot állítjuk 200px-re, a szélesség arányosan
                    változik
                  </li>
                  <li>
                    <code>=100x200</code> - a szélességet és a magasságot fixen 100px és 200px
                    állítjuk, nem ajánlott mert torzíthatja a kép arányait
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
        <div className="modal-footer text-center">
          <Button onAction={props.close}>Bezárás</Button>
        </div>
      </div>
    </div>
  )
}
