import './App.css';
import {React,useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

function App() {
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

   const [file, setFile] = useState();
  const [numPages, setNumPages] = useState(null);
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
