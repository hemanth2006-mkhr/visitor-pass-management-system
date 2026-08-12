import React, { useState } from 'react';
import {
  ShieldCheck,
  UserCheck,
  Activity,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Info,
  User,
  Building2
} from 'lucide-react';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';


export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const navigate = useNavigate()
  const { login } = useAuth()


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      const {data} = await api.post('auth/login', { email, password });
      login(data)


      if (data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (data.user.role === "receptionist") {
        navigate("/receptionist/dashboard");
      } else if (data.user.role === "employee") {
        navigate("/employee/dashboard");
      }

    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col lg:flex-row font-sans text-slate-800">

      {/* LEFT SECTION - Hero / Info */}
      <div className="lg:w-7/12 w-full bg-gradient-to-br from-indigo-50/80 via-purple-50/50 to-slate-100 p-6 sm:p-10 lg:p-16 flex flex-col justify-between relative overflow-hidden">

        {/* Subtle Background Geometric Grid / Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-indigo-100/80 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-6">
            <Building2 className="w-3.5 h-3.5" />
            Enterprise Visitor Management
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight mb-4">
            Visitor Pass <br className="hidden sm:inline" />
            Management System
          </h1>

          {/* Subtext */}
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8 max-w-xl">
            Securely manage visitor registrations, approvals, check-ins, and check-outs with a modern enterprise platform designed for scale and security.
          </p>

          {/* Features Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8">
            {/* Feature Card 1 */}
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-indigo-100/80 shadow-sm hover:shadow-md transition">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 mb-3">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">
                Secure Authentication
              </h3>
              <p className="text-xs text-slate-500 leading-normal">
                Enterprise-grade login with SAML/SSO and multi-factor authentication support.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-indigo-100/80 shadow-sm hover:shadow-md transition">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 mb-3">
                <UserCheck className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">
                Role-Based Access
              </h3>
              <p className="text-xs text-slate-500 leading-normal">
                Granular permissions for Administrators, Receptionists, and Employees.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-indigo-100/80 shadow-sm hover:shadow-md transition">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 mb-3">
                <Activity className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">
                Real-Time Tracking
              </h3>
              <p className="text-xs text-slate-500 leading-normal">
                Live dashboard monitoring of visitor locations and pass status across all facilities.
              </p>
            </div>
          </div>
        </div>

        {/* Hero Section Footer */}
        <div className="relative z-10 pt-8 mt-auto border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2 font-medium text-slate-700">
            <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
              S
            </div>
            SecureAccess Systems Inc.
          </div>
          <div>© 2024 All rights reserved.</div>
          <span className="px-2 py-0.5 rounded bg-slate-200/70 text-slate-600 font-mono text-[11px]">
            v2.4.0
          </span>
        </div>
      </div>

      {/* RIGHT SECTION - Sign In Form */}
      <div className="lg:w-5/12 w-full bg-slate-100/60 p-6 sm:p-10 lg:p-12 flex flex-col justify-center items-center">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-slate-200/60 p-6 sm:p-8 border border-slate-100">

          {/* Avatar Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <User className="w-6 h-6" />
            </div>
          </div>

          {/* Form Header */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-slate-900">Welcome Back</h2>
            <p className="text-xs text-slate-500 mt-1">
              Sign in to continue to your dashboard.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your work email"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition placeholder:text-slate-400 text-slate-800"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-9 pr-10 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition placeholder:text-slate-400 text-slate-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                Remember Me
              </label>
              <a
                href="#forgot-password"
                className="font-medium text-indigo-600 hover:text-indigo-700 transition"
              >
                Forgot Password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium rounded-lg text-xs transition shadow-sm shadow-indigo-200 mt-2"
            >
              Sign In
            </button>

          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-[11px] uppercase">
              <span className="bg-white px-2 text-slate-400 font-medium">OR</span>
            </div>
          </div>

          {/* Info Notice */}
          <div className="p-3 bg-indigo-50/50 border border-dashed border-indigo-200 rounded-lg flex items-start gap-2.5">
            <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-600 leading-tight">
              This application supports Administrator, Receptionist, Employee with role-based access.
            </p>
          </div>
        </div>

        {/* Form Footer */}
        <p className="text-center text-xs text-slate-500 mt-6">
          Need help?{' '}
          <a href="#support" className="text-indigo-600 hover:underline font-medium">
            Contact IT Administrator
          </a>
        </p>
      </div>

    </div>
  );
}