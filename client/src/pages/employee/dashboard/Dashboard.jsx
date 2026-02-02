export default function EmployeeDashboard() {
  const stats = [
    { label: "Total Tickets", value: "1,247" },
    { label: "Active Users", value: "348" },
    { label: "Avg Response Time", value: "2.4h" },
    { label: "Resolution Rate", value: "94%" },
  ];

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Employee Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>
    </>
  );
}
