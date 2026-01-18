import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  artType: string;
  artSize?: string;
  deadline?: string;
  projectDescription: string;
  paymentMethod: string;
  totalAmount?: number;
  status: string;
  createdAt: string;
  updatedAt?: string;
  notes?: string;
  referenceFiles?: string[];
  fullPaymentReceived?: boolean;
}

interface User {
  id: string;
  email: string;
  fullName: string;
  isAdmin: boolean;
  createdAt: string;
}

interface EditingState {
  total: { [key: string]: boolean };
  notes: { [key: string]: boolean };
  tempTotals: { [key: string]: number };
  tempNotes: { [key: string]: string };
}

const Admin: React.FC = () => {
  const { user, loading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [editing, setEditing] = useState<EditingState>({
    total: {},
    notes: {},
    tempTotals: {},
    tempNotes: {}
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if not admin
  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  // Fetch bookings and users
  useEffect(() => {
    if (user?.isAdmin) {
      fetchBookings();
      fetchUsers();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE}/admin/bookings`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setBookings(res.data);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to load bookings",
        variant: "destructive"
      });
    } finally {
      setLoadingBookings(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE}/admin/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUsers(res.data);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to load users",
        variant: "destructive"
      });
    } finally {
      setLoadingUsers(false);
    }
  };

  const updateBooking = async (id: string, data: { status: string; notes?: string }) => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_BASE}/admin/bookings/${id}`,
        data,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setBookings(prev => prev.map(b => b.id === id ? { ...b, ...res.data.booking } : b));
      setEditing(prev => ({
        ...prev,
        notes: { ...prev.notes, [id]: false }
      }));
      toast({ title: 'Updated successfully!' });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to update booking', variant: 'destructive' });
    }
  };

  const setTotalAmount = async (id: string, totalAmount: number) => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_BASE}/admin/bookings/${id}/total`,
        { totalAmount },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setBookings(prev => prev.map(b => b.id === id ? { ...b, totalAmount: res.data.totalAmount } : b));
      setEditing(prev => ({
        ...prev,
        total: { ...prev.total, [id]: false }
      }));
      toast({ title: 'Total amount set successfully!' });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to set total amount', variant: 'destructive' });
    }
  };

  const sendInvoice = async (id: string) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE}/admin/invoices/${id}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      toast({ title: 'Invoice sent!', description: res.data.message });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to send invoice', variant: 'destructive' });
    }
  };

  const toggleAdmin = async (id: string) => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_BASE}/admin/users/${id}/admin`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setUsers(prev => prev.map(u => u.id === id ? { ...u, isAdmin: res.data.isAdmin } : u));
      toast({ title: 'Admin status updated!' });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to update admin status', variant: 'destructive' });
    }
  };

  if (!user?.isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-dark-300 text-ghost py-8">
      <div className="container max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-serif mb-8">Admin Dashboard</h2>

        {/* Bookings Section */}
        <section className="mb-12">
          <h3 className="text-2xl font-serif mb-4">Bookings</h3>
          {loadingBookings ? (
            <div className="text-center py-8">Loading bookings...</div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-8 text-ghost/60">No bookings found</div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-charcoal-200">
              <table className="w-full text-left border-collapse min-w-max">
                <thead>
                  <tr className="bg-dark-100 border-b border-charcoal-200">
                    <th className="p-3 font-semibold">ID</th>
                    <th className="p-3 font-semibold">Customer</th>
                    <th className="p-3 font-semibold">Contact</th>
                    <th className="p-3 font-semibold">Art Details</th>
                    <th className="p-3 font-semibold">Payment</th>
                    <th className="p-3 font-semibold">Status</th>
                    <th className="p-3 font-semibold">Notes</th>
                    <th className="p-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(booking => (
                    <tr key={booking.id} className="border-b border-charcoal-200 hover:bg-dark-100/50">
                      <td className="p-3">
                        <div className="text-xs font-mono">{booking.id.substring(0, 8)}</div>
                        <div className="text-xs text-ghost/60">
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </div>
                      </td>

                      <td className="p-3">
                        <div className="font-medium">{booking.customerName}</div>
                        <div className="text-xs text-ghost/60">{booking.customerEmail}</div>
                      </td>

                      <td className="p-3">
                        <div className="text-sm">{booking.customerPhone || 'N/A'}</div>
                        <div className="text-xs text-ghost/60">{booking.paymentMethod}</div>
                      </td>

                      <td className="p-3">
                        <div className="font-medium">{booking.artType}</div>
                        <div className="text-xs text-ghost/60">
                          {booking.artSize && `Size: ${booking.artSize}`}
                          {booking.deadline && ` • Due: ${booking.deadline}`}
                        </div>
                        <div className="text-xs mt-1 max-w-xs truncate">
                          {booking.projectDescription}
                        </div>
                      </td>

                      <td className="p-3">
                        {booking.totalAmount ? (
                          <div>
                            <div className="font-semibold text-green-500">
                              ${booking.totalAmount.toFixed(2)}
                            </div>
                            <div className="text-xs text-ghost/60">
                              {booking.fullPaymentReceived ? 'Paid' : 'Deposit only'}
                            </div>
                          </div>
                        ) : editing.total[booking.id] ? (
                          <div className="flex gap-2">
                            <Input
                              type="number"
                              defaultValue={20}
                              min={20}
                              step={0.01}
                              onChange={(e) => setEditing(prev => ({
                                ...prev,
                                tempTotals: { ...prev.tempTotals, [booking.id]: parseFloat(e.target.value) }
                              }))}
                              className="w-24"
                            />
                            <Button
                              size="sm"
                              onClick={() => setTotalAmount(booking.id, editing.tempTotals[booking.id] || 20)}
                            >
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditing(prev => ({
                                ...prev,
                                total: { ...prev.total, [booking.id]: false }
                              }))}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditing(prev => ({
                              ...prev,
                              total: { ...prev.total, [booking.id]: true }
                            }))}
                          >
                            Set Total
                          </Button>
                        )}
                      </td>

                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          booking.status === 'completed' ? 'bg-green-500/20 text-green-500' :
                          booking.status === 'in_progress' ? 'bg-blue-500/20 text-blue-500' :
                          booking.status === 'deposit_paid' ? 'bg-yellow-500/20 text-yellow-500' :
                          booking.status === 'cancelled' ? 'bg-red-500/20 text-red-500' :
                          'bg-gray-500/20 text-gray-500'
                        }`}>
                          {booking.status.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="p-3 max-w-xs">
                        {editing.notes[booking.id] ? (
                          <div className="flex flex-col gap-2">
                            <Textarea
                              defaultValue={booking.notes || ''}
                              onChange={(e) => setEditing(prev => ({
                                ...prev,
                                tempNotes: { ...prev.tempNotes, [booking.id]: e.target.value }
                              }))}
                              className="min-h-[80px]"
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => updateBooking(booking.id, {
                                  status: booking.status,
                                  notes: editing.tempNotes[booking.id] || ''
                                })}
                              >
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setEditing(prev => ({
                                  ...prev,
                                  notes: { ...prev.notes, [booking.id]: false }
                                }))}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="text-sm truncate max-w-[200px]">
                              {booking.notes || 'No notes'}
                            </div>
                            <Button
                              size="sm"
                              variant="link"
                              className="p-0 h-auto"
                              onClick={() => setEditing(prev => ({
                                ...prev,
                                notes: { ...prev.notes, [booking.id]: true }
                              }))}
                            >
                              Edit
                            </Button>
                          </div>
                        )}
                      </td>

                      <td className="p-3">
                        <div className="flex flex-col gap-2 min-w-[140px]">
                          {booking.status === 'pending_deposit' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateBooking(booking.id, { status: 'deposit_paid' })}
                            >
                              Confirm Deposit
                            </Button>
                          )}
                          {booking.status !== 'in_progress' && booking.status !== 'completed' && (
                            <Button
                              size="sm"
                              onClick={() => updateBooking(booking.id, { status: 'in_progress' })}
                            >
                              Start Work
                            </Button>
                          )}
                          {booking.status === 'in_progress' && (
                            <Button
                              size="sm"
                              onClick={() => updateBooking(booking.id, { status: 'completed' })}
                            >
                              Mark Complete
                            </Button>
                          )}
                          {booking.status === 'completed' && !booking.fullPaymentReceived && booking.totalAmount && (
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => sendInvoice(booking.id)}
                            >
                              Send Invoice
                            </Button>
                          )}
                          {booking.status !== 'cancelled' && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => updateBooking(booking.id, { status: 'cancelled' })}
                            >
                              Cancel
                            </Button>
                          )}
                          {booking.referenceFiles && booking.referenceFiles.length > 0 && (
                            <div className="flex flex-col gap-1">
                              {booking.referenceFiles.map((file: string, i: number) => (
                                <a
                                  key={i}
                                  href={`${import.meta.env.VITE_API_BASE.replace('/api', '')}${file}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-400 hover:text-blue-300 text-xs underline"
                                >
                                  Reference {i + 1}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Users Section */}
        <section>
          <h3 className="text-2xl font-serif mb-4">Users</h3>
          {loadingUsers ? (
            <div className="text-center py-8">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-ghost/60">No users found</div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-charcoal-200">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-dark-100 border-b border-charcoal-200">
                    <th className="p-3 font-semibold">ID</th>
                    <th className="p-3 font-semibold">Email</th>
                    <th className="p-3 font-semibold">Full Name</th>
                    <th className="p-3 font-semibold">Admin</th>
                    <th className="p-3 font-semibold">Created</th>
                    <th className="p-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} className="border-b border-charcoal-200 hover:bg-dark-100/50">
                      <td className="p-3">
                        <div className="text-xs font-mono">{user.id.substring(0, 8)}</div>
                      </td>
                      <td className="p-3">{user.email}</td>
                      <td className="p-3">{user.fullName}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          user.isAdmin ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'
                        }`}>
                          {user.isAdmin ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="p-3">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="p-3">
                        <Button
                          size="sm"
                          variant={user.isAdmin ? 'destructive' : 'default'}
                          onClick={() => toggleAdmin(user.id)}
                        >
                          {user.isAdmin ? 'Revoke Admin' : 'Make Admin'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Admin;