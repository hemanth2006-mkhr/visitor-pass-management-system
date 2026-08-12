import React, { useEffect, useState } from 'react';
import { 
  Search, 
  Download, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  Calendar,
  LayoutGrid,
  Users,
  UserCheck,
  BarChart2,
  History,
  HelpCircle,
  LogOut,
  Plus
} from 'lucide-react';
import api from '../../services/api';
import { formatDateTime } from '../../utils/formatDate';

export default function ActivityLog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEventType, setSelectedEventType] = useState('All');
  const [selectedTimeRange, setSelectedTimeRange] = useState('Last 24 Hours');

  const [activityLogs, setActivityLogs] = useState([])

  useEffect(()=>{

    const fetchActivityLog = async()=> {
      const {data} = await api.get("/activity-logs/")
      setActivityLogs(data.logs)
    }

    fetchActivityLog()
    
  }, [])

  // Sample data structured from the image
  // const logs = [
  //   {
  //     id: 1,
  //     date: 'Oct 24, 2023',
  //     time: '14:32:05 EST',
  //     eventType: 'Check-in',
  //     eventTypeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200 dot-emerald-500',
  //     description: 'Sarah Jenkins (Visitor) badge #4092 assigned and verified.',
  //     user: 'Mike K. (Reception)',
  //     initials: 'MK',
  //     ipLocation: '192.168.1.105',
  //   },
  //   {
  //     id: 2,
  //     date: 'Oct 24, 2023',
  //     time: '14:15:22 EST',
  //     eventType: 'Security Alert',
  //     eventTypeColor: 'bg-rose-50 text-rose-700 border-rose-200 dot-rose-500',
  //     description: 'Unauthorized access attempt at Server Room B (Door 4). Badge denied.',
  //     user: 'System (Auto)',
  //     initials: 'SY',
  //     ipLocation: 'L2 - Zone North',
  //   },
  //   {
  //     id: 3,
  //     date: 'Oct 24, 2023',
  //     time: '13:55:10 EST',
  //     eventType: 'System Update',
  //     eventTypeColor: 'bg-blue-50 text-blue-700 border-blue-200 dot-blue-500',
  //     description: 'Updated global watch list from external API endpoint.',
  //     user: 'Admin (A. Lee)',
  //     initials: 'AL',
  //     ipLocation: '10.0.45.22',
  //   },
  //   {
  //     id: 4,
  //     date: 'Oct 24, 2023',
  //     time: '13:10:00 EST',
  //     eventType: 'Check-out',
  //     eventTypeColor: 'bg-sky-50 text-sky-700 border-sky-200 dot-sky-500',
  //     description: 'Vendor #8822 (Apex Logistics) checked out. Badge returned.',
  //     user: 'Mike K. (Reception)',
  //     initials: 'MK',
  //     ipLocation: '192.168.1.105',
  //   },
  //   {
  //     id: 5,
  //     date: 'Oct 24, 2023',
  //     time: '11:45:33 EST',
  //     eventType: 'Pending',
  //     eventTypeColor: 'bg-amber-50 text-amber-700 border-amber-200 dot-amber-500',
  //     description: 'Pre-registration created for John Doe (Consultant). Awaiting ID verification.',
  //     user: 'Emily J. (Host)',
  //     initials: 'EJ',
  //     ipLocation: 'Remote Portal',
  //   },
  // ];

  // Helper function to render badge colors and dots accurately
  const renderBadge = (type) => {
    switch (type) {
      case 'CHECK_IN':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Check-in
          </span>
        );
      case 'REJECT_VISITOR':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Check-in
          </span>
        );

      case 'Security Alert':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Security Alert
          </span>
        );
      case 'System Update':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            System Update
          </span>
        );
      case 'Check-out':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
            Check-out
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Pending
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-50 text-slate-700 border border-slate-200">
            {type}
          </span>
        );
    }
  };

  return (
    <div className="max-h-screen bg-slate-100/60 p-4 lg:p-2 font-sans text-slate-800 flex justify-center ">
      
      {/* MAIN CONTAINER FRAME */}
      <div className="w-full max-w-[1280px] bg-white rounded-2xl shadow-sm border border-slate-200 flex overflow-hidden min-h-[780px]">
        
        {/* LEFT SIDEBAR */}
        

        {/* MAIN BODY AREA */}
        <main className="flex-1 p-6 lg:p-8 flex flex-col justify-between bg-white overflow-x-auto">
          <div className="space-y-6">
            
            {/* Header Title & Export Button */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Activity Log
                </h1>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Audit trail of system events, visitor movements, and security alerts.
                </p>
              </div>

              <button className="self-start px-3.5 py-2 border border-indigo-200 text-indigo-700 hover:bg-indigo-50/50 rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs transition shrink-0">
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row items-center gap-3">
              {/* Search Box */}
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search logs, users, or IPs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition placeholder:text-slate-400"
                />
              </div>

              {/* Event Type Dropdown Filter */}
              <div className="relative w-full md:w-auto">
                <button className="w-full md:w-auto px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 flex items-center justify-between gap-6 hover:bg-slate-50 transition">
                  <span className="whitespace-nowrap">Event Type (All)</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>

              {/* Date Filter Dropdown */}
              <div className="relative w-full md:w-auto">
                <button className="w-full md:w-auto px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 flex items-center justify-between gap-6 hover:bg-slate-50 transition">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span className="whitespace-nowrap">Last 24 Hours</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>

            {/* LOGS TABLE */}
            <div className="border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/70 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-5">Timestamp</th>
                      <th className="py-3 px-5">Event Type</th>
                      <th className="py-3 px-5">Description</th>
                      <th className="py-3 px-5">User / Actor</th>
                      <th className="py-3 px-5">IP / Location</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {activityLogs.map((log) => (
                      <tr key={log._id} className="hover:bg-slate-50/60 transition">
                        {/* Timestamp */}
                        <td className="py-4 px-5 whitespace-nowrap align-top">
                          <div className="font-semibold text-slate-700">{formatDateTime(log.createdAt)}</div>
                          {/* <div className="text-[10px] text-slate-400 mt-0.5">{log.time}</div> */}
                        </td>

                        {/* Event Type Badge */}
                        <td className="py-4 px-5 whitespace-nowrap align-top">
                          {renderBadge(log.action)}
                        </td>

                        {/* Description */}
                        <td className="py-4 px-5 max-w-xs align-top text-slate-700 font-medium leading-relaxed">
                          {log.description}
                        </td>

                        {/* User / Actor */}
                        <td className="py-4 px-5 whitespace-nowrap align-top">
                          <div className="flex items-center gap-2.5">
                            <div className="w-6 h-6 rounded-full bg-indigo-900 text-white font-bold text-[9px] flex items-center justify-center shrink-0">
                              {log.employee.name[0]}
                            </div>
                            <span className="font-bold text-slate-800">{log.user.email}</span>
                          </div>
                        </td>

                        {/* IP / Location */}
                        <td className="py-4 px-5 whitespace-nowrap align-top text-slate-500 font-mono text-[11px]">
                          {log.ipAddress}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* TABLE PAGINATION FOOTER */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              Showing <span className="font-bold text-slate-800">1</span> to <span className="font-bold text-slate-800">25</span> of <span className="font-bold text-slate-800">1,248</span> logs
            </div>

            <div className="flex items-center gap-1.5">
              <button className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition">
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <button className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                1
              </button>
              
              <button className="w-7 h-7 rounded-lg hover:bg-slate-100 font-semibold text-slate-600 text-xs flex items-center justify-center transition">
                2
              </button>
              
              <button className="w-7 h-7 rounded-lg hover:bg-slate-100 font-semibold text-slate-600 text-xs flex items-center justify-center transition">
                3
              </button>
              
              <span className="px-1 text-slate-400 font-semibold">...</span>
              
              <button className="w-7 h-7 rounded-lg hover:bg-slate-100 font-semibold text-slate-600 text-xs flex items-center justify-center transition">
                50
              </button>

              <button className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </main>
      </div>

    </div>
  );
}