import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiUser, FiMail, FiPhone, FiClock, FiEdit2, FiTrash2, FiPlus, FiArrowLeft, FiSearch, FiHome, FiUserPlus, FiUpload } from "react-icons/fi";
import { FaSortAmountDown, FaSortAmountUp, FaUserTie } from "react-icons/fa";

function ViewAgents() {
  const navigate = useNavigate();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterPrefix, setFilterPrefix] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/agents");
      setAgents(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching agents:", error);
      setAgents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this agent?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/agents/${id}`);
      setAgents(prev => prev.filter(agent => agent._id !== id));
    } catch (error) {
      console.error("Error deleting agent:", error);
      alert("Failed to delete agent.");
    }
  };

  const filteredAgents = agents
    .filter(agent => 
      agent.name.toLowerCase().includes(search.toLowerCase()) ||
      agent.email.toLowerCase().includes(search.toLowerCase())
    )
    .filter(agent => 
      filterPrefix ? agent.mobile?.startsWith(filterPrefix) : true
    )
    .sort((a, b) => 
      sortOrder === "asc" 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name)
    );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading agents...</p>
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
            <FiUser className="mr-3" />
            <span>View Agents</span>
          </Link>
          <Link to="/upload" className="flex no-underline items-center p-3 text-gray-600 hover:bg-gray-100 rounded-lg">
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
            <h1 className="text-xl font-semibold text-gray-800">Agent Management</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Admin Panel</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          {/* Header - Mobile */}
          <div className="md:hidden flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                <FaUserTie className="mr-2 text-indigo-600" />
                Agent Management
              </h1>
              <p className="text-gray-600">View and manage all registered agents</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/add-agent"
                className="flex items-center justify-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <FiPlus className="mr-2" />
                Add Agent
              </Link>
              <Link
                to="/dashboard"
                className="flex items-center justify-center bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <FiArrowLeft className="mr-2" />
                Dashboard
              </Link>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name or email"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <input
                type="text"
                placeholder="Filter by mobile prefix"
                value={filterPrefix}
                onChange={(e) => setFilterPrefix(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {sortOrder === "asc" ? (
                    <FaSortAmountDown className="text-gray-400" />
                  ) : (
                    <FaSortAmountUp className="text-gray-400" />
                  )}
                </div>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                >
                  <option value="asc">Sort A-Z</option>
                  <option value="desc">Sort Z-A</option>
                </select>
              </div>
            </div>
          </div>

          {/* Agent Table */}
          {filteredAgents.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="text-gray-400 mb-4">
                <FiUser className="mx-auto text-4xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-700">No agents found</h3>
              <p className="text-gray-500 mt-1">Try adjusting your search or add a new agent</p>
              <Link
                to="/add-agent"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <FiPlus className="mr-2" />
                Add Agent
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center">
                          <FiUser className="mr-2" />
                          Name
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center">
                          <FiMail className="mr-2" />
                          Email
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center">
                          <FiPhone className="mr-2" />
                          Mobile
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center">
                          <FiClock className="mr-2" />
                          Created At
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAgents.map((agent) => (
                      <tr key={agent._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{agent.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{agent.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{agent.mobile}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {new Date(agent.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => navigate(`/edit-agent/${agent._id}`)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            <FiEdit2 className="inline mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(agent._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FiTrash2 className="inline mr-1" />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Showing <span className="font-medium">{filteredAgents.length}</span> agents
                  </div>
                  <div className="text-sm text-gray-500">
                    Total <span className="font-medium">{agents.length}</span> agents
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default ViewAgents;