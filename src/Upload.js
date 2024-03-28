import React from 'react';
import './Upload.css';

function UploadPage({onUpload}) {
//   const [file, setFile] = useState();

 function onFileChange(event) {
    const selectedFile = event.target.files[0];
    // setFile(selectedFile);
    console.log("file", selectedFile);
    onUpload(selectedFile);
  }

  return (
    <>
     <div className='header'>
        <h2>Upload a PDF File</h2>
        </div>
         <div className="Upload">
          {/* <div className='uploadImg'> */}
                 <img src="audio.jpg" alt="Headsets on a books" />
                         <input type="file" onChange={onFileChange} accept=".pdf" />

           {/* <h4>Listen, Think, Understand</h4> */}
          {/* </div> */}
        {/* <div className='fileUpload'> */}
      {/* </div> */}
    </div>
    </>
   
  );
}

export default UploadPage;