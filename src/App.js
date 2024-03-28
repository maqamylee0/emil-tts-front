import { BrowserRouter as Router, Route,useNavigate, useLocation, Routes } from 'react-router-dom';
import Upload from './Upload';
import Say from './Say';

function Content() {
    const navigate = useNavigate();

  const location = useLocation();
  const file = location.state?.file;
  console.log("file content", file);

  return (
    <Routes>
    
      <Route path="/say" element={<Say file={file} />} />
        <Route path="/upload" element={<Upload onUpload={(file) => navigate('/say', {state: { file }
      })} />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <Content />
    </Router>
  );
}

export default App;