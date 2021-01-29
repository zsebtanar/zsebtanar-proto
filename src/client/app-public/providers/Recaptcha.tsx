import React, { ReactNode } from 'react'
import { identity } from 'client/generic/utils/fn'

interface Props {
  children: ReactNode
}

const executeGRecaptcha = () => {
  window['grecaptcha']?.execute()
}

export const RecaptchaContext = React.createContext(identity as () => void)

export function Recaptcha({ children }: Props): JSX.Element {
  return (
    <>
      <div
        id="recaptcha"
        className="g-recaptcha"
        hidden
        data-sitekey="your_site_key"
        data-callback="onSubmit"
        data-size="invisible"
      />
      <RecaptchaContext.Provider value={executeGRecaptcha}>{children}</RecaptchaContext.Provider>
    </>
  )
}
