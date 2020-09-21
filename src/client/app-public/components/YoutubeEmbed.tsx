import React, { useState, useEffect } from 'react'

const CHANNEL_ID = 'UC8aqu8qcioAPG_BTMskAcmA'
const YT_FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`
const RRS_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(YT_FEED_URL)}`

export function YouTubeEmbed(): null | JSX.Element {
  const [url, setUrl] = useState<string>()

  useEffect(() => {
    fetch(RRS_URL)
      .then((res) => res.json())
      .then((response) => {
        if (response.items?.length > 0) {
          const baseURL = response.items[0].link
          const id = baseURL.substr(baseURL.indexOf('=') + 1)
          const videoUrl = `https://youtube.com/embed/${id}?controls=1&autoplay=0&hl=hu&iv_load_policy=3&rel=0`
          setUrl(videoUrl)
        } else {
          throw new Error('missing link')
        }
      })
      .catch(() => setUrl('error'))
  }, [])

  if (url === 'error') return null

  return (
    <iframe
      title="Legfrisebb videó"
      width="600"
      height="340"
      frameBorder="0"
      allowFullScreen
      src={url}
    />
  )
}
