import React from 'react'

export default () => {

  return (<div className="text-center" style={{padding: 60 + 'px'}}>
      <p><i>Tetszik az oldal? Támogasd munkánkat, hogy még jobb legyen!</i></p>
      <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
        <input type="hidden" name="cmd" value="_s-xclick" />
        <input type="hidden" name="hosted_button_id" value="Y389SASDEHF9A" />
        <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!" />
        <img alt="" border="0" src="https://www.paypalobjects.com/hu_HU/i/scr/pixel.gif" width="1" height="1" />
      </form>
    </div>)
}
