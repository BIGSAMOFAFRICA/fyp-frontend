import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const TransactionCheckPage = () => {
  const { reference } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkTransaction = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        const response = await axios.get(
          `http://localhost:5000/api/payments/check-transaction/${reference}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setTransaction(response.data);
        setError(null);
      } catch (err) {
        console.error('Error checking transaction:', err);
        setError(err.response?.data?.message || 'Error checking transaction');
      } finally {
        setLoading(false);
      }
    };

    if (reference) {
      checkTransaction();
    }
  }, [reference]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking transaction status...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-red-50 rounded-lg shadow-xl p-6 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
          <p className="text-red-500 mb-4">{error}</p>
          <Link
            to="/buyer/dashboard"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Transaction Status Check
          </h1>
          
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">Transaction Reference</h2>
            <p className="text-blue-600 font-mono text-lg">{reference}</p>
          </div>

          {transaction?.found ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 mb-2">✅ Transaction Found</h3>
                <p className="text-green-600">Type: {transaction.type}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-2">Status</h4>
                  <p className="text-gray-600">
                    {transaction.transaction.status || transaction.transaction.escrowStatus}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-2">Amount</h4>
                  <p className="text-gray-600">₦{transaction.transaction.totalAmount?.toLocaleString()}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-2">Product</h4>
                  <p className="text-gray-600">{transaction.transaction.productName || 'N/A'}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-2">Date</h4>
                  <p className="text-gray-600">
                    {new Date(transaction.transaction.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {transaction.transaction.confirmationCode && (
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">Confirmation Code</h4>
                  <p className="text-yellow-600 font-mono text-xl">
                    {transaction.transaction.confirmationCode}
                  </p>
                </div>
              )}

              <div className="flex space-x-4 pt-4">
                <Link
                  to="/buyer/dashboard"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-center"
                >
                  Go to Dashboard
                </Link>
                <Link
                  to="/"
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg text-center"
                >
                  Go Home
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">⚠️ Transaction Not Found in Database</h3>
                <p className="text-yellow-600">{transaction?.message}</p>
              </div>

              {transaction?.type === 'paystack_only' && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Paystack Data</h4>
                  <p className="text-blue-600">
                    Status: {transaction.paystackData?.data?.status}
                  </p>
                  <p className="text-blue-600">
                    Amount: ₦{transaction.paystackData?.data?.amount?.toLocaleString()}
                  </p>
                </div>
              )}

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">What to do:</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>• Check your dashboard for the order</li>
                  <li>• Wait a few minutes and refresh</li>
                  <li>• Contact support if you were charged</li>
                </ul>
              </div>

              <div className="flex space-x-4 pt-4">
                <Link
                  to="/buyer/dashboard"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-center"
                >
                  Check Dashboard
                </Link>
                <Link
                  to="/"
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg text-center"
                >
                  Go Home
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionCheckPage;

