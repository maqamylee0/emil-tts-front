import "./Say.css";
import React, { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import axios from "axios";

function Say({ file }) {
  console.log(file);
  //  const [text, setText] = useState('');
  const [numPages, setNumPages] = useState(null);
  const [audioUrls, setAudioUrls] = useState([]);
  const [audios, setAudios] = useState({});
  // const prefacePageNumber = useRef(null);
  const [playingAudioIndex, setPlayingAudioIndex] = useState(0);
  const [playingAudio, setPlayingAudio] = useState({});
  const [prefacePageNumber, setPrefacePageNumber] = useState(null);

  // const [audioUrl, setAudioUrl] = useState(null);
  // let prefacePageNumber = null;
  const pageRefs = useRef([]);

  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.js",
    import.meta.url
  ).toString();

  const addPageRef = (el) => {
    if (el && !pageRefs.current.includes(el)) {
      pageRefs.current.push(el);
    }
  };
  const PageWrapper = React.forwardRef((props, ref) => (
    <div ref={ref}>
      <Page {...props} />
    </div>
  ));
  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = async function (e) {
        const pdf = pdfjs.getDocument(e.target.result);
        const pdfDocument = await pdf.promise;

        for (let i = 1; i <= 20; i++) {
          const page = await pdfDocument.getPage(i);
          const content = await page.getTextContent();
          const strings = content.items.map((item) => item.str);
          const pageText = strings.join(" ");

          if (
            pageText.includes("Chapter 1") ||
            pageText.includes("Chapter One")
          ) {
            setPrefacePageNumber(i);
            // prefacePageNumber.current = i;
            break;
          }
        }

        if (prefacePageNumber !== null) {
          for (let i = prefacePageNumber; i <= numPages; i++) {
            const page = await pdfDocument.getPage(i);
            const content = await page.getTextContent();
            const strings = content.items.map((item) => item.str);
            const text = strings.join(" ");

            const formData = new FormData();
            formData.append("text", text);

            const response = await axios.post(
              "http://localhost:5000/say",
              formData,
              { responseType: "blob" }
            );
            const audioUrl = URL.createObjectURL(response.data);

            setAudioUrls((prevAudioUrls) => [...prevAudioUrls, audioUrl]);
          }
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }, [file, numPages, prefacePageNumber]);

  const playAudio = (audioUrl, index) => {
  if (!audios[index]) {
    const audio = new Audio(audioUrl);
    audio.oncanplaythrough = () => {
      audio.play().then(() => {
        setPlayingAudioIndex(index);
        setPlayingAudio(audio);
        if (pageRefs.current[index]) {
          pageRefs.current[index].scrollIntoView({ behavior: "smooth" });
        }
      });

      audio.onended = () => {
        if (index + 1 < audioUrls.length) {
          playAudio(audioUrls[index + 1], index + 1);
        }
      };
    };
    setAudios((prevAudios) => ({
      ...prevAudios,
      [index]: audio,
    }));
    pageRefs.current[index].scrollIntoView({ behavior: "smooth" });
  } else {
    audios[index].play();
  }
};

  // const playAudio = (audioUrl, index) => {
  //   const audio = new Audio(audioUrl);
  //   audio.oncanplaythrough = () => {
  //     audio.play().then(() => {
  //       setPlayingAudioIndex(index);
  //       setPlayingAudio(audio);
  //       if (pageRefs.current[index]) {
  //         pageRefs.current[index].scrollIntoView({ behavior: "smooth" });
  //       }
  //     });

  //     audio.onended = () => {
  //       if (index + 1 < audioUrls.length) {
  //         playAudio(audioUrls[index + 1], index + 1);
  //       }
  //     };
  //   };
  //   setAudios((prevAudios) => ({
  //     ...prevAudios,
  //     [index]: audio,
  //   }));
  //   pageRefs.current[index].scrollIntoView({ behavior: "smooth" });
  // };
  function stopAudio(index) {
    if (playingAudio) {
      playingAudio.pause();
      // playingAudio.currentTime = 0;
      // setPlayingAudioIndex(null);
      setPlayingAudio(null); // Add this line

      setAudios((prevAudios) => {
        const newAudios = { ...prevAudios };
        delete newAudios[index];
        return newAudios;
      });
    }
  }

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  function resumeAudio(index) {
  if (audios[index]) {
    audios[index].play();
  }
}
  return (
    <>
      <div className="header">
        
        <h2>PDF Content</h2>
      </div>
      <div className="Say">
        <div className="audio-controls-container">
          {audioUrls.map((audioUrl, index) => (
            <div key={index} className="audio-controls">
              {/* <button className={index === playingAudioIndex ? 'playing' : ''} onClick={() => playAudio(audioUrl, index)}>Play Audio {index + 1}</button>
      <button onClick={() => stopAudio(index)}>Stop Audio {index + 1}</button> */}
              {index === playingAudioIndex ? (
                <>
                  <button
                    className={`audio-button index === playingAudioIndex ? 'playing' : ''}`}
                    onClick={() => playAudio(audioUrl, index)}
                  >
                    Play Audio {index + 1}
                  </button>
                  <button
                    className="audio-button"
                    onClick={() => stopAudio(index)}
                  >
                    Stop Audio {index + 1}
                  </button>
                  <button className="audio-button" onClick={() => resumeAudio(index)}>
  Resume Audio {index + 1}
</button>
                </>
              ) : (
                <button
                  className={`audio-button index === playingAudioIndex ? 'playing' : ''}`}
                  onClick={() => playAudio(audioUrl, index)}
                >
                  Play Audio {index + 1}
                </button>
              )}
            </div>
          ))}
        </div>
        {file && (
          <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
            {Array.from(
              new Array(numPages),
              (el, index) =>
                index === playingAudioIndex && (
                  <PageWrapper className="page"
                    key={`page_${index + 1}`}
                    pageNumber={index + prefacePageNumber}
                    ref={addPageRef}
                  />
                )
            )}
            {/* {Array.from(new Array(numPages), (el, index) => (
            <PageWrapper key={`page_${index + 1}`} pageNumber={playingAudioIndex + prefacePageNumber} ref={addPageRef} />
          ))} */}
          </Document>
        )}
      </div>
    </>
  );
}

export default Say;
