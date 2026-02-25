// import React, { useState } from "react";
import { useState } from "react";
import { GraduationCap } from "lucide-react";

export default function Login({onGoRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const canContinue = email.trim() !== "" && password.trim() !== "";

  const handleContinue = () => {
    if (!canContinue) {
      setError("Please fill email and password first.");
      return;
    }
    setError("");
    
  };

  return (
    <main className="min-h-screen bg-slate-200 flex items-center justify-center px-4 py-8">
      <section className="w-full max-w-sm bg-white rounded-2xl p-6">
        <div className="flex justify-center mb-5">
          <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
        </div>

        <h1 className="text-5xl font-bold text-center text-black mb-2">Welcome Back</h1>
        <p className="text-center text-gray-500 text-lg mb-6">
          Enter your credentials to access your account
        </p>

        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            handleContinue();
          }}
        >
          <div>
            <label htmlFor="email" className="block text-black font-semibold mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full h-11 bg-gray-100 rounded-xl px-4 outline-none"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-black font-semibold mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full h-11 bg-gray-100 rounded-xl px-4 outline-none"
            />
          </div>

          <button type="submit" className="w-full h-11 rounded-xl bg-black text-white font-semibold">
            Sign In
          </button>
        </form>

        {error && <p className="mt-3 text-center text-red-600 text-sm">{error}</p>}

        <p className="mt-5 text-center text-gray-600">
          Don&apos;t have an account?{" "}
          <button type="button" onClick={onGoRegister} className="text-blue-600">
            Register here
          </button>
        </p>

        <hr className="my-4 border-gray-200" />

        
      </section>
    </main>
  );
}
