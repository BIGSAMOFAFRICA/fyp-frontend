// (Removed: AdminEscrowPage is deprecated. Admins do not have escrow dashboard access.)
          <span className="text-2xl font-bold text-blue-600">{stats.products}</span>
        </div>
        <div className="bg-white rounded shadow p-5 flex flex-col items-center">
          <span className="text-gray-500 text-sm">Total Revenue</span>
          <span className="text-2xl font-bold text-yellow-500">₦{stats.revenue}</span>
        </div>
      </div>
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-lg font-semibold text-emerald-600 mb-3">Escrow Transactions</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Buyer</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Seller</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {transactions.length ? (
              transactions.map((tx) => (
                <tr key={tx._id}>
                  <td className="px-4 py-2">{tx.buyerId?.name}</td>
                  <td className="px-4 py-2">{tx.sellerId?.name}</td>
                  <td className="px-4 py-2">{tx.productId?.name}</td>
                  <td className="px-4 py-2">₦{tx.amount}</td>
                  <td className="px-4 py-2">{tx.status}</td>
                  <td className="px-4 py-2">
                    {tx.status === "Holding" && (
                      <>
                        <button
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded mr-2 disabled:opacity-50"
                          onClick={() => handleAction(tx._id, "release")}
                          disabled={actionLoading === tx._id + "release"}
                        >
                          Release
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded disabled:opacity-50"
                          onClick={() => handleAction(tx._id, "refund")}
                          disabled={actionLoading === tx._id + "refund"}
                        >
                          Refund
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center text-gray-400 py-6">No transactions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminEscrowPage;
