import { useEffect, useState } from "react";
import API from "../services/api";
import EmployeeLayout from "../layouts/EmployeeLayout";

function EmployeeProfile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/employees/profile");
      setProfile(res.data);
    } catch (error) {
      console.error("PROFILE FETCH ERROR:", error);
    }
  };

  if (!profile) {
    return (
      <EmployeeLayout>
        <p className="text-center mt-10">Loading...</p>
      </EmployeeLayout>
    );
  }

  return (
    <EmployeeLayout>
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow max-w-xl">

        <div className="mb-4">
          <p className="text-gray-500">Name</p>
          <p className="font-semibold">{profile.name || "N/A"}</p>
        </div>

        <div className="mb-4">
          <p className="text-gray-500">Email</p>
          <p className="font-semibold">{profile.email}</p>
        </div>

        <div className="mb-4">
          <p className="text-gray-500">Phone</p>
          <p className="font-semibold">{profile.phone || "N/A"}</p>
        </div>

        <div className="mb-4">
          <p className="text-gray-500">Department</p>
          <p className="font-semibold">{profile.department || "N/A"}</p>
        </div>

        <div className="mb-4">
          <p className="text-gray-500">Designation</p>
          <p className="font-semibold">{profile.designation || "N/A"}</p>
        </div>

        <div className="mb-4">
          <p className="text-gray-500">Joining Date</p>
          <p className="font-semibold">
            {profile.joining_date
              ? new Date(profile.joining_date).toLocaleDateString()
              : "N/A"}
          </p>
        </div>

      </div>
    </EmployeeLayout>
  );
}

export default EmployeeProfile;