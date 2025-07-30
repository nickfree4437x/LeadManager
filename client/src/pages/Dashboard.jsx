import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiLogOut, FiUserPlus, FiUsers, FiUpload, FiUser, FiPhone, FiFileText } from "react-icons/fi";
import { BsGraphUp, BsPersonCheck, BsFileEarmarkExcel } from "react-icons/bs";

function Dashboard() {
  const [adminEmail, setAdminEmail] = useState("");
  const [stats, setStats] = useState({ totalAgents: 0, totalLeads: 0 });
  const [recentLeads, setRecentLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      const [agentsRes, leadsRes] = await Promise.all([
        axios.get("https://leadmanager-fvgq.onrender.com/api/agents"),
        axios.get("https://leadmanager-fvgq.onrender.com/api/distributed")
      ]);

      let totalLeads = 0;
      let recent = [];

      leadsRes.data.forEach((dist) => {
        totalLeads += dist.data.length;
        recent.push(...dist.data.slice(0, 2));
      });

      setStats({
        totalAgents: agentsRes.data.length,
        totalLeads: totalLeads,
      });

      setRecentLeads(recent.slice(0, 6));
    } catch (err) {
      console.error("Dashboard data error", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const email = localStorage.getItem("adminEmail") || "Admin";
    setAdminEmail(email);
    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
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
          <Link to="/dashboard" className="flex no-underline items-center p-3 text-indigo-600 bg-indigo-50 rounded-lg mb-2">
            <BsGraphUp className="mr-3" />
            <span>Dashboard</span>
          </Link>
          <Link to="/add-agent" className="flex items-center no-underline p-3 text-gray-600 hover:bg-gray-100 rounded-lg mb-2">
            <FiUserPlus className="mr-3" />
            <span>Add Agent</span>
          </Link>
          <Link to="/view-agents" className="flex items-center no-underline p-3 text-gray-600 hover:bg-gray-100 rounded-lg mb-2">
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
            <h1 className="text-xl font-semibold text-gray-800">Dashboard Overview</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {adminEmail}</span>
              <button
                onClick={handleLogout}
                className="flex items-center text-sm text-red-500 hover:text-red-700"
              >
                <FiLogOut className="mr-1" />
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-indigo-50 text-indigo-600 mr-4">
                  <FiUsers size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Agents</p>
                  <p className="text-2xl font-semibold text-gray-800">{stats.totalAgents}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-50 text-blue-600 mr-4">
                  <BsFileEarmarkExcel size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Leads</p>
                  <p className="text-2xl font-semibold text-gray-800">{stats.totalLeads}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-50 text-green-600 mr-4">
                  <BsPersonCheck size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Recent Leads</p>
                  <p className="text-2xl font-semibold text-gray-800">{recentLeads.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Link to="/add-agent" className="group no-underline">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all group-hover:border-indigo-300">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-full bg-indigo-50 text-indigo-600 mr-4">
                    <FiUserPlus size={20} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Add New Agent</h3>
                </div>
                <p className="text-sm text-gray-500">Create a new agent account with email and password</p>
              </div>
            </Link>

            <Link to="/view-agents" className="group no-underline">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all group-hover:border-indigo-300">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-full bg-indigo-50 text-indigo-600 mr-4">
                    <FiUsers size={20} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Manage Agents</h3>
                </div>
                <p className="text-sm text-gray-500">View and manage all registered agents</p>
              </div>
            </Link>

            <Link to="/upload" className="group no-underline">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all group-hover:border-indigo-300">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-full bg-indigo-50 text-indigo-600 mr-4">
                    <FiUpload size={20} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Upload Leads</h3>
                </div>
                <p className="text-sm text-gray-500">Upload and distribute leads from CSV/Excel files</p>
              </div>
            </Link>
          </div>

          {/* Recent Leads */}
          {recentLeads.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Recent Leads</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {recentLeads.map((lead, idx) => (
                  <div key={idx} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 p-3 rounded-full bg-indigo-50 text-indigo-600 mr-4">
                        <FiUser size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {lead.FirstName || 'No Name'}
                          </p>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            New
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-4 mt-2">
                          <div className="flex items-center text-sm text-gray-500">
                            <FiPhone className="mr-1.5" size={14} />
                            <span>{lead.Phone || 'No Phone'}</span>
                          </div>
                          {lead.Notes && (
                            <div className="flex items-center text-sm text-gray-500">
                              <FiFileText className="mr-1.5" size={14} />
                              <span className="truncate max-w-xs">{lead.Notes}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-6 py-3 bg-gray-50 text-right">
                <Link to="/upload" className="text-sm no-underline hover:underline font-medium text-indigo-600 hover:text-indigo-500">
                  View all leads →
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;