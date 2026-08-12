import React, { useEffect, useState } from 'react';
import { Search, Filter, UserPlus, MoreVertical, ChevronLeft, ChevronRight, Building2, X, Loader2 } from 'lucide-react';
import { createPortal } from 'react-dom';
import api from '../services/api';

export default function PeopleDirectory() {
  const [activeSegment, setActiveSegment] = useState('System Users'); // 'System Users' | 'Employees'
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({});

  const isEmployeesTab = activeSegment === 'Employees';

  // Fetch both lists to calculate unassigned employees
  const ensureDataLoaded = async () => {
    try {
      const promises = [];
      if (users.length === 0) promises.push(api.get("/admin/users"));
      else promises.push(Promise.resolve(null));

      if (employees.length === 0) promises.push(api.get("/employees"));
      else promises.push(Promise.resolve(null));

      const [usersRes, empRes] = await Promise.all(promises);

      if (usersRes) setUsers(usersRes.data.users || []);
      if (empRes) setEmployees(empRes.data.employees || empRes.data || []);
    } catch (err) {
      console.error("Failed to fetch necessary data:", err);
    }
  };

  // Reset form when modal opens with model-aligned defaults
  const handleOpenModal = async () => {
    if (!isEmployeesTab) {
      await ensureDataLoaded();
    }

    setFormData(
      isEmployeesTab
        ? {
            employeeId: '',
            name: '',
            email: '',
            phone: '',
            department: '',
            designation: '',
            status: 'Active',
          }
        : {
            email: '',
            password: '',
            role: 'employee',
            isActive: true,
            employeeId: '',
          }
    );
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({});
  };

  // Dynamic Data Fetching
  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeSegment === 'System Users') {
        const { data } = await api.get("/admin/users");
        setUsers(data.users || []);
      } else {
        const { data } = await api.get("/employees");
        setEmployees(data.employees || data || []);
      }
    } catch (err) {
      console.error(`Failed to fetch ${activeSegment}:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeSegment]);

  // Form Input Handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'role' && value === 'employee') {
      ensureDataLoaded();
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Filter out employees who already have a user account created
  const availableEmployees = employees.filter((emp) => {
    const empId = (emp._id || emp.id)?.toString();
    const empEmail = emp.email?.toLowerCase();

    const isAlreadyUser = users.some((user) => {
      const userEmpId = (user.employee?._id || user.employee?.id || user.employee)?.toString();
      const userEmail = user.email?.toLowerCase();

      return (userEmpId && userEmpId === empId) || (userEmail && userEmail === empEmail);
    });

    return !isAlreadyUser;
  });

  // Handle Employee Select change (Auto-fills Email)
  const handleEmployeeSelect = (e) => {
    const selectedEmpId = e.target.value;
    const selectedEmp = employees.find((emp) => (emp._id || emp.id)?.toString() === selectedEmpId);

    setFormData((prev) => ({
      ...prev,
      employeeId: selectedEmpId,
      email: selectedEmp ? (selectedEmp.email || '') : prev.email,
    }));
  };

  // Form Submission Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isEmployeesTab) {
        // Construct payload strictly matching Employee Mongoose Schema
        const employeePayload = {
          employeeId: formData.employeeId,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          department: formData.department,
          designation: formData.designation,
          status: formData.status || 'Active',
        };

        await api.post('/employees', employeePayload);
      } else {
        // Construct payload strictly matching User Mongoose Schema
        const userPayload = {
          email: formData.email,
          password: formData.password,
          role: formData.role,
          isActive: formData.isActive,
          employee: formData.role === 'employee' && formData.employeeId ? formData.employeeId : null,
        };

        await api.post('/admin/users', userPayload);
      }

      handleCloseModal();
      await fetchData(); // Refresh directory list after adding
    } catch (err) {
      console.error(`Failed to create ${isEmployeesTab ? 'employee' : 'user'}:`, err);
      alert(`Error creating ${isEmployeesTab ? 'employee' : 'user'}. Please check all required fields and try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter System Users
  const filteredUsers = users.filter((user) => {
    const userName = user?.employee?.name || user?.email || '';
    const userEmail = user?.email || '';
    const userRole = user?.role || '';
    const term = searchTerm.toLowerCase();

    return (
      userName.toLowerCase().includes(term) ||
      userEmail.toLowerCase().includes(term) ||
      userRole.toLowerCase().includes(term)
    );
  });

  // Filter Employees
  const filteredEmployees = employees.filter((emp) => {
    const name = emp?.name || '';
    const email = emp?.email || '';
    const dept = emp?.department || '';
    const designation = emp?.designation || '';
    const code = emp?.employeeId || '';
    const term = searchTerm.toLowerCase();

    return (
      name.toLowerCase().includes(term) ||
      email.toLowerCase().includes(term) ||
      dept.toLowerCase().includes(term) ||
      designation.toLowerCase().includes(term) ||
      code.toLowerCase().includes(term)
    );
  });

  const getInitials = (name = '') => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const displayedList = isEmployeesTab ? filteredEmployees : filteredUsers;

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          People Directory
        </h1>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={isEmployeesTab ? "Search employees..." : "Search users..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* TABLE CONTROLS & SEGMENT TAB */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="bg-slate-200/60 p-1 rounded-xl flex items-center gap-1 self-start">
          <button
            onClick={() => setActiveSegment('System Users')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeSegment === 'System Users'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            System Users
          </button>
          <button
            onClick={() => setActiveSegment('Employees')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeSegment === 'Employees'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Employees
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-2 shadow-sm transition">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>Filter</span>
          </button>

          <button
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-sm shadow-indigo-200 transition"
            onClick={handleOpenModal}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{isEmployeesTab ? '+ Add Employee' : '+ Add User'}</span>
          </button>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-500">
                {isEmployeesTab ? (
                  <>
                    <th className="py-3.5 px-6">Employee</th>
                    <th className="py-3.5 px-6">Department</th>
                    <th className="py-3.5 px-6">Designation</th>
                    <th className="py-3.5 px-6">Contact</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </>
                ) : (
                  <>
                    <th className="py-3.5 px-6">User Profile</th>
                    <th className="py-3.5 px-6">Role</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6">Last Login</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400 font-medium">
                    Loading {isEmployeesTab ? 'employees' : 'users'}...
                  </td>
                </tr>
              ) : displayedList.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400 font-medium">
                    No {isEmployeesTab ? 'employees' : 'users'} found
                  </td>
                </tr>
              ) : isEmployeesTab ? (
                filteredEmployees.map((emp) => {
                  const empName = emp?.name || 'Unnamed Employee';
                  return (
                    <tr key={emp._id || emp.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0">
                            {getInitials(empName)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{empName}</div>
                            <div className="text-[11px] text-slate-400">{emp?.employeeId || 'ID: N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-6 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          {emp?.department || 'N/A'}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 whitespace-nowrap font-medium text-slate-700">
                        {emp?.designation || 'N/A'}
                      </td>
                      <td className="py-3.5 px-6 whitespace-nowrap text-slate-500 font-medium">
                        <div>{emp?.email || 'N/A'}</div>
                        <div className="text-[10px] text-slate-400">{emp?.phone || ''}</div>
                      </td>
                      <td className="py-3.5 px-6 whitespace-nowrap">
                        {emp?.status === 'Inactive' ? (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                            Inactive
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Active
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-6 whitespace-nowrap text-right">
                        <button className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition">
                          <MoreVertical className="w-4 h-4 ml-auto" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                filteredUsers.map((user) => {
                  const displayName = user?.employee?.name || user?.email || 'Unnamed User';
                  return (
                    <tr key={user._id || user.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold text-xs flex items-center justify-center shrink-0">
                            {getInitials(displayName)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{displayName}</div>
                            <div className="text-[11px] text-slate-400">{user?.email || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-6 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 capitalize">
                          {user?.role || 'Member'}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 whitespace-nowrap">
                        {user?.isActive === false ? (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                            Inactive
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Active
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-6 whitespace-nowrap text-slate-500 font-medium">
                        {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="py-3.5 px-6 whitespace-nowrap text-right">
                        <button className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition">
                          <MoreVertical className="w-4 h-4 ml-auto" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {displayedList.length} {isEmployeesTab ? 'employees' : 'users'}</span>
          <div className="flex items-center gap-1">
            <button className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-6 h-6 rounded bg-indigo-50 text-indigo-600 font-bold text-xs flex items-center justify-center">
              1
            </button>
            <button className="p-1 text-slate-400 hover:text-slate-600">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* OVERLAY FORM MODAL WITH PORTAL */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-md overflow-hidden transform transition-all">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {isEmployeesTab ? 'Add New Employee' : 'Add System User'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Dynamic Employee Select (Only when creating System User with Role 'employee') */}
              {!isEmployeesTab && formData.role === 'employee' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Select Employee
                  </label>
                  <select
                    name="employeeId"
                    value={formData.employeeId || ''}
                    onChange={handleEmployeeSelect}
                    required
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                  >
                    <option value="">
                      {availableEmployees.length === 0
                        ? 'No unassigned employees available'
                        : '-- Choose an Employee --'}
                    </option>
                    {availableEmployees.map((emp) => {
                      const empId = emp._id || emp.id;
                      const empName = emp.name || 'Unnamed Employee';
                      return (
                        <option key={empId} value={empId}>
                          {empName} {emp.email ? `(${emp.email})` : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}

              {/* Form inputs for creating Employee */}
              {isEmployeesTab ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Employee ID
                      </label>
                      <input
                        type="text"
                        name="employeeId"
                        required
                        value={formData.employeeId || ''}
                        onChange={handleInputChange}
                        placeholder="e.g. EMP-101"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name || ''}
                        onChange={handleInputChange}
                        placeholder="e.g. Jane Doe"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email || ''}
                        onChange={handleInputChange}
                        placeholder="e.g. jane@company.com"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone || ''}
                        onChange={handleInputChange}
                        placeholder="+1 555-0192"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Department
                      </label>
                      <input
                        type="text"
                        name="department"
                        required
                        value={formData.department || ''}
                        onChange={handleInputChange}
                        placeholder="Engineering"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Designation
                      </label>
                      <input
                        type="text"
                        name="designation"
                        required
                        value={formData.designation || ''}
                        onChange={handleInputChange}
                        placeholder="Software Engineer"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status || 'Active'}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </>
              ) : (
                /* Form inputs for creating System User */
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email || ''}
                      onChange={handleInputChange}
                      placeholder="e.g. jane@company.com"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      required
                      minLength={6}
                      value={formData.password || ''}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Role
                      </label>
                      <select
                        name="role"
                        value={formData.role || 'employee'}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                      >
                        <option value="admin">Admin</option>
                        <option value="receptionist">Receptionist</option>
                        <option value="employee">Employee</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Status
                      </label>
                      <select
                        name="isActive"
                        value={formData.isActive !== undefined ? formData.isActive : true}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, isActive: e.target.value === 'true' }))
                        }
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                      >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isEmployeesTab ? 'Save Employee' : 'Create User'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}