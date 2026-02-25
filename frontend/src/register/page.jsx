// import React, { useState } from "react";
import { useState } from "react";
import { ArrowLeft, UserPlus } from "lucide-react";

export default function Register({ onBackToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <main className="min-h-screen bg-slate-200 flex items-center justify-center px-4 py-8">
      <section className="w-full max-w-sm bg-white rounded-2xl p-6">
        <div className="flex justify-center mb-5">
          <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center">
            <UserPlus className="w-6 h-6 text-white" />
          </div>
        </div>

        <h1 className="text-5xl font-bold text-center text-black mb-2">Register</h1>
        <p className="text-center text-gray-500 text-lg mb-6">Create your account</p>

        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-black font-semibold mb-2">
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full h-11 bg-gray-100 rounded-xl px-4 outline-none"
            />
          </div>

          <div>
            <label htmlFor="register-email" className="block text-black font-semibold mb-2">
              Email
            </label>
            <input
              id="register-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full h-11 bg-gray-100 rounded-xl px-4 outline-none"
            />
          </div>

          <div>
            <label htmlFor="register-password" className="block text-black font-semibold mb-2">
              Password
            </label>
            <input
              id="register-password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full h-11 bg-gray-100 rounded-xl px-4 outline-none"
            />
          </div>

          <button type="button" className="w-full h-11 rounded-xl bg-black text-white font-semibold">
            Create Account
          </button>
        </form>

        <button
          type="button"
          onClick={onBackToLogin}
          className="mt-4 w-full h-11 rounded-xl border border-gray-300 bg-white font-semibold flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Login
        </button>
      </section>
    </main>
  );
}
