export default function Profile() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-sm text-gray-500">
          View and manage your account information
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row gap-6">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-24 h-24 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-3xl font-bold">
            AD
          </div>
          <button className="text-sm text-blue-600 hover:underline">
            Change Photo
          </button>
        </div>

        {/* User Info */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ProfileField label="Employee ID" value="02223325" />
          <ProfileField label="Full Name" value="Nathaniel Talag" />
          <ProfileField label="Email" value="admin@ubix.com.ph" />
          <ProfileField label="Position" value="Programmer" />
          <ProfileField label="Department" value="MIS" />
          <ProfileField label="Role" value="Admin" />
          <ProfileField label="Status" value="Active" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Edit Profile
        </button>
        <button className="px-4 py-2 border rounded hover:bg-gray-100">
          Change Password
        </button>
      </div>
    </div>
  );
}

function ProfileField({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
