import React from 'react'
import Markdown from '../general/Markdown'
import Button from '../general/Button'

export default (function MarkdownHelpModal (props) {
  return (
    <div className="modal-dialog modal-lg" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Markdown súgó</h5>
          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden={true} onClick={props.close}>&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <div className="row">
            <div className="col-6">
              <h3>Markdown</h3>

              <h4>Címsorok</h4>

              <p># h1 címsor</p>
              <p>## h2 címsor</p>
              <p>### h3 címsor</p>
              <p>#### h4 címsor</p>
              <p>##### h5 címsor</p>
              <p>###### h6 címsor</p>
            </div>
            <div className="col-6">
              <h3>Előnézet</h3>

              <Markdown source={`
#### Címsorok

# h1 címsor
## h2 címsor
### h3 címsor
#### h4 címsor
##### h5 címsor
###### h6 címsor
`}/>
            </div>
          </div>

          <div className="row">
            <div className="col-6">
              <h4>Vízszintes vonal</h4>
              <p>---</p>
              <p>***</p>
            </div>
            <div className="col-6">
              <Markdown source={`
#### Vízszintes vonal

---

***
`}/>
            </div>
          </div>

          <div className="row">
            <div className="col-6">

              <h4>Kiemelés</h4>

              <p>**félkövér**</p>
              <p>__félkövér__</p>
              <p>*dölt*</p>
              <p>_dölt_</p>
              <p>~~áthúzott~~</p>

              <h4>Idézetek</h4>

              <p>
                > Az idézetek egymásba ágyazhatók...
              </p>
            </div>
            <div className="col-6">
              <Markdown source={`
#### Kiemelés

**félkövér**

__félkövér__

*dölt*

_dölt_

~~áthúzott~~


#### Idézetek


> Az idézetek egymásba ágyazhatók...
`}/>
            </div>
          </div>

          <div className="row">
            <div className="col-6">

              <h4>Listák</h4>

              <h5>Felsorolás</h5>

              <p>+ A felsorolás kezdődhet `+`, `-`, vagy `*`</p>
              <p>+ allista létrehozható 2 szöközös behúzással:</p>
              <p>&nbsp;&nbsp;- Jelölő karakter váltása új listát kezd:</p>
              <p>&nbsp;&nbsp;&nbsp;&nbsp;* Ac tristique libero volutpat at</p>
              <p>&nbsp;&nbsp;&nbsp;&nbsp;+ Facilisis in pretium nisl aliquet</p>
              <p>&nbsp;&nbsp;&nbsp;&nbsp;- Nulla volutpat aliquam velit</p>
              <p>+ egyszerű, ugye?</p>

              <h5>Számozott felsorolás</h5>
              <p>1. Lorem ipsum dolor sit amet</p>
              <p>2. Consectetur adipiscing elit</p>
              <p>3. Integer molestie lorem at massa</p>

              <p>1. Lehet növekvő számokat használni...</p>
              <p>1. ...vagy végig ugyanazt `1.`</p>
            </div>
            <div className="col-6">
              <Markdown source={`
#### Listák

Felsorolás

+ A felsorolás kezdődhet \`+\`, \`-\`, vagy \`*\`
+ allista létrehozható 2 szöközös behúzással:
  - Jelölő karakter váltása új listát kezd:
    * Ac tristique libero volutpat at
    + Facilisis in pretium nisl aliquet
    - Nulla volutpat aliquam velit
+ egyszerű, ugya?

Számozott felsorolás

1. Lorem ipsum dolor sit amet
2. Consectetur adipiscing elit
3. Integer molestie lorem at massa


1. Lehet növekvő számokat használni...
1. ...vagy végig ugyanazt \`1.\`
`}/>
            </div>
          </div>

          <div className="row">
            <div className="col-6">
              <h4>Kód</h4>

              <p>`kód` soron belül</p>

              <p>Kód blokk</p>

              ```
              minta kód helye...
              ```
            </div>
            <div className="col-6">
              <Markdown source={`
#### Kód

\`kód\` soron belül


Kód blokk

\`\`\`
minta kód helye...
\`\`\`
`}/>
            </div>
          </div>

          <div className="row">
            <div className="col-6">
              <h4>Táblázat</h4>

              <pre>
                | oszlop 1| oszlop 2 |<br/>
                | -----: | ---- |<br/>
                | A | 1 |<br/>
                | B | 2 |<br/>
                | C | 3 |<br/>
              </pre>
            </div>
            <div className="col-6">
              <Markdown source={`

#### Táblázat

| oszlop 1| oszlop 2 |
| -----: | ---- |
| A | 1 |
| B | 2 |
| C | 3 |
`}/>
            </div>
          </div>

          <div className="row">
            <div className="col-6">
              <h4>Linkek</h4>

              [link szövege](http://link.cime.hu)

              [link cimkével](http://link.cime.hu/ "Cimke szövege!")

              <h4>Képek</h4>

              <pre>
![Zsebtanar](/assets/logo.png)<br/>
![Zsebtanar](/assets/logo.png "Zsebtanár logó")
              </pre>
            </div>
            <div className="col-6">
              <Markdown source={`
#### Linkek

[link szövege](http://link.cime.hu)

[link cimkével](http://link.cime.hu/ "Cimke szövege!")


#### Képek

![Zsebtanar](/assets/logo.png)
![Zsebtanar](/assets/logo.png "Zsebtanár logó")

`}/>
            </div>
          </div>
        </div>
        <div className="modal-footer text-center">
          <Button onAction={props.close}>Close</Button>
        </div>
      </div>
    </div>
  )
})
