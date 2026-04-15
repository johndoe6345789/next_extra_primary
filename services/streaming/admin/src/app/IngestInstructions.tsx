'use client'

/**
 * IngestInstructions — copy/paste cheat
 * sheet explaining how to push RTSP to
 * mediamtx from ffmpeg or OBS.  The tool
 * ships this next to the live list so
 * operators never need to leave the page.
 */

export function IngestInstructions() {
  const ff =
    'ffmpeg -re -i input.mp4 -c copy ' +
    '-f rtsp rtsp://localhost:8554/' +
    '<INGEST_KEY>'
  return (
    <section
      className="stream-card"
      aria-label="Ingest instructions"
      data-testid="ingest-info"
    >
      <header>
        <strong>How to publish</strong>
      </header>
      <p>
        Create a stream via the API, then
        push to the RTSP endpoint below
        substituting your ingest key.
      </p>
      <code>{ff}</code>
      <p>
        WebRTC playback is available at
        <code>
          http://localhost:8890/
          &lt;INGEST_KEY&gt;
        </code>
        and HLS at
        <code>
          http://localhost:8888/
          &lt;INGEST_KEY&gt;/index.m3u8
        </code>
      </p>
    </section>
  )
}
