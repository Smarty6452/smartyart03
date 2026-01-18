// Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut, Plus, Clock, CheckCircle, XCircle, Palette, Home } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

const statusIcons = {
  pending: <Clock className="text-yellow-500" size={18} />,
  deposit_paid: <CheckCircle className="text-blue-500" size={18} />,
  in_progress: <Clock className="text-orange-500" size={18} />,
  completed: <CheckCircle className="text-green-500" size={18} />,
  cancelled: <XCircle className="text-red-500" size={18} />,
  payment_completed: <CheckCircle className="text-green-500" size={18} />,
};

const Dashboard = () => {
  const { user, loading, signOut } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) navigate('/auth');
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      axios.get(`${import.meta.env.VITE_API_BASE}/bookings`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
        .then(res => setBookings(res.data))
        .catch(() => toast({ title: 'Error', description: 'Failed to load bookings', variant: 'destructive' }))
        .finally(() => setLoadingBookings(false));
    }
  }, [user, toast]);

  return (
    <div className="min-h-screen bg-dark-300 text-ghost">
      <header className="bg-dark-100 border-b border-charcoal-200 py-4">
        <div className="container flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Palette className="text-blood" size={24} />
            <h1 className="text-xl font-serif">Smarty<span className="text-blood">Art</span></h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/')} className="text-ghost/70 hover:text-ghost">
              <Home size={18} className="mr-2" /> Home
            </Button>
            <Button variant="ghost" onClick={signOut} className="text-ghost/70 hover:text-ghost">
              <LogOut size={18} className="mr-2" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-serif mb-2">Dashboard</h2>
            <p className="text-ghost/70 text-sm md:text-base">Welcome, {user?.email}</p>
          </div>
          <Button onClick={() => navigate('/book')} className="bg-blood hover:bg-blood/80">
            <Plus size={18} className="mr-2" /> New Booking
          </Button>
        </div>

        <div className="bg-dark-100 border border-charcoal-200 rounded-lg overflow-x-auto">  
          <div className="p-4 border-b border-charcoal-200">
            <h3 className="text-lg font-serif">Bookings</h3>
          </div>
          {loadingBookings ? <div>Loading...</div> : bookings.length === 0 ? <div>No bookings</div> : (
            <table className="w-full min-w-max">
              <thead>
                <tr className="border-b border-charcoal-200">
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Type</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(booking => (
                  <tr key={booking.id} className="hover:bg-dark-200">
                    <td className="p-4">{booking.customerName}</td>
                    <td className="p-4">{booking.artType}</td>
                    <td className="p-4">{statusIcons[booking.status]} {booking.status.replace('_', ' ')}</td>
                    <td className="p-4">{new Date(booking.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;