import React, { useState, useEffect } from 'react';
import {
  LogOut,
  Hourglass,
  ClipboardCheck,
  Building2,
  Eye
} from 'lucide-react';
import api from "../../services/api";
import { formatDate } from '../../utils/formatDate';

import { useAuth } from '../../context/AuthContext';

export default function EmployeeDashboard() {
  const [requests, setRequests] = useState([])

  const {logout} = useAuth()

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data } = await api.get('/visitors/requests/pending');
        setRequests(data.visitors);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchRequests();
  }, [])


  const handleApprove = async (id) => {
    const requestToApprove = requests.find((req) => req._id === id);
    if (!requestToApprove) return;
    try {
      const response = await api.patch(`/visitors/${id}/approve`, {remarks : "N/A"});
      console.log("Approve response:", response.data);
      setRequests((prevRequests) =>
        prevRequests.map((req) => req._id === id ? { ...req, status: "Approved" } : req));
    }
    catch (error) { console.error("Error approving request:", error.response?.data || error.message); }
  };

  const handleReject = async (id) => {
    const requestToReject = requests.find((req) => req._id === id);
    if (!requestToReject) return;
    try {
      const response = await api.patch(`/visitors/${id}/reject`, {remarks : "N/A"});
      console.log("Reject response:", response.data);
      setRequests((prevRequests) =>
        prevRequests.map((req) => req._id === id ? { ...req, status: "Rejected" } : req));
    }
    catch (error) { console.error("Error rejecting request:", error.response?.data || error.message); }
  };


  return (
    <div className="min-h-screen bg-slate-50 relative font-sans text-slate-800 p-4 sm:p-6 lg:p-8">
      {/* Background Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-size-[20px_20px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto space-y-6">

        {/* TOP NAVBAR / HEADER */}
        <header className="bg-white/90 backdrop-blur-sm rounded-xl border border-slate-200/80 px-6 py-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-extrabold text-indigo-700 tracking-tight">
              SecureAccess
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* User Profile Avatar */}
            <div className="w-9 h-9 rounded-full bg-indigo-700 text-white font-bold flex items-center justify-center text-sm shadow-sm">
              J
            </div>
            {/* Logout Button */}
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 cursor-pointer transition hover:text-red-600"
              onClick={()=>logout()} 
            >
              <LogOut className="w-3.5 h-3.5" />
              <span >Logout</span>
            </button>
          </div>
        </header>

        {/* DASHBOARD TITLE SECTION */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Employee Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Manage your visitor requests and visits.
          </p>
        </div>

        {/* STATS CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">

          {/* Card 1: Pending Requests */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm flex justify-between items-start">
            <div className="space-y-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Pending Requests
              </span>
              <div className="text-3xl font-black text-slate-900">3</div>
              <p className="text-xs text-slate-500 font-medium">Require your attention</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
              <Hourglass className="w-4 h-4" />
            </div>
          </div>

          {/* Card 2: Approved Visits */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm flex justify-between items-start">
            <div className="space-y-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Approved Visits
              </span>
              <div className="text-3xl font-black text-slate-900">12</div>
              <p className="text-xs text-slate-500 font-medium">Scheduled for this week</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
              <ClipboardCheck className="w-4 h-4" />
            </div>
          </div>

          {/* Card 3: Currently Visiting */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm flex justify-between items-start">
            <div className="space-y-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Currently Visiting
              </span>
              <div className="text-3xl font-black text-slate-900">1</div>
              <p className="text-xs text-slate-500 font-medium">In the building now</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>

        </div>

        {/* RECENT VISITOR REQUESTS TABLE CONTAINER */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">

          {/* Card Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Recent Visitor Requests
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Review and approve upcoming guests.
              </p>
            </div>
            <a
              href="#view-all"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition"
            >
              View All
            </a>
          </div>

          {/* Responsive Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Visitor</th>
                  <th className="py-3.5 px-6">Company</th>
                  <th className="py-3.5 px-6">Date & Time</th>
                  <th className="py-3.5 px-6">Purpose</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right sm:text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {requests.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/60 transition">

                    {/* Visitor Name & Avatar */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full ${item.avatarColor} font-bold text-[11px] flex items-center justify-center shrink-0`}>
                          {item.visitorName}
                        </div>
                        <span className="font-bold text-slate-900">{item.visitor}</span>
                      </div>
                    </td>

                    {/* Company */}
                    <td className="py-4 px-6 whitespace-nowrap text-slate-600">
                      {item.company ? item.company : "N/A"}
                    </td>

                    {/* Date & Time */}
                    <td className="py-4 px-6 whitespace-nowrap text-slate-600">
                      {formatDate(item.visitDate)}
                    </td>

                    {/* Purpose */}
                    <td className="py-4 px-6 whitespace-nowrap text-slate-600">
                      {item.purpose}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      {item.status === 'Pending' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100/70 text-amber-800">
                          Pending
                        </span>
                      )}
                      {item.status === 'Approved' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100/70 text-emerald-800">
                          Approved
                        </span>
                      )}
                    </td>

                    {/* Action Buttons */}
                    <td className="py-4 px-6 whitespace-nowrap text-right sm:text-center">
                      {item.status === 'Pending' ? (
                        <div className="flex items-center justify-end sm:justify-center gap-2">
                          <button
                            onClick={() => handleApprove(item._id)}
                            className="px-3 py-1 rounded-md border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white transition font-semibold text-xs"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(item._id)}
                            className="px-2 py-1 text-slate-500 hover:text-red-600 transition font-medium text-xs"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end sm:justify-center text-slate-400 hover:text-slate-600 transition">
                          <button title="View Details">
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

      </div>
    </div>
  );
}