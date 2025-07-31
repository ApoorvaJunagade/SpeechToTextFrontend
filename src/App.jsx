
import { useState } from 'react'
import AudioRecorder from './AudioRecorder';

import './App.css'
import TranscriptionViewer from './TranscriptionViewer';

function App() {
const [uploadedFileName, setUploadedFileName] = useState(null);
  return (
    <>
      <h1 className="text-center text-3xl font-bold my-6">Speech To Text Conversion</h1>
      <AudioRecorder onUploadComplete={(filename) => setUploadedFileName(filename)} />
      {uploadedFileName && <TranscriptionViewer filename={uploadedFileName} />}
    </>
  )
}

export default App
