import { UserData } from "../../../hooks/useUser";

interface ProfileSectionProps {
  user: UserData;
}

const ProfileSection = ({ user }: ProfileSectionProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Basic Information Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
          <button className="text-blue-600 hover:text-blue-700 font-medium">
            Edit
          </button>
        </div>
        <p className="text-gray-600 mb-6">
          Make Sure This Information Matches Your Travel ID, Like Your Passport Or License.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <p className="text-gray-900">{user.name}</p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Contact</h2>
          <button className="text-blue-600 hover:text-blue-700 font-medium">
            Edit
          </button>
        </div>
        <p className="text-gray-600 mb-6">
          Receive Account Activity Alerts And Trip Updates By Sharing This Information.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mobile Number
            </label>
            <p className="text-gray-500">{user.phone_number || "Not Provided"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <p className="text-gray-900">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
