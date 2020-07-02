import React from 'react'
import { render } from '@testing-library/react'
import { Markdown } from './MarkdownBase'

test('Markdown should render', async () => {
  const source = `
  # h1
  ## h2
  ### h3
  #### h4
  
  - list 1
  - list 1
  
  -> center text <-
  
  @[image alt](https://example.com)
  ~[wiki link](fedcba987654321)
  
  $x^2=y$
  `
  const { asFragment } = render(<Markdown source={source} />)

  expect(asFragment()).toMatchInlineSnapshot(`
    <DocumentFragment>
      <div
        class="markdown "
      >
        <h1>
          h1
        </h1>
        

        <h2>
          h2
        </h2>
        

        <h3>
          h3
        </h3>
        

        <h4>
          h4
        </h4>
        

        <ul>
          

          <li>
            list 1
          </li>
          

          <li>
            list 1
          </li>
          

        </ul>
        

        <p />
        <div
          class="text-align-center"
        >
           center text 
        </div>
        <p />
        

        <p>
          <img
            alt="image alt"
            height="undefined"
            src="https://example.com"
            title="image alt"
            width="undefined"
          />
          

          <a
            class="wiki-link"
            href="#fedcba987654321"
            title="wiki link"
          >
            wiki link
          </a>
        </p>
        

        <p>
          <span
            class="katex"
          >
            <span
              class="katex-mathml"
            >
              <math>
                <semantics>
                  <mrow>
                    <msup>
                      <mi>
                        x
                      </mi>
                      <mn>
                        2
                      </mn>
                    </msup>
                    <mo>
                      =
                    </mo>
                    <mi>
                      y
                    </mi>
                  </mrow>
                  <annotation
                    encoding="application/x-tex"
                  >
                    x^2=y
                  </annotation>
                </semantics>
              </math>
            </span>
            <span
              aria-hidden="true"
              class="katex-html"
            >
              <span
                class="strut"
                style="height:0.8141079999999999em;"
              />
              <span
                class="strut bottom"
                style="height:1.008548em;vertical-align:-0.19444em;"
              />
              <span
                class="base"
              >
                <span
                  class="mord"
                >
                  <span
                    class="mord mathit"
                  >
                    x
                  </span>
                  <span
                    class="msupsub"
                  >
                    <span
                      class="vlist-t"
                    >
                      <span
                        class="vlist-r"
                      >
                        <span
                          class="vlist"
                          style="height:0.8141079999999999em;"
                        >
                          <span
                            style="top:-3.063em;margin-right:0.05em;"
                          >
                            <span
                              class="pstrut"
                              style="height:2.7em;"
                            />
                            <span
                              class="sizing reset-size6 size3 mtight"
                            >
                              <span
                                class="mord mtight"
                              >
                                2
                              </span>
                            </span>
                          </span>
                        </span>
                      </span>
                    </span>
                  </span>
                </span>
                <span
                  class="mord rule"
                  style="margin-right:0.2777777777777778em;"
                />
                <span
                  class="mrel"
                >
                  =
                </span>
                <span
                  class="mord rule"
                  style="margin-right:0.2777777777777778em;"
                />
                <span
                  class="mord mathit"
                  style="margin-right:0.03588em;"
                >
                  y
                </span>
              </span>
            </span>
          </span>
        </p>
        

      </div>
    </DocumentFragment>
  `)
})
