import { useUser } from "../../hooks/useUser";

const Profile = () => {
  const { user, loading, refetchUser } = useUser();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">User Profile</h1>
      
      {user ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-6">
            <div className="w-20 h-20 rounded-full overflow-hidden mr-4">
              <img 
                src={user.profile_image || "https://randomuser.me/api/portraits/men/1.jpg"} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              {user.phone_number && (
                <p className="text-gray-600">{user.phone_number}</p>
              )}
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="text-lg font-medium mb-2">Account Information</h3>
            {/* Add more user details here */}
          </div>
        </div>
      ) : (
        <p>No user data available. Please log in.</p>
      )}
    </div>
  );
};

export default Profile;
