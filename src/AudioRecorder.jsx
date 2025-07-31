import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import "tailwindcss";
const AudioRecorder = ({ onUploadComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUploadStatus, setAudioUploadStatus] = useState('');
  const [audioUploaded, setAudioUploaded] = useState(false);

  const [desktopFile, setDesktopFile] = useState(null);
  const [desktopUploadStatus, setDesktopUploadStatus] = useState('');
  const [desktopUploaded, setDesktopUploaded] = useState(false);

  const [previewUrl, setPreviewUrl] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  
  // 🎙️ Start recording
  const handleStartRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    audioChunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = (e) => {
      if (e.data.size > 0) {
        audioChunksRef.current.push(e.data);
      }
    };

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      setAudioBlob(blob);
      setAudioUploadStatus('');
      setAudioUploaded(false);
      setPreviewUrl(URL.createObjectURL(blob));
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  // 🛑 Stop recording
  const handleStopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
   
  };


  // Include this function wherever you handle recording/upload logic

  
  // ⬆️ Upload recorded audio
  const handleUploadRecordedAudio = async () => {
    if (!audioBlob) {
      alert('No recording available!');
      return;
    }

    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm');

    try {
      setAudioUploadStatus('Uploading...');
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setAudioUploadStatus('✅ Upload successful!');
      setAudioUploaded(true);
      console.log(res.data);

       if (res.data?.filename) {
      onUploadComplete(res.data.filename.filename);
    }
    } catch (err) {
      setAudioUploadStatus('❌ Upload failed');
      console.error(err);
    }
  };

  // 📂 Handle desktop file selection
  const handleDesktopFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDesktopFile(file);
      setDesktopUploaded(false);
      setDesktopUploadStatus('');
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // ⬆️ Upload file from desktop
  const handleDesktopUpload = async () => {
    if (!desktopFile) {
      alert('No desktop file selected!');
      return;
    }

    const formData = new FormData();
    formData.append('file', desktopFile);

    try {
      setDesktopUploadStatus('Uploading desktop file...');
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setDesktopUploadStatus('✅ Desktop upload successful!');
      setDesktopUploaded(true);
      console.log(res.data);
      
      if (res.data?.transcription) {
      onUploadComplete(res.data.filename.filename);
    }
    } catch (err) {
      setDesktopUploadStatus('❌ Desktop upload failed');
      console.error(err);
    }
  };

 return (
  <div className="p-6 max-w-6xl mx-auto">
    {/* Side-by-side layout using Flex */}
    <div className="flex flex-col md:flex-row gap-10">
      {/* 🎙 Record Audio Section */}
      <div className="flex-1 border p-4 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">🎙 Record Audio</h3>

        {!isRecording ? (
          <button
            onClick={handleStartRecording}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Start Recording
          </button>
        ) : (
          <button
            onClick={handleStopRecording}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Stop Recording
          </button>
        )}

        {isRecording && <p className="text-red-600 mt-2">🔴 Recording...</p>}

        {audioBlob && (
          <div className="mt-4">
            <h4 className="text-lg font-medium mb-2">Recorded Audio Preview:</h4>
            <audio controls src={previewUrl} className="w-full mb-3"></audio>
            <button
              onClick={handleUploadRecordedAudio}
              disabled={audioUploaded}
              className={`px-4 py-2 rounded text-white ${
                audioUploaded
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {audioUploaded ? 'Uploaded' : 'Upload Recording'}
            </button>
            <p className="mt-2 text-sm text-gray-700">{audioUploadStatus}</p>
          </div>
        )}
      </div>

      {/* 📂 Upload Audio from Desktop */}
            <div className="flex-1 border p-4 rounded-lg shadow">

        <h3 className="text-xl font-semibold mb-4">📂 Upload Audio from Desktop</h3>
        <input
          type="file"
          accept="audio/*"
          onChange={handleDesktopFileChange}
          className="mb-4 block"
        />
 

{desktopFile && (
          <div className="mt-4">
            <h4 className="text-lg font-medium mb-2">Audio Preview:</h4>
            <audio controls src={previewUrl} className="w-full"></audio>
            <br />
            <button
          onClick={handleDesktopUpload}
          disabled={desktopUploaded || !desktopFile}
          className={`px-4 py-2 rounded text-white ${
            desktopUploaded
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {desktopUploaded ? 'Uploaded' : 'Upload Desktop File'}
        </button>
          </div>
        )}

        
        <p className="mt-2 text-sm text-gray-700">{desktopUploadStatus}</p>

        
      </div>
    </div>
  </div>
);

}
export default AudioRecorder;
