import React from 'react'
import { Markdown } from '../general/Markdown'
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
          <p>
            A szövegszerkesztő a <strong>markdown</strong> jelölőnyelvet használja. A legfontosabb parancsokat összegyűjtöttük Neked. Ha ez nem lenne elég, részletes angol nyelvű útmutatót <a target="_blank" href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet">itt találsz</a>.
          </p>
          <div className="row">
            <div className="col-6">
              <h3>Ezt kell beírni:</h3>
            </div>
            <div className="col-6">
              <h3>Így fog kinézni:</h3>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <h4>Felsorolás</h4>
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <p>Egyszerű felsorolás:</p>
              <p>- Listaelem<br />
              - Listaelem<br />
              - Listaelem</p>
              <p>Számozott lista:</p>
              <p>1. Egy<br />
              2. Kettő<br />
              3. Három</p>
              <p>Vízszintes vonal:<br />
              ---</p>
            </div>

            <div className="col-6">
              <Markdown source={`
Egyszerű felsorolás:

- Listaelem
- Listaelem
- Listaelem

Számozott lista:

1. Egy
2. Kettő
3. Három

Vízszintes vonal:

---
`}/>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <h4>Kiemelés</h4>
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <p>- **Félkövér** szó.<br />
              - *Dőlt* szó.<br />
              - ***Félkövér és dőlt*** szó.<br />
              - Ez egy `kódrészlet`.</p>
              <p>```<br />
              Ez<br />
              Egy<br />
              Kódblokk.<br />
              ```</p>
            </div>
            <div className="col-6">
              <Markdown source={`
- **Félkövér** szó.
- *Dőlt* szó.
- ***Félkövér és dőlt*** szó.
- Ez egy \`kódrészlet\`.

\`\`\`
Ez
Egy
Kódblokk.
\`\`\`

`}/>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <h4>Táblázat</h4>
              <p>A táblázat fejlécét az első sorban tudod megadni. A második sorban pedig balra, középre, vagy jobbra tudod igazítani az oszlopokat:</p>
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <pre>
                | balra | középre | jobbra |<br/>
                | :----- | :----: | ----: |<br/>
                | A | 1 | x |<br/>
                | B | 2 | y |<br/>
                | C | 3 | z |<br/>
              </pre>
            </div>
            <div className="col-6">
              <Markdown source={`
| balra | középre | jobbra |
| :----- | :----: | ----: |
| A | 1 | x |
| B | 2 | y |
| C | 3 | z |
`}/>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <h4>Képek használata</h4>
              <ol>
                <li>Kattints a <strong>Kép beszúrása</strong> gombra.</li>
                <li>Kattints a <strong>Fájl hozzáadása</strong> gombra.</li>
                <li>Válaszd ki a képet a számítógépen.</li>
                <li>Több képet is kiválaszthatsz, de csak egyenként.</li>
                <li>Miután megjelent a kép ikonja, kattints arra, amelyiket szeretnéd használni.</li>
              </ol>
              <p>Ekkor egy hasonló kód jelenik meg a szerkesztő mezőben:</p>
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <p><code>@[kép neve.jpeg](6336e63799 =100x)</code></p>
            </div>
            <div className="col-6">
              <img src="/assets/logo.png" alt="logó" style={{width: + '100px'}}/>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <p>A képnek úgy tudod megadni <b>szélességét</b>, hogy átírod az <strong>x előtti</strong> számot:</p>
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <p><code>@[kép neve.jpeg](6336e63799 =50x)</code></p>
            </div>
            <div className="col-6">
              <img src="/assets/logo.png" alt="logó" style={{width: 50 + 'px'}}/>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <p>A <b>magasságát</b> pedig úgy, hogy a számot az <strong>x után</strong> írod:</p>
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <p><code>@[kép neve.jpeg](6336e63799 =x75)</code></p>
            </div>
            <div className="col-6">
              <img src="/assets/logo.png" alt="logó" style={{height: 75 + 'px'}}/>
            </div>
          </div>
        </div>
        <div className="modal-footer text-center">
          <Button onAction={props.close}>Bezárás</Button>
        </div>
      </div>
    </div>
  )
}
