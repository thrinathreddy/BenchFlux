import React, { useState } from 'react';
import axios from 'axios';

export default function UploadForm() {
  const [file, setFile] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post('/api/upload', formData);
      alert("File uploaded successfully");
    } catch (err) {
      alert("Upload failed: " + err.message);
    }
  };

  return (
    <form onSubmit={handleUpload} encType="multipart/form-data">
      <input type="file" onChange={(e) => setFile(e.target.files[0])} required />
      <button type="submit">Upload</button>
    </form>
  );
}
