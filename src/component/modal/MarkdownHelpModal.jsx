import React from 'react'
import Markdown from '../general/Markdown'
import Button from '../general/Button'

export default (function MarkdownHelpModal(props) {
  return (
    <div className="modal-dialog modal-lg" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Markdown help</h5>
          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden={true} onClick={props.close}>&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <div className="row">
            <div className="col-6">
              <h3>Markdown</h3>

              <h4>Headers</h4>

              <p># h1 Heading</p>
              <p>## h2 Heading</p>
              <p>### h3 Heading</p>
              <p>#### h4 Heading</p>
              <p>##### h5 Heading</p>
              <p>###### h6 Heading</p>
            </div>
            <div className="col-6">
              <h3>Rendered</h3>

              <Markdown source={`
#### Headers

# h1 Heading
## h2 Heading
### h3 Heading
#### h4 Heading
##### h5 Heading
###### h6 Heading
`}/>
            </div>
          </div>

          <div className="row">
            <div className="col-6">
              <h4>Horizontal Rules</h4>
              <p>---</p>
              <p>***</p>
            </div>
            <div className="col-6">
              <Markdown source={`
#### Horizontal Rules

---

***
`}/>
            </div>
          </div>

          <div className="row">
            <div className="col-6">

              <h4>Emphasis</h4>

              <p>**This is bold text**</p>
              <p>__This is bold text__</p>
              <p>*This is italic text*</p>
              <p>_This is italic text_</p>
              <p>~~Strikethrough~~</p>

              <h4>Blockquotes</h4>

              <p>
                > Blockquotes can also be nested...
              </p>
            </div>
            <div className="col-6">
              <Markdown source={`
#### Emphasis

**This is bold text**

__This is bold text__

*This is italic text*

_This is italic text_

~~Strikethrough~~


#### Blockquotes


> Blockquotes can also be nested...
`}/>
            </div>
          </div>

          <div className="row">
            <div className="col-6">

              <h4>Lists</h4>

              <h5>Unordered</h5>

              <p>+ Starting a line with `+`, `-`, or `*`</p>
              <p>+ Sub-lists are made by indenting 2 spaces:</p>
              <p>&nbsp;&nbsp;- Marker character change forces new list start:</p>
              <p>&nbsp;&nbsp;&nbsp;&nbsp;* Ac tristique libero volutpat at</p>
              <p>&nbsp;&nbsp;&nbsp;&nbsp;+ Facilisis in pretium nisl aliquet</p>
              <p>&nbsp;&nbsp;&nbsp;&nbsp;- Nulla volutpat aliquam velit</p>
              <p>+ Very easy!</p>

              <h5>Ordered</h5>
              <p>1. Lorem ipsum dolor sit amet</p>
              <p>2. Consectetur adipiscing elit</p>
              <p>3. Integer molestie lorem at massa</p>


              <p>1. You can use sequential numbers...</p>
              <p>1. ...or keep all the numbers as `1.`</p>
            </div>
            <div className="col-6">
              <Markdown source={`
#### Lists

Unordered

+ Create a list by starting a line with \`+\`, \`-\`, or \`*\`
+ Sub-lists are made by indenting 2 spaces:
  - Marker character change forces new list start:
    * Ac tristique libero volutpat at
    + Facilisis in pretium nisl aliquet
    - Nulla volutpat aliquam velit
+ Very easy!

Ordered

1. Lorem ipsum dolor sit amet
2. Consectetur adipiscing elit
3. Integer molestie lorem at massa


1. You can use sequential numbers...
1. ...or keep all the numbers as \`1.\`
`}/>
            </div>
          </div>

          <div className="row">
            <div className="col-6">
              <h4>Code</h4>

              <p>Inline `code`</p>

              <p>Block code "fences"</p>

              ```
              Sample text here...
              ```
            </div>
            <div className="col-6">
              <Markdown source={`
#### Code

Inline \`code\`


Block code "fences"

\`\`\`
Sample text here...
\`\`\`
`}/>
            </div>
          </div>

          <div className="row">
            <div className="col-6">
              <h4>Tables</h4>

              <pre>
                | col 1 | col2 |<br/>
                | -----: | ---- |<br/>
                | data | 1 |<br/>
                | engine | 2 |<br/>
                | ext | 3 |<br/>
              </pre>
            </div>
            <div className="col-6">
              <Markdown source={`

#### Tables

| col 1 | col2 |
| -----: | ---- |
| data | 1 |
| engine | 2 |
| ext | 3 |
`}/>
            </div>
          </div>

          <div className="row">
            <div className="col-6">
              <h4>Links</h4>

              [link text](http://dev.nodeca.com)

              [link with title](http://nodeca.github.io/pica/demo/ "title text!")

              <h4>Images</h4>

              <pre>
![Zsebtanar](/assets/logo.png)<br/>
![Zsebtanar](/assets/logo.png "Zsebtanár logó")
            </pre>
            </div>
            <div className="col-6">
              <Markdown source={`
#### Links

[link text](http://dev.nodeca.com)

[link with title](http://nodeca.github.io/pica/demo/ "title text!")


#### Images

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