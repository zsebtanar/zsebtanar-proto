import * as React from 'react'
import { identity } from 'ramda'

export class Recaptcha extends React.Component {
  private execute() {
    if (typeof  grecaptcha !== 'undefined') {
      grecaptcha.execute()
    }
  }

  render() {
    return (<div>
        <div
          id="recaptcha"
          className="g-recaptcha"
          data-sitekey="your_site_key"
          data-callback="onSubmit"
          data-size="invisible"
        />
        <RecaptchaContext.Provider value={this.execute}>
          {this.props.children}
        </RecaptchaContext.Provider>
      </div>
    )
  }
}

export const RecaptchaContext = React.createContext(identity as () => void)