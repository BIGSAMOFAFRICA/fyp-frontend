import axios from "../lib/axios";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";

const AdminStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("/analytics");
        setStats(res.data.analyticsData);
      } catch (err) {
        setError("Failed to fetch statistics");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="mb-8">Loading stats...</div>;
  if (error) return <div className="mb-8 text-red-500">{error}</div>;

  return (
    <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Users</CardTitle>
        </CardHeader>
        <CardContent>
          <span className="text-2xl font-bold text-emerald-400">{stats?.users ?? 0}</span>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Products</CardTitle>
        </CardHeader>
        <CardContent>
          <span className="text-2xl font-bold text-emerald-400">{stats?.products ?? 0}</span>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <span className="text-2xl font-bold text-emerald-400">{stats?.totalSales ?? 0}</span>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStats;
