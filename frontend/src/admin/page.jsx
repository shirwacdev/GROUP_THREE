// import React, { useState } from "react";
import { useState } from "react";

import { BarChart3, BookOpen, GraduationCap, LogOut, UserPlus, Users } from "lucide-react";

const stats = [
  { title: "Total Users", value: 8, icon: Users, iconColor: "text-blue-600", iconBg: "bg-blue-100" },
  { title: "Total Quizzes", value: 6, icon: BookOpen, iconColor: "text-green-600", iconBg: "bg-green-100" },
  { title: "Teachers", value: 2, icon: UserPlus, iconColor: "text-purple-600", iconBg: "bg-purple-100" },
  { title: "Students", value: 5, icon: BarChart3, iconColor: "text-orange-600", iconBg: "bg-orange-100" },
];

const users = [
  { name: "Admin User", email: "admin@quiz.com", role: "Admin" },
  { name: "John Smith", email: "teacher@quiz.com", role: "Teacher" },
  { name: "Sarah Johnson", email: "teacher2@quiz.com", role: "Teacher" },
  { name: "Alice Williams", email: "student@quiz.com", role: "Student", points: 180 },
  { name: "Bob Brown", email: "bob@quiz.com", role: "Student", points: 250 },
  { name: "Charlie Davis", email: "charlie@quiz.com", role: "Student", points: 220 },
];

const tabClasses = (isActive) =>
  `px-5 py-2 rounded-xl text-[18px] font-semibold transition-colors ${
    isActive ? "bg-white text-gray-900" : "text-gray-900 hover:bg-white/70"
  }`;

const rolePillStyles = {
  Admin: "bg-purple-100 text-purple-700",
  Teacher: "bg-blue-100 text-blue-700",
  Student: "bg-green-100 text-green-700",
};

export default function AdminDashboard({ onBackToLogin }) {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <main className="min-h-screen bg-gray-100">
      <header className="w-full bg-white border-b border-gray-200 px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-[42px] font-bold text-gray-900 leading-tight">Quiz Master</h1>
            <p className="text-[16px] text-gray-500">Interactive Learning Platform</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right leading-tight">
            <p className="text-[20px] font-semibold text-gray-900">Admin User</p>
            <p className="inline-block mt-1 px-3 py-1 rounded-full text-[16px] font-semibold text-purple-700 bg-purple-100">
              Admin
            </p>
          </div>
          <button
            type="button"
            onClick={onBackToLogin}
            className="h-10 px-5 rounded-xl border border-gray-300 bg-white font-semibold flex items-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </header>

      <section className="max-w-[1320px] mx-auto px-6 py-10">
        <h2 className="text-[58px] font-bold text-slate-900 leading-tight">Admin Dashboard</h2>
        <p className="text-[18px] text-gray-600 mt-2">Manage users, quizzes, and view system analytics</p>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="bg-white rounded-2xl border border-gray-200 p-7 flex items-center justify-between">
                <div>
                  <p className="text-[18px] font-semibold text-gray-600">{item.title}</p>
                  <p className="text-[48px] font-bold text-slate-900 mt-1">{item.value}</p>
                </div>
                <div className={`w-14 h-14 rounded-2xl ${item.iconBg} flex items-center justify-center`}>
                  <Icon className={`w-7 h-7 ${item.iconColor}`} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 inline-flex bg-gray-200 rounded-2xl p-1">
          <button type="button" onClick={() => setActiveTab("users")} className={tabClasses(activeTab === "users")}>
            Users
          </button>
          <button type="button" onClick={() => setActiveTab("quizzes")} className={tabClasses(activeTab === "quizzes")}>
            Quizzes
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("leaderboard")}
            className={tabClasses(activeTab === "leaderboard")}
          >
            Leaderboard
          </button>
        </div>

        {activeTab === "users" && (
          <section className="mt-8 bg-white border border-gray-200 rounded-2xl p-7">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h3 className="text-[34px] font-bold text-gray-900 leading-tight">User Management</h3>
                <p className="text-[18px] text-gray-500 mt-1">Create and manage teachers and students</p>
              </div>
              <button
                type="button"
                className="h-14 px-6 rounded-xl bg-slate-950 text-white text-[20px] font-semibold flex items-center gap-3"
              >
                <UserPlus className="w-6 h-6" />
                Create User
              </button>
            </div>

            <div className="mt-8 space-y-4">
              {users.map((user) => (
                <article
                  key={user.email}
                  className="border border-gray-200 rounded-2xl px-6 py-5 flex items-center justify-between gap-4"
                >
                  <div>
                    <p className="text-[30px] md:text-[24px] font-semibold text-gray-900 leading-tight">{user.name}</p>
                    <p className="text-[18px] md:text-[16px] text-gray-500 leading-tight mt-1">{user.email}</p>
                  </div>

                  <div className="flex items-center gap-5">
                    <span
                      className={`px-5 py-1 rounded-full text-[16px] font-semibold ${
                        rolePillStyles[user.role] ?? "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {user.role}
                    </span>
                    {user.role === "Student" && typeof user.points === "number" && (
                      <span className="text-[24px] md:text-[20px] font-semibold text-slate-600">{user.points} pts</span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {activeTab === "quizzes" && (
          <section className="mt-8 bg-white border border-gray-200 rounded-2xl p-8">
            <h3 className="text-[32px] font-bold text-gray-900">Quiz Management</h3>
            <p className="text-[18px] text-gray-500 mt-2">Quiz list can be added here.</p>
          </section>
        )}

        {activeTab === "leaderboard" && (
          <section className="mt-8 bg-white border border-gray-200 rounded-2xl p-8">
            <h3 className="text-[32px] font-bold text-gray-900">Leaderboard</h3>
            <p className="text-[18px] text-gray-500 mt-2">Leaderboard details can be added here.</p>
          </section>
        )}
      </section>
    </main>
  );
}
