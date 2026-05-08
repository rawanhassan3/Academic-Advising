import { useState } from 'react';
import API from '../services/api';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setMessage({ text: '', type: '' });
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage({ text: 'Please select a file first.', type: 'error' });
      return;
    }

    const formData = new FormData();
    formData.append('excelFile', file);

    setLoading(true);
    setMessage({ text: 'Processing file...', type: 'info' });

    try {
      const res = await API.post('/excel/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage({ text: `Success! ${res.data.count} records processed.`, type: 'success' });
      setFile(null);
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Upload failed.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-[#1e3a5f]">Upload Course Distribution</h1>
        <p className="text-gray-500 font-medium italic">Supports .xlsx and .xls formats</p>
      </div>

      <div className="bg-white p-10 rounded-[32px] shadow-sm border border-gray-100">
        <form onSubmit={handleUpload} className="space-y-8">
          {/* Custom Dropzone */}
          <div 
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative group h-80 rounded-[24px] border-2 border-dashed transition-all flex flex-col items-center justify-center p-6 text-center cursor-pointer ${
              dragActive 
                ? 'border-[#c8922a] bg-[#c8922a]/5 scale-[1.01]' 
                : 'border-gray-200 hover:border-[#1e3a5f] hover:bg-[#1e3a5f]/5'
            }`}
            onClick={() => document.getElementById('fileInput').click()}
          >
            <input 
              id="fileInput"
              type="file" 
              className="hidden" 
              accept=".xlsx, .xls"
              onChange={handleFileChange}
            />
            
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-all ${
              file ? 'bg-emerald-500 text-white scale-110' : 'bg-gray-100 text-gray-400 group-hover:text-[#1e3a5f]'
            }`}>
              {file ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              )}
            </div>

            {file ? (
              <div className="space-y-2 animate-in fade-in zoom-in">
                <p className="text-lg font-bold text-[#1e3a5f] truncate max-w-sm">{file.name}</p>
                <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest">File Selected</p>
                <button 
                  type="button" 
                  onClick={(e) => { e.stopPropagation(); setFile(null); }}
                  className="text-xs font-bold text-red-500 hover:underline"
                >
                  Remove file
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-lg font-bold text-[#1e3a5f]">Drag and drop your Excel file here</p>
                <p className="text-sm text-gray-400 font-medium">or click to browse your computer</p>
              </div>
            )}
          </div>

          {/* Status Message */}
          {message.text && (
            <div className={`p-4 rounded-2xl text-sm font-bold flex items-center gap-3 animate-in fade-in zoom-in ${
              message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
              message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' :
              'bg-blue-50 text-blue-600 border border-blue-100'
            }`}>
              {message.type === 'success' && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
              {message.text}
            </div>
          )}

          {/* Upload Button */}
          <button 
            type="submit" 
            disabled={!file || loading}
            className="w-full py-5 bg-[#1e3a5f] text-white rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-[#163050] active:scale-[0.99] transition-all shadow-xl shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {loading && (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {loading ? 'Processing...' : 'Upload & Process Records'}
          </button>
        </form>
      </div>

      {/* Guide Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[24px] shadow-sm border border-gray-100 space-y-4">
          <h3 className="text-lg font-bold text-[#1e3a5f] flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#c8922a]" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Supported Columns
          </h3>
          <ul className="space-y-2 text-sm text-gray-500 font-medium">
            <li className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-[#c8922a]"></div>
               Student ID / Name
            </li>
            <li className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-[#c8922a]"></div>
               Course Code / Title
            </li>
            <li className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-[#c8922a]"></div>
               Credit Hours
            </li>
          </ul>
        </div>
        <div className="bg-amber-50 p-8 rounded-[24px] border border-amber-100 space-y-4">
          <h3 className="text-lg font-bold text-amber-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Important Note
          </h3>
          <p className="text-sm text-amber-700 font-medium leading-relaxed">
            Please ensure that the Excel file is not password protected and contains the standard university distribution template.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Upload;
