// import { UserData } from "../../../hooks/useUser";
import { FiCreditCard, FiPlus, FiMoreHorizontal } from "react-icons/fi";

// interface PaymentSectionProps {
//   user: UserData;
// }

const PaymentSection = () => {
  // Mock payment methods data
  const paymentMethods = [
    {
      id: 1,
      type: "Visa",
      lastFour: "4242",
      expiryDate: "12/25",
      isDefault: true
    },
    {
      id: 2,
      type: "Mastercard",
      lastFour: "8888",
      expiryDate: "08/26",
      isDefault: false
    }
  ];

  // Mock transaction history
  const transactions = [
    {
      id: 1,
      date: "2024-01-15",
      description: "Hotel Booking - Grand Plaza",
      amount: "$299.00",
      status: "Completed"
    },
    {
      id: 2,
      date: "2024-01-10",
      description: "Flight Booking - NYC to LAX",
      amount: "$450.00",
      status: "Completed"
    },
    {
      id: 3,
      date: "2024-01-05",
      description: "Hotel Booking - Beach Resort",
      amount: "$189.00",
      status: "Refunded"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Payment Methods Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Payment Methods</h2>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <FiPlus className="w-4 h-4" />
            Add Payment Method
          </button>
        </div>

        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div key={method.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                  <FiCreditCard className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      {method.type} •••• {method.lastFour}
                    </span>
                    {method.isDefault && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">Expires {method.expiryDate}</p>
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <FiMoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction History Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Transaction History</h2>
          <button className="text-blue-600 hover:text-blue-700 font-medium">
            View All
          </button>
        </div>

        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">{transaction.description}</h3>
                <p className="text-sm text-gray-600">{transaction.date}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">{transaction.amount}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  transaction.status === "Completed" 
                    ? "bg-green-100 text-green-800"
                    : transaction.status === "Refunded"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
                }`}>
                  {transaction.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {transactions.length === 0 && (
          <div className="text-center py-8">
            <FiCreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No transactions found</p>
            <p className="text-sm text-gray-500">Your payment history will appear here</p>
          </div>
        )}
      </div>

      {/* Billing Information Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Billing Information</h2>
          <button className="text-blue-600 hover:text-blue-700 font-medium">
            Edit
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Billing Address
            </label>
            <p className="text-gray-500">Not Provided</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tax ID
            </label>
            <p className="text-gray-500">Not Provided</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSection;
