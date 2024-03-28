import React from 'react';
import './App.css';

function UploadPage({onUpload}) {
//   const [file, setFile] = useState();

 function onFileChange(event) {
    const selectedFile = event.target.files[0];
    // setFile(selectedFile);
    console.log("file", selectedFile);
    onUpload(selectedFile);
  }

  return (
    <div className="App">
      <div className='header'>
        <h2>Upload a PDF File</h2>
        <input type="file" onChange={onFileChange} accept=".pdf" />
      </div>
    </div>
  );
}

export default UploadPage;