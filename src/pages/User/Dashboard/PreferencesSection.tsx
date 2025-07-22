// import { UserData } from "../../../hooks/useUser";

// interface PreferencesSectionProps {
//   user: UserData;
// }

const PreferencesSection = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Travel Preferences</h2>
        <p className="text-gray-600">
          Customize your travel experience by setting your preferences.
        </p>
      </div>

      {/* Accommodation Preferences */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Accommodation Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Room Type</h4>
              <p className="text-sm text-gray-600">Preferred room configuration</p>
            </div>
            <select className="border border-gray-300 rounded-md px-3 py-2">
              <option>Single Room</option>
              <option>Double Room</option>
              <option>Suite</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Bed Type</h4>
              <p className="text-sm text-gray-600">Preferred bed configuration</p>
            </div>
            <select className="border border-gray-300 rounded-md px-3 py-2">
              <option>King Bed</option>
              <option>Queen Bed</option>
              <option>Twin Beds</option>
            </select>
          </div>
        </div>
      </div>

      {/* Flight Preferences */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Flight Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Seat Preference</h4>
              <p className="text-sm text-gray-600">Preferred seating location</p>
            </div>
            <select className="border border-gray-300 rounded-md px-3 py-2">
              <option>Window</option>
              <option>Aisle</option>
              <option>Middle</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Meal Preference</h4>
              <p className="text-sm text-gray-600">Dietary requirements</p>
            </div>
            <select className="border border-gray-300 rounded-md px-3 py-2">
              <option>Regular</option>
              <option>Vegetarian</option>
              <option>Vegan</option>
              <option>Halal</option>
              <option>Kosher</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Email Notifications</h4>
              <p className="text-sm text-gray-600">Receive booking confirmations and updates</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">SMS Notifications</h4>
              <p className="text-sm text-gray-600">Receive text message updates</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Save Preferences
        </button>
      </div>
    </div>
  );
};

export default PreferencesSection;
