import React, { useEffect, useState } from "react";

const DriverProfile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://driver-service-3k84.onrender.com/api/drivers/profile/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setProfile(data);
        } else {
          setError(data.message || "Failed to load profile");
        }
      } catch (err) {
        setError("Error fetching profile");
      }
    };

    fetchProfile();
  }, []);

  if (error)
    return (
      <div className="max-w-md mx-auto mt-10 p-4 bg-red-100 text-red-600 rounded shadow">
        <p>{error}</p>
      </div>
    );

  if (!profile)
    return (
      <div className="max-w-md mx-auto mt-10 p-4 text-center text-gray-600">
        <p>Loading...</p>
      </div>
    );

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold text-center text-blue-600 mb-6">
        Driver Profile
      </h2>
      <div className="space-y-4">
        <ProfileField label="Name" value={profile.name} />
        <ProfileField label="Email" value={profile.email} />
        <ProfileField label="NIC" value={profile.nic} />
        <ProfileField label="Address" value={profile.address} />
        <ProfileField label="Age" value={profile.age} />
        <ProfileField label="Gender" value={profile.gender} />
      </div>
    </div>
  );
};

const ProfileField = ({ label, value }) => (
  <div className="flex justify-between border-b pb-2">
    <span className="font-medium text-gray-700">{label}:</span>
    <span className="text-gray-900">{value}</span>
  </div>
);

export default DriverProfile;
