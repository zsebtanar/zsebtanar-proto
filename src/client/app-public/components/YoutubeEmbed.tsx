import React, { useState, useEffect } from 'react'
import 'lite-youtube-embed'

import './YoutubeEmbed.scss'

const CHANNEL_ID = 'UC8aqu8qcioAPG_BTMskAcmA'
const YT_FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`
const RRS_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(YT_FEED_URL)}`

export function YouTubeEmbed(): null | JSX.Element {
  const [id, setId] = useState<string>()

  useEffect(() => {
    fetch(RRS_URL)
      .then((res) => res.json())
      .then((response) => {
        if (response.items?.length > 0) {
          const baseURL = response.items[0].link
          const id = baseURL.substr(baseURL.indexOf('=') + 1)
          setId(id)
        } else {
          throw new Error('missing link')
        }
      })
      .catch(() => setId('error'))
  }, [])

  if (!id || id === 'error') return null

  return <lite-youtube videoid={id} />
}
