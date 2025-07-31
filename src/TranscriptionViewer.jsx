// TranscriptionViewer.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function TranscriptionViewer({ filename }) {
  const [transcription, setTranscription] = useState('');

  useEffect(() => {
    if (!filename) return;

    const fetchTranscription = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/transcription/${filename}`);
        setTranscription(response.data.transcription);
      } catch (error) {
        console.error('Error fetching transcription:', error);
      }
    };

    fetchTranscription();
  }, [filename]);

  return (
  <div className="flex justify-center mt-10">
    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-xl text-center">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">📝 Transcription</h2>
      <p className="text-gray-700 text-base">
        {transcription || 'Loading transcription...'}
      </p>
    </div>
  </div>
);
}