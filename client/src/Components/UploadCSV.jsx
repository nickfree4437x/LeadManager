import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FiUpload, FiHome, FiUsers, FiUserPlus, FiFileText, FiPhone, FiUser, FiArrowLeft, FiX, FiCheck } from "react-icons/fi";
import { FaFileCsv, FaFileExcel } from "react-icons/fa";
import Papa from 'papaparse';

function UploadCSV() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [distributedData, setDistributedData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewData, setPreviewData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [duplicates, setDuplicates] = useState([]);
  const [fieldMap, setFieldMap] = useState({});
  const [showPreview, setShowPreview] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const allowedTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (selectedFile && allowedTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
      setMessage({ text: "", type: "" });
      parseFileForPreview(selectedFile);
    } else {
      setFile(null);
      setMessage({ 
        text: "Only CSV, XLS, or XLSX files are allowed", 
        type: "error" 
      });
    }
  };

  const parseFileForPreview = (file) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const csvData = e.target.result;
    const results = Papa.parse(csvData, { header: true });
    setPreviewData(results.data.slice(0, 10));
    setHeaders(results.meta.fields || []);
    checkDuplicates(results.data);
  };
  reader.readAsText(file);
};

  const checkDuplicates = async (data) => {
    if (!data || data.length === 0) return;
    
    try {
      const phones = data.map(item => item.Phone).filter(Boolean);
      if (phones.length === 0) return;
      
      const res = await axios.post("http://localhost:5000/api/upload/check-duplicates", { phones });
      setDuplicates(res.data.duplicates || []);
    } catch (err) {
      console.error("Duplicate check failed:", err);
    }
  };

  const fetchDistributedData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/distributed");
      setDistributedData(res.data);
    } catch (err) {
      console.error("Failed to fetch distributed data:", err);
      setMessage({ 
        text: "Failed to load distribution data", 
        type: "error" 
      });
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      return setMessage({ 
        text: "Please select a valid file", 
        type: "error" 
      });
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fieldMap", JSON.stringify(fieldMap));
    setIsLoading(true);
    setProgress(0);
    setMessage({ text: "", type: "" });

    try {
      const res = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        },
      });

      setMessage({ 
        text: res.data.message || "File uploaded and distributed successfully", 
        type: "success" 
      });
      setFile(null);
      setPreviewData([]);
      setHeaders([]);
      setDuplicates([]);
      await fetchDistributedData();
    } catch (err) {
      console.error(err);
      setMessage({ 
        text: err.response?.data?.error || "Upload failed", 
        type: "error" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDistributedData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg hidden md:block">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-indigo-600">LeadManager</h1>
          <p className="text-sm text-gray-500">Admin Dashboard</p>
        </div>
        <nav className="p-4">
          <Link to="/dashboard" className="flex no-underline items-center p-3 text-gray-600 hover:bg-gray-100 rounded-lg mb-2">
            <FiHome className="mr-3" />
            <span>Dashboard</span>
          </Link>
          <Link to="/add-agent" className="flex no-underline items-center p-3 text-gray-600 hover:bg-gray-100 rounded-lg mb-2">
            <FiUserPlus className="mr-3" />
            <span>Add Agent</span>
          </Link>
          <Link to="/view-agents" className="flex no-underline items-center p-3 text-gray-600 hover:bg-gray-100 rounded-lg mb-2">
            <FiUsers className="mr-3" />
            <span>View Agents</span>
          </Link>
          <Link to="/upload" className="flex no-underline items-center p-3 text-indigo-600 bg-indigo-50 rounded-lg">
            <FiUpload className="mr-3" />
            <span>Upload Leads</span>
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="md:ml-64">
        {/* Top Bar */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-800">Upload Leads</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Admin Panel</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            {/* Back Button - Mobile */}
            <Link
              to="/dashboard"
              className="md:hidden flex items-center text-indigo-600 hover:text-indigo-800 mb-6 transition-colors"
            >
              <FiArrowLeft className="mr-2" />
              <span>Back to Dashboard</span>
            </Link>

            {/* Upload Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
              {/* Header */}
              <div className="bg-indigo-600 px-6 py-4">
                <div className="flex items-center justify-center">
                  <FiUpload className="text-white text-2xl mr-3" />
                  <h2 className="text-xl font-semibold text-white">Upload Contact List</h2>
                </div>
              </div>

              {/* Messages */}
              <div className="px-6 pt-4">
                {message.text && (
                  <div className={`${message.type === "success" ? "bg-green-50 border-l-4 border-green-500" : "bg-red-50 border-l-4 border-red-500"} p-4 mb-4`}>
                    <div className="flex">
                      <div className="flex-shrink-0">
                        {message.type === "success" ? (
                          <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="ml-3">
                        <p className={`text-sm ${message.type === "success" ? "text-green-700" : "text-red-700"}`}>
                          {message.text}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Form */}
              <form onSubmit={handleUpload} className="px-6 py-4 space-y-5">
                <div className="relative">
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FiUpload className="w-8 h-8 mb-3 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          CSV, XLS, or XLSX files only
                        </p>
                      </div>
                      <input 
                        type="file" 
                        accept=".csv,.xlsx,.xls" 
                        className="hidden" 
                        onChange={handleFileChange} 
                      />
                    </label>
                  </div>
                  {file && (
                    <div className="mt-2 flex items-center text-sm text-gray-600">
                      <span className="mr-2">
                        {file.type.includes("csv") ? (
                          <FaFileCsv className="text-green-600" />
                        ) : (
                          <FaFileExcel className="text-green-600" />
                        )}
                      </span>
                      {file.name}
                      <button 
                        type="button" 
                        onClick={() => {
                          setFile(null);
                          setPreviewData([]);
                          setHeaders([]);
                        }}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <FiX />
                      </button>
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                {isLoading && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-indigo-600 h-2.5 rounded-full" 
                      style={{ width: `${progress}%` }}
                    ></div>
                    <div className="text-right text-xs text-gray-500 mt-1">
                      {progress}% uploaded
                    </div>
                  </div>
                )}

                {/* Column Mapping */}
                {headers.length > 0 && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium mb-3">Map CSV Columns</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {headers.map((header) => (
                        <div key={header} className="flex items-center">
                          <label className="w-1/3 text-sm text-gray-600">{header}</label>
                          <select
                            className="w-2/3 border border-gray-300 rounded px-2 py-1 text-sm"
                            value={fieldMap[header] || ""}
                            onChange={(e) => setFieldMap({...fieldMap, [header]: e.target.value})}
                          >
                            <option value="">Ignore column</option>
                            <option value="FirstName">First Name</option>
                            <option value="LastName">Last Name</option>
                            <option value="Phone">Phone</option>
                            <option value="Email">Email</option>
                            <option value="Address">Address</option>
                            <option value="Notes">Notes</option>
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Data Preview & Duplicates */}
                {previewData.length > 0 && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium">Data Preview (first {previewData.length} rows)</h3>
                      <button
                        type="button"
                        onClick={() => setShowPreview(!showPreview)}
                        className="text-indigo-600 text-sm"
                      >
                        {showPreview ? 'Hide Preview' : 'Show Preview'}
                      </button>
                    </div>

                    {showPreview && (
                      <div className="overflow-x-auto max-h-64 overflow-y-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              {headers.map((header) => (
                                <th key={header} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  {header}
                                </th>
                              ))}
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {previewData.map((row, i) => (
                              <tr key={i} className={duplicates.includes(row.Phone) ? "bg-red-50" : ""}>
                                {headers.map((header) => (
                                  <td key={header} className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                    {row[header]}
                                  </td>
                                ))}
                                <td className="px-3 py-2 whitespace-nowrap">
                                  {duplicates.includes(row.Phone) ? (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                      <FiX className="mr-1" /> Duplicate
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                      <FiCheck className="mr-1" /> New
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {duplicates.length > 0 && (
                      <div className="mt-3 text-sm text-red-600">
                        <FiX className="inline mr-1" />
                        {duplicates.length} duplicate phone numbers found
                      </div>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || !file}
                  className={`w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition duration-200 ${(!file || isLoading) ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </span>
                  ) : (
                    <>
                      <FiUpload className="inline mr-2" />
                      Upload and Distribute
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Distributed Data Section */}
            {distributedData.length > 0 && (
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-indigo-600 px-6 py-4">
                  <div className="flex items-center justify-center">
                    <FiUsers className="text-white text-2xl mr-3" />
                    <h2 className="text-xl font-semibold text-white">Distributed Leads</h2>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {distributedData.map((dist, i) => (
                      <div key={i} className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:shadow-md transition-shadow">
                        <div className="flex items-center mb-3">
                          <FiUser className="text-indigo-600 mr-2" />
                          <h3 className="text-lg font-semibold text-gray-800">
                            {dist.agentId?.name || "Unassigned Leads"}
                          </h3>
                        </div>

                        {dist.data.length === 0 ? (
                          <div className="text-center py-4">
                            <p className="text-sm text-gray-500">No leads assigned</p>
                          </div>
                        ) : (
                          <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                            {dist.data.slice(0, 5).map((entry, idx) => (
                              <div key={idx} className="text-sm border-b border-gray-200 pb-3 last:border-0 last:pb-0">
                                <div className="flex items-start mb-1">
                                  <FiUser className="text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                                  <span className="font-medium">{entry.FirstName || "No Name"}</span>
                                </div>
                                <div className="flex items-start">
                                  <FiPhone className="text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                                  <span>{entry.Phone || "No Phone"}</span>
                                </div>
                                {entry.Notes && (
                                  <div className="flex items-start">
                                    <FiFileText className="text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                                    <span className="truncate">{entry.Notes}</span>
                                  </div>
                                )}
                              </div>
                            ))}
                            {dist.data.length > 5 && (
                              <div className="text-center text-sm text-indigo-600 mt-2">
                                + {dist.data.length - 5} more leads
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default UploadCSV;