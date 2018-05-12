import React from 'react'
import { Markdown } from '../general/Markdown'
import Button from '../general/Button'

export function EquationHelpModal(props) {
  return (
    <div className="modal-dialog modal-lg" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">Képletszerkesztő használata</h3>
          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden={true} onClick={props.close}>
              &times;
            </span>
          </button>
        </div>
        <div className="modal-body">
          <div className="row">
            <div className="col-12">
              <p>
                A képletszerkesztő a <strong>Katex</strong> jelölőnyelvet használja. A legfontosabb parancsokat összegyűjtöttük Neked. Ha ez nem lenne elég, részletes angol nyelvű útmutatót <a target="_blank" href="https://khan.github.io/KaTeX/function-support.html">itt találsz</a>.
              </p>
              <h4>Matematikai módok</h4>
              <Markdown source={`Ha egy **szövegen belül** szeretnéd használni a matematikai módot, akkor a képletet két darab \`\$\`-jel közé kell betenni. Ha például azt írod, hogy \`$x=2$\`, akkor az úgy fog kinézni, hogy $x=2$.`}/>
              <p>Ha pedig <strong>kiemelt módot</strong> szeretnél használni, akkor írd az egyenletet új sorba, és a képlet előtt és után a kettős <code>$$</code>-jelet használd. Például ez:</p>
              <Markdown source={`\`$$a=b+c$$\``}/>
              <p>úgy fog kinézni, hogy:</p>
              <Markdown source={`$$a=b+c$$`}/>
              <p>Egy több sorból álló <strong>egyenletrendszert</strong> az <code>aligned</code> környezetben lehet használni. Itt a sorok végére (az utolsó sort kivéve) <code>\\</code> jelet kell tenni, a <code>&amp;</code>-jellel pedig az egyenleteket tudjuk egymáshoz képest igazítani. Például ez:</p>
              <Markdown source={`
\`$$\\begin{aligned}\`  
\`a\&=b+c \\\\\`  
\`a-c\&=b \\\\\`  
\`0\&=b+c-a\`  
\`\\end{aligned}$$\`  
`}/>
              <p>úgy fog kinézni, hogy:</p>
              <Markdown source={`
$$\\begin{aligned}
a\&=b+c \\\\
a-c\&=b \\\\
0\&=b+c-a
\\end{aligned}$$
`}/>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
            <h4>Szimbólumok, jelölések</h4>
            <p><i>Ne felejtsd el, hogy minden matematikai kifejezés elé és után vagy <code>$</code> vagy <code>$$</code> jeleket kell tenni!</i></p>
            </div>
          </div>
          <div className="row">
            <div className="col-3">
            <p><strong>Műveletek</strong></p>
            </div>
            <div className="col-3">
              <Markdown source={`$2\\cdot2$  
              \`2\\cdot2\``}/>
            </div>
            <div className="col-3">
              <Markdown source={`$\\frac{1}{2}$  
              \`\\frac{1}{2}\``}/>
            </div>
            <div className="col-3">
            <Markdown source={`$\\pm$  
              \`\\pm\``}/>
            </div>
          </div>
          <div className="row">
            <div className="col-3">
            <p><strong>Indexek</strong></p>
            </div>
            <div className="col-3">
              <Markdown source={`$3^2$  
              \`3^2\``}/>
            </div>
            <div className="col-3">
              <Markdown source={`$a^{10}$  
              \`a^{10}\``}/>
            </div>
            <div className="col-3">
              <Markdown source={`$x_{1,2}$  
              \`x_{1,2}\``}/>
            </div>
          </div>
          <div className="row">
            <div className="col-3">
            <p><strong>Gyök</strong></p>
            </div>
            <div className="col-3">
              <Markdown source={`$\\sqrt{3}$  
              \`\\sqrt{3}\``}/>
            </div>
            <div className="col-3">
              <Markdown source={`$\\sqrt[4]{2}$  
              \`\\sqrt[4]{2}\``}/>
            </div>
            <div className="col-3">
            </div>
          </div>
          <div className="row">
            <div className="col-3">
            <p><strong>Szögfüggvények</strong></p>
            </div>
            <div className="col-3">
              <Markdown source={`$\\cos$ x  
              \`\\cos x\``}/>
            </div>
            <div className="col-3">
              <Markdown source={`$\\sin y$  
              \`\\sin y\``}/>
            </div>
            <div className="col-3">
              <Markdown source={`$10^\\circ$  
              \`10^\\circ\``}/>
            </div>
          </div>
          <div className="row">
            <div className="col-3">
            <p><strong>Görög betűk</strong></p>
            </div>
            <div className="col-3">
              <Markdown source={`$\\alpha$  
              \`\\alpha\``}/>
            </div>
            <div className="col-3">
              <Markdown source={`$\\beta$  
              \`\\beta\``}/>
            </div>
            <div className="col-3">
              <Markdown source={`$\\gamma$  
              \`\\gamma\``}/>
            </div>
          </div>
          <div className="row">
            <div className="col-3">
            </div>
            <div className="col-3">
              <Markdown source={`$\\pi$  
              \`\\pi\``}/>
            </div>
            <div className="col-3">
            </div>
            <div className="col-3">
            </div>
          </div>
          <div className="row">
            <div className="col-3">
              <p><strong>Relációs jelek</strong></p>
            </div>
            <div className="col-3">
              <Markdown source={`$\\approx$  
              \`\\approx\``}/>
            </div>
            <div className="col-3">
              <Markdown source={`$\\leq$  
              \`\\leq\``}/>
            </div>
            <div className="col-3">
              <Markdown source={`$\\geq$  
              \`\\geq\``}/>
            </div>
          </div>
          <div className="row">
            <div className="col-3">
            </div>
            <div className="col-3">
              <Markdown source={`$\\neq$  
              \`\\neq\``}/>
            </div>
            <div className="col-3">
            </div>
            <div className="col-3">
            </div>
          </div>
          <div className="row">
            <div className="col-3">
              <p><strong>Zárójelek</strong></p>
            </div>
            <div className="col-3">
              <Markdown source={`$(-1)$  
              \`(-1)\``}/>
            </div>
            <div className="col-3">
              <Markdown source={`$]-1;3[$  
              \`]-1;3[\``}/>
            </div>
            <div className="col-3">
              <Markdown source={`$|-3|$  
              \`|-3|\``}/>
            </div>
          </div>
          <div className="row">
            <div className="col-3">
            </div>
            <div className="col-3">
              <Markdown source={`$\\binom{n}{k}$  
              \`\\binom{n}{k}\``}/>
            </div>
            <div className="col-6">
              <Markdown source={`$\\left(\\frac{1}{2}\\right)$  
              \`\\left(\\frac{1}{2}\\right)\``}/>
            </div>
          </div>
          <div className="row">
            <div className="col-3">
              <p><strong>Nyilak</strong></p>
            </div>
            <div className="col-3">
              <Markdown source={`$\\rightarrow$  
              \`\\rightarrow\``}/>
            </div>
            <div className="col-3">
              <Markdown source={`$\\leftrightarrow$  
              \`\\leftrightarrow\``}/>
            </div>
            <div className="col-3">
              <Markdown source={`$\\mapsto$  
              \`\\mapsto\``}/>
            </div>
          </div>
          <div className="row">
            <div className="col-3">
            </div>
            <div className="col-3">
              <Markdown source={`$\\overrightarrow{AB}$  
              \`\\overrightarrow{AB}\``}/>
            </div>
            <div className="col-3">
            </div>
            <div className="col-3">
            </div>
          </div>
          <div className="row">
            <div className="col-3">
              <p><strong>Szöveg</strong></p>
            </div>
            <div className="col-3">
              <Markdown source={`$\\mathbf{n}(1;2)$  
              \`\\mathbf{n}(1;2)\``}/>
            </div>
            <div className="col-3">
              <Markdown source={`$3\\,\\text{cm}^3$  
              \`3\\,\\text{cm}^3\``}/>
            </div>
            <div className="col-3">
              <Markdown source={`$10\\,\\text{Ft}$  
              \`10\\,\\text{Ft}\``}/>
            </div>
          </div>
          <div className="row">
            <div className="col-3">
              <p><strong>Színek</strong></p>
            </div>
            <div className="col-3">
              <Markdown source={`$\\textcolor{red}{piros}$  
              \`\\textcolor{red}{piros}\``}/>
            </div>
            <div className="col-3">
              <Markdown source={`$\\textcolor{green}{zöld}$  
              \`\\textcolor{green}{zöld}\``}/>
            </div>
            <div className="col-3">
              <Markdown source={`$\\textcolor{blue}{kék}$  
              \`\\textcolor{blue}{kék}\``}/>
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
