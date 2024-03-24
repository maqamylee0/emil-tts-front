import './App.css';
import {React, useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import axios from 'axios';

function App() {
   const [text, setText] = useState('');
   const [file, setFile] = useState();
  const [numPages, setNumPages] = useState(null);

  const [audioUrl, setAudioUrl] = useState(null);
let prefacePageNumber = null;


  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = async function(e) {
        const pdf = pdfjs.getDocument(e.target.result);
        const pdfDocument = await pdf.promise;

for (let i = 1; i <= 20; i++) {
  const page = await pdfDocument.getPage(i);
  const content = await page.getTextContent();
  const strings = content.items.map(item => item.str);
  const pageText = strings.join(' ');

  if (pageText.includes('Chapter 1')) {
    prefacePageNumber = i;
    break;
  }
}
if (prefacePageNumber !== null) {


        const page = await pdfDocument.getPage(prefacePageNumber); // get first page
        const content = await page.getTextContent();
        const strings = content.items.map(item => item.str);
        setText(strings.join(' '));
      };
    };
      reader.readAsArrayBuffer(file);
    }
  }, [file]);

  useEffect(() => {
    if (text) {
        const formData = new FormData();
    formData.append('text', text);
      axios.post('http://localhost:5000/say', formData, {responseType: 'blob'})
        .then(response => {
                  const audioUrl = URL.createObjectURL(response.data);

          // const audioUrl = response.data.audioUrl;
                    setAudioUrl(audioUrl);

        //           const audio = new Audio(audioUrl);
        // audio.play();

          // do something with audioUrl
        });
    }
  }, [text]);

 const playAudio = () => {
    const audio = new Audio(audioUrl);
    audio.play();
  };


   function onFileChange(event) {
    setFile(event.target.files[0]);
  }

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  return (
    <>
    <div className="App">
    <div>
      <h2>Upload a PDF File</h2>
      <input type="file" onChange={onFileChange} accept=".pdf" />

      <h2>PDF Content:</h2>
            {audioUrl && <button onClick={playAudio}>Play Audio</button>}

      {file && (
        <Document 
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          {Array.from(new Array(numPages), (el, index) => (
            <Page key={`page_${index + 1}`} pageNumber={index + 1} />
          ))}
        </Document>
      )}
        </div>

    </div>
    </>
    
  );
}

export default App;
