import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FiUser, FiMail, FiPhone, FiArrowLeft, FiHome, FiUsers, FiUserPlus, FiUpload, FiSave } from "react-icons/fi";
import { FaUserTie } from "react-icons/fa";

function EditAgent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [agent, setAgent] = useState({ name: "", email: "", mobile: "" });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const response = await axios.get(`https://leadmanager-fvgq.onrender.com/api/agents/${id}`);
        setAgent(response.data);
      } catch (error) {
        console.error("Error fetching agent:", error);
        setMessage({ text: "Failed to fetch agent", type: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchAgent();
  }, [id]);

  const handleChange = (e) => {
    setAgent({ ...agent, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: "", type: "" });
    
    try {
      await axios.put(`https://leadmanager-fvgq.onrender.com/api/agents/${id}`, agent);
      setMessage({ text: "Agent updated successfully!", type: "success" });
      setTimeout(() => navigate("/view-agents"), 1500);
    } catch (error) {
      console.error("Update failed:", error);
      setMessage({ 
        text: error.response?.data?.message || "Failed to update agent", 
        type: "error" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading agent data...</p>
        </div>
      </div>
    );
  }

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
          <Link to="/view-agents" className="flex no-underline items-center p-3 text-indigo-600 bg-indigo-50 rounded-lg mb-2">
            <FiUsers className="mr-3" />
            <span>View Agents</span>
          </Link>
          <Link to="/upload" className="flex items-center no-underline p-3 text-gray-600 hover:bg-gray-100 rounded-lg">
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
            <h1 className="text-xl font-semibold text-gray-800">Edit Agent</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Admin Panel</span>
            </div>
          </div>
        </header>

        {/* Form Content */}
        <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            {/* Back Button - Mobile */}
            <Link
              to="/view-agents"
              className="md:hidden flex items-center text-indigo-600 hover:text-indigo-800 mb-6 transition-colors"
            >
              <FiArrowLeft className="mr-2" />
              <span>Back to Agents</span>
            </Link>

            {/* Form Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Header */}
              <div className="bg-indigo-600 px-6 py-4">
                <div className="flex items-center justify-center">
                  <FaUserTie className="text-white text-2xl mr-3" />
                  <h2 className="text-xl font-semibold text-white">Edit Agent</h2>
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
              <form onSubmit={handleSubmit} className="px-6 py-4 space-y-5">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Agent Name"
                    value={agent.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Agent Email"
                    value={agent.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiPhone className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="mobile"
                    placeholder="Mobile (+91...)"
                    value={agent.mobile}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition duration-200 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </span>
                  ) : (
                    <>
                      <FiSave className="inline mr-2" />
                      Update Agent
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default EditAgent;