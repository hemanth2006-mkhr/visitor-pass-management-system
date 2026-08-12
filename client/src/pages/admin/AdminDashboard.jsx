import React, { useState, useEffect } from 'react';
import { 
  Link, 
  useLocation, 
  Routes, 
  Route 
} from 'react-router-dom';
import { 
  Shield, 
  Users, 
  HelpCircle, 
  LogOut, 
  Clock, 
  UserCheck, 
  CheckCircle2, 
  Search, 
  Bell, 
  Settings, 
  MoreVertical, 
  FileText, 
  ArrowRight 
} from 'lucide-react';

import PeopleDirectory from '../../components/PeopleDirectory';
import { useAuth } from "../../context/AuthContext";
import api from '../../services/api';
import { formatDate } from '../../utils/formatDate';
import ActivityLog from './ActivityLog';

// Sub-component for Visitors view
function VisitorOverview() {
  const [searchTerm, setSearchTerm] = useState('');
  const [visitors, setVisitors] = useState([]);

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        const { data } = await api.get("/visitors/");
        setVisitors(data.visitors || []);
      } catch (err) {
        console.error("Failed to fetch visitors:", err);
      }
    };

    fetchVisitors();
  }, []);

  const filteredVisitors = visitors.filter(
    (v) =>
      (v?.visitorName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v?.company || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v?.employee?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Overview of visitor activity and system performance
        </p>
      </div>

      {/* METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Total Visitors
            </span>
            <span className="text-2xl font-black text-slate-900">{visitors.length}</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Pending Requests
            </span>
            <span className="text-2xl font-black text-slate-900">
              {visitors.filter((v) => v.status === "Pending").length}
            </span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Currently Checked In
            </span>
            <span className="text-2xl font-black text-slate-900">
              {visitors.filter((v) => v.status === "Checked-In" || v.status === "Checked-in").length}
            </span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <UserCheck className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Completed Visits
            </span>
            <span className="text-2xl font-black text-slate-900">
              {visitors.filter((v) => v.status === "Checked-Out").length}
            </span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* VISITORS TABLE */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Recent Visitors</h2>
          <a href="#view-all" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition">
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-500">
                <th className="py-3 px-6">Visitor</th>
                <th className="py-3 px-6">Company</th>
                <th className="py-3 px-6">Host</th>
                <th className="py-3 px-6">Purpose</th>
                <th className="py-3 px-6">Visit Date</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredVisitors.map((v) => (
                <tr key={v._id || v.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3.5 px-6 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-blue-200 font-bold text-[10px] flex items-center justify-center shrink-0">
                        {v.visitorName ? v.visitorName[0].toUpperCase() : 'V'}
                      </div>
                      <span className="font-bold text-slate-900">{v.visitorName}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-6 whitespace-nowrap text-slate-600">
                    {v.company || "N/A"}
                  </td>
                  <td className="py-3.5 px-6 whitespace-nowrap text-slate-700 font-medium">
                    {v.employee?.name || 'N/A'}
                  </td>
                  <td className="py-3.5 px-6 whitespace-nowrap text-slate-600">
                    {v.purpose || 'N/A'}
                  </td>
                  <td className="py-3.5 px-6 whitespace-nowrap text-slate-600 font-medium">
                    {formatDate(v.visitDate)}
                  </td>
                  <td className="py-3.5 px-6 whitespace-nowrap">
                    {(v.status === 'Checked-in' || v.status === 'Checked-In') && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100/80 text-emerald-800">
                        Checked-in
                      </span>
                    )}
                    {v.status === 'Pending' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100/80 text-amber-800">
                        Pending
                      </span>
                    )}
                    {v.status === 'Checked-Out' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100/80 text-indigo-800">
                        Checked-Out
                      </span>
                    )}
                    {v.status === 'Rejected' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100/80 text-rose-800">
                        Rejected
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-6 whitespace-nowrap text-right">
                    <button className="text-slate-400 hover:text-slate-600 p-1">
                      <MoreVertical className="w-4 h-4 ml-auto" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default function AdminDashboard() {
  const location = useLocation();
  const { logout } = useAuth();

  // Highlight check
  const isActive = (path) => {
    if (path === '/admin/dashboard') {
      return location.pathname === '/admin/dashboard' || location.pathname === '/admin/dashboard/';
    }
    return location.pathname === path;
  };

  return (
    <div className="max-h-screen bg-slate-50 flex font-sans text-slate-800">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col justify-between shrink-0 hidden md:flex md:min-h-screen md:z-10">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-indigo-950 text-lg leading-tight">SecureAccess</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Enterprise Security</p>
            </div>
          </div>

          <nav className="space-y-1.5 pt-2">
            <Link 
              to="/admin/dashboard" 
              className={`flex items-center gap-3 px-4 py-3 ${ isActive('/admin/dashboard') ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100/70"} rounded-xl font-medium text-xs transition`}
            >
              <Users className="w-4 h-4" />
              <span>Visitor Management</span>
            </Link>
            
            <Link 
              to="/admin/dashboard/people" 
              className={`flex items-center gap-3 px-4 py-3 ${ isActive('/admin/dashboard/people') ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100/70"} rounded-xl font-medium text-xs transition`}
            >
              <Users className="w-4 h-4" />
              <span>People</span>
            </Link>

            <Link 
              to="/admin/dashboard/activity" 
              className={`flex items-center gap-3 px-4 py-3 ${ isActive('/admin/dashboard/activity') ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100/70"} rounded-xl font-medium text-xs transition`}
            >
              <FileText className="w-4 h-4" />
              <span>Activity Log</span>
            </Link>
          </nav>
        </div>

        <div className="space-y-1 pt-6 border-t border-slate-100">
          <a href="#support" className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:text-slate-900 text-xs font-medium transition">
            <HelpCircle className="w-4 h-4" />
            <span>Support</span>
          </a>

          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:text-red-600 text-xs font-medium transition" onClick={logout}>
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col relative overflow-x-hidden">
        <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 px-6 py-3.5 flex items-center justify-between sticky top-0 z-20">
          <span className="text-xs font-bold text-indigo-600 tracking-wide uppercase">
            {location.pathname === '/admin/dashboard/people' ? 'People Directory' : location.pathname === '/admin/dashboard/activity' ? 'Activity Log' : 'Visitor Management'}
          </span>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition relative">
              <Bell className="w-4 h-4" />
              <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full absolute top-2 right-2" />
            </button>
            <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition">
              <Settings className="w-4 h-4" />
            </button>
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
              S
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-8 space-y-6 relative flex-1">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-60" />

          <div className="relative z-10 max-w-7xl mx-auto space-y-6">
            <Routes>
              <Route path="/" element={<VisitorOverview />} />
              <Route path="/people" element={<PeopleDirectory />} />
              <Route path="/activity" element={<ActivityLog/>} />
            </Routes>
          </div>
        </div>
      </main>

    </div>
  );
}