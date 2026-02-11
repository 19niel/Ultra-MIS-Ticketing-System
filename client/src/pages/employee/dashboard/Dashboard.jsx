import React, { useEffect, useState } from 'react';

const EmployeeDashboard = () => {
  const [user, setUser] = useState(null);
  const [greeting, setGreeting] = useState("Welcome");

  useEffect(() => {
    // 1. Retrieve user data from sessionStorage
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // 2. Set time-based greeting
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  if (!user) return <div className="p-8 text-center">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Welcome Header */}
      <header className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {greeting}, {user.first_name}! 👋
            </h1>
            <p className="text-gray-500 mt-1">
              {user.position} | Employee ID: <span className="font-mono text-blue-600">{user.employee_id}</span>
            </p>
          </div>
          <div className="bg-blue-100 p-3 rounded-full">
            <div className="w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-full text-xl font-bold">
              {user.first_name[0]}{user.last_name[0]}
            </div>
          </div>
        </div>
      </header>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
          <h3 className="text-sm font-semibold text-gray-500 uppercase">My Open Tickets</h3>
          <p className="text-2xl font-bold text-gray-800">12</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
          <h3 className="text-sm font-semibold text-gray-500 uppercase">Resolved Today</h3>
          <p className="text-2xl font-bold text-gray-800">8</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500">
          <h3 className="text-sm font-semibold text-gray-500 uppercase">Tickets Created</h3>
          <p className="text-2xl font-bold text-gray-800">4</p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;

