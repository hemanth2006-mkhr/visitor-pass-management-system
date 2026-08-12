import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  UserPlus,
  HelpCircle,
  LogOut,
  Hourglass,
  UserCheck,
  LogOut as LeaveIcon,
  Search,
  SlidersHorizontal,
  MoreVertical
} from 'lucide-react';

import { useNavigate } from "react-router-dom"
import CreateVisitorForm from './CreateVisitorForm';
import { useAuth } from '../../context/AuthContext';

import api from '../../services/api';
import { formatDate } from '../../utils/formatDate';

export default function ReceptionistDashboard() {

  const [searchTerm, setSearchTerm] = useState('');
  const [visitors, setVisitors] = useState([]);
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [dashboardData, setDashboardData] = useState([])

  const {logout} = useAuth()


  useEffect(() => {
    const fetchVisitors = async () => {
      const { data } = await api.get("/visitors/")
      setVisitors(data.visitors)
    }

    const fetchDashboardData = async () => {
      const { data } = await api.get("/dashboard/receptionist")
      setDashboardData(data.dashboard)
    }

    fetchVisitors()
    fetchDashboardData()

  }, [])

  const handleCheckIn = async(id) => {
    try {
      const {data} = await api.patch(`/visitors/${id}/check-in`)
      setVisitors((prev) => [data.visitor, ...prev])
      // setVisitors(visitors.map(v => v._id === id ? { ...v, status: 'Checked-in' } : v));
      
    } catch (error) {
      console.log(error.message)
    }
  };

  const handleCheckOut = async(id) => {
    try {
      const {data} = await api.patch(`/visitors/${id}/check-out`)
      setVisitors((prev) => [visitors, ...prev])
    } catch (error) {
      console.log(error.message)
    }
  };

  const filteredVisitors = visitors.filter((v) =>
    v.visitorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveVisitor = async (formData) => {
    try {
      const { data } = await api.post('/visitors/', formData)
      setVisitors((prev) => [data.visitor, ...prev])

    } catch (error) {
      console.log(error.message)
    }

  }
  

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-800">

      {/* LEFT SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200 p-6 flex-col justify-between shrink-0 hidden md:flex md:fixed md:min-h-screen md:z-10">
        <div className="space-y-8">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-indigo-950 text-lg leading-tight">SecureAccess</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Enterprise Security</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <a
              href="#visitor-management"
              className="flex items-center gap-3 px-4 py-3 bg-indigo-600 text-white rounded-xl font-medium text-xs shadow-sm transition"
            >
              <Users className="w-4 h-4" />
              <span>Visitor Management</span>
            </a>

            <a
              href="#people"
              className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-100/70 rounded-xl font-medium text-xs transition"
            >
              <Users className="w-4 h-4" />
              <span>People</span>
            </a>
          </nav>
        </div>

        {/* Sidebar Bottom Actions */}
        <div className="space-y-3 pt-6 border-t border-slate-100" onClick={() => setIsModalOpen(true)}>
          <button className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm transition">
            <UserPlus className="w-4 h-4" />
            <span>+ Register Visitor</span>
          </button>

          <a
            href="#support"
            className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:text-slate-900 text-xs font-medium transition"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Support</span>
          </a>

          <a
            href="#logout"
            className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:text-red-600 text-xs font-medium transition"
            onClick={()=>logout()} 
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </a>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-6 lg:p-10 relative overflow-x-hidden">
        {/* Subtle Background Vertical Line Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px)] bg-[size:32px_100%] pointer-events-none opacity-60" />

        <div className="relative z-10 max-w-6xl mx-auto space-y-8">

          {/* TOP HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 tracking-tight">
                Reception Dashboard
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Manage today's visitor activity.
              </p>
            </div>

            <button className="self-start sm:self-auto py-2.5 px-5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-sm shadow-indigo-200 transition"
              onClick={() => setIsModalOpen(true)}>
              <UserPlus className="w-4 h-4" />
              <span>+ Register Visitor</span>
            </button>
          </div>

          {/* METRIC STAT CARDS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

            {/* Total Visitors */}
            <div className="bg-white/90 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Total Visitors Today
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{dashboardData.todayVisitors}</span>
              </div>
              <Users className="w-7 h-7 text-indigo-200" />
            </div>

            {/* Pending Check-ins */}
            <div className="bg-white/90 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Pending Check-ins
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{dashboardData.pendingVisitors}</span>
              </div>
              <Hourglass className="w-7 h-7 text-amber-200" />
            </div>

            {/* Currently On-Site */}
            <div className="bg-white/90 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Currently On-Site
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{dashboardData.checkedInVisitors}</span>
              </div>
              <UserCheck className="w-7 h-7 text-emerald-200" />
            </div>

            {/* Checked Out */}
            <div className="bg-white/90 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Checked Out
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{dashboardData.checkedOutVisitors}</span>
              </div>
              <LeaveIcon className="w-7 h-7 text-slate-200" />
            </div>

          </div>

          {/* UPCOMING VISITORS CARD */}
          <CreateVisitorForm
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleSaveVisitor}
          />
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">

            {/* Table Search & Header Bar */}
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-base font-serif font-bold text-slate-900">
                Upcoming Visitors
              </h2>

              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search visitors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                  />
                </div>
                <button className="p-2 border border-slate-200 rounded-xl bg-slate-50/50 hover:bg-slate-100 text-slate-600 transition">
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* create visitor form */}

            {/* Visitors Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-serif font-bold text-slate-500">
                    <th className="py-3.5 px-6">Visitor Name</th>
                    <th className="py-3.5 px-6">Host</th>
                    <th className="py-3.5 px-6">Expected Time</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredVisitors.map((v) => (
                    <tr key={v._id} className="hover:bg-slate-50/50 transition">

                      {/* Name & Avatar */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 font-bold text-xs flex items-center justify-center shrink-0">
                            {v.visitorName[0]}
                          </div>
                          <div>
                            <div className="font-serif font-bold text-slate-900">{v.visitorName[0].toUpperCase()+ v.visitorName.slice(1)}</div>
                            <div className="text-[11px] text-slate-400 font-medium">{v.company}</div>
                          </div>
                        </div>
                      </td>

                      {/* Host */}
                      <td className="py-4 px-6 whitespace-nowrap font-serif text-slate-700">
                        {v.employee.name}
                      </td>

                      {/* Expected Time */}
                      <td className="py-4 px-6 whitespace-nowrap text-slate-600 font-medium">
                        {formatDate(v.visitDate)+" "}{v.expectedArrival}
                      </td>

                      {/* Status Badges */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        {v.status === 'Pending' && (
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-amber-100/70 text-amber-800">
                            Pending
                          </span>
                        )}
                        {v.status === 'Checked-In' && (
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-100/70 text-emerald-800">
                            Checked-in
                          </span>
                        )}
                        {v.status === 'Rejected' && (
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-red-100/70 text-red-800">
                            Rejected
                          </span>
                        )}
                        {v.status === 'Checked-Out' && (
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600">
                            Checked-out
                          </span>
                        )}
                        {v.status === 'Approved' && (
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-green-100 text-green-800">
                            Approved
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 whitespace-nowrap text-right">
                        {v.status === 'Pending' && (
                          <button
                            onClick={() => handleCheckIn(v._id)}
                            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-xs transition"
                          >
                            Check In
                          </button>
                        )}

                        {v.status === 'Approved' && (
                          <button
                            onClick={() => handleCheckIn(v._id)}
                            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-xs transition"
                          >
                            Check In
                          </button>
                        )}



                        {v.status === 'Checked-In' && (
                          <button
                            onClick={() => handleCheckOut(v._id)}
                            className="px-4 py-1.5 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded-lg font-semibold text-xs transition"
                          >
                            Check Out
                          </button>
                        )}

                        {v.status === 'Rejected' && (
                          <button className="text-slate-400 hover:text-slate-600 p-1">
                            <MoreVertical className="w-4 h-4 ml-auto" />
                          </button>
                        )}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer View All Link
            <div className="p-4 text-center border-t border-slate-100 bg-slate-50/30">
              <a
                href="#all-upcoming"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition"
              >
                View All Upcoming Visitors
              </a>
            </div> */}

          </div>

        </div>
      </main>

    </div>
  );
}