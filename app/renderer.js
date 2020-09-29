import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import { clipboard, ipcRenderer } from 'electron';

const Application = () => {

  const [clippings, setClippings] = useState([])

  const addClipping = () => {
    const content = clipboard.readText();
    const id = Date.now();
    const newClipping = {id, content}
    setClippings([newClipping, ...clippings])
  }

  const writeToClipboard = (content) => {
    clipboard.writeText(content);
  }

  const handleWriteToClipboard = () => {
    const clipping = clippings[0];
    console.log(clipping)
    if(clipping) writeToClipboard(clipping.content)
  }

  const Clipping = ({ content }) => { 
    return(
      <article className="clippings-list-item">
        <div className="clipping-text" disabled>
          {content}
        </div> 
        <div className="clipping-controls">
          <button onClick={() => writeToClipboard(content)}>&rarr; Clipboard</button>
          <button>Update</button>
        </div>
      </article>
    )
  }

  useEffect(() => {
    ipcRenderer.on('create-new-clipping', addClipping)
    ipcRenderer.on('write-to-clipboard', handleWriteToClipboard)
  })

  return(
    <div className="container">
      <header className="controls">
        <button id="copy-from-clipboard" onClick={addClipping}>Copy from Clipboard</button>
      </header>

      <section className="content">
        <div className="clippings-list">
          {
            clippings.map(clipping => {
              return(
                <Clipping content={clipping.content} key={clipping.id}/>
              )
            })
          }
        </div>
      </section>
    </div>
  )
}

render(<Application />, document.getElementById('application'))