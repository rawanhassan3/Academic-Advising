import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import DataTable from '../components/DataTable';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await API.get('/excel');
      setFiles(res.data);
    } catch (err) {
      console.error('Failed to fetch files:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFileData = async (id) => {
    setLoading(true);
    try {
      const res = await API.get(`/excel/${id}`);
      setFileData(res.data);
      setSelectedFile(id);
    } catch (err) {
      console.error('Failed to fetch file data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get unique columns from the first row of data
  const columns = fileData?.data?.length > 0 
    ? Object.keys(fileData.data[0]).map(key => ({ key, label: key }))
    : [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome Banner */}
      <div className="bg-white p-8 rounded-[24px] shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-[#1e3a5f]">
            Welcome back, <span className="text-[#c8922a]">{user?.name}</span>!
          </h1>
          <p className="text-gray-500 font-medium">
            Faculty of Computer Science • Academic Advising System
          </p>
        </div>
        <div className="flex gap-4">
            <div className="px-6 py-2 bg-[#1e3a5f]/5 border border-[#1e3a5f]/10 rounded-full">
              <span className="text-xs font-bold text-[#1e3a5f] uppercase tracking-widest">
                {user?.role}
              </span>
            </div>
        </div>
      </div>

      {!selectedFile ? (
        <>
          {/* File Selection View */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {files.length > 0 ? (
              files.map((file) => (
                <div 
                  key={file._id} 
                  onClick={() => fetchFileData(file._id)}
                  className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 hover:border-[#c8922a] transition-all cursor-pointer group"
                >
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4 group-hover:bg-[#c8922a] group-hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 2v-6m0 10v4a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-[#1e3a5f] truncate">{file.fileName}</h3>
                  <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-tighter">
                    {file.rowCount} Records • {new Date(file.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <div className="col-span-full bg-white p-12 rounded-[24px] border border-dashed border-gray-200 text-center space-y-4">
                <p className="text-gray-400 font-bold">No Excel files uploaded yet.</p>
                <Link 
                  to="/upload"
                  className="px-6 py-2 bg-[#1e3a5f] text-white rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-[#163050]"
                >
                  Go to Upload
                </Link>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
          
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setSelectedFile(null)}
              className="flex items-center gap-2 text-sm font-bold text-[#1e3a5f] hover:text-[#c8922a] transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Files
            </button>
            <h2 className="text-lg font-bold text-[#1e3a5f] truncate max-w-md">
              Reviewing: <span className="text-[#c8922a]">{fileData?.fileName}</span>
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e3a5f]"></div>
            </div>
          ) : (
            <DataTable data={fileData?.data || []} columns={columns} />
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
