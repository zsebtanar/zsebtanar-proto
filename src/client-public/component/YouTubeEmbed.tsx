import * as React from 'react'
import axios from 'axios'

interface State {
  url: string
}

const CHANNEL_ID = 'UC8aqu8qcioAPG_BTMskAcmA'
const YT_FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`
const RRS_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(YT_FEED_URL)}`

export class YouTubeEmbed extends React.Component<{}, State> {
  state = {
    url: ''
  }
  componentDidMount(): void {
    axios.get(RRS_URL).then(response => {
      const baseURL = response.data.items[0].link
      const id = baseURL.substr(baseURL.indexOf('=') + 1)
      const url = `https://youtube.com/embed/${id}?controls=1&autoplay=0&hl=hu&iv_load_policy=3&rel=0`
      this.setState({ url })
    })
  }

  render() {
    return <iframe width="600" height="340" frameBorder="0" allowFullScreen src={this.state.url} />
  }
}
