// Modified Frontend: src/pages/PaymentSuccess.jsx (Full Complete Code - Removed PATCH)
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingId = searchParams.get('booking_id');
  const sessionId = searchParams.get('session_id');

  // No PATCH call - webhook handles status and emails asynchronously
  // You can add a polling mechanism if needed, but for now, trust the webhook

  return (
    <div className="min-h-screen bg-dark-300 flex items-center justify-center p-4">
      <div className="bg-dark-100 border border-charcoal-200 rounded-lg p-8 max-w-md text-center">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="text-green-500" size={32} />
        </div>
        
        <h1 className="text-2xl font-serif text-ghost mb-4">Payment Successful!</h1>
        
        <p className="text-ghost/70 mb-6">
          Your $20 deposit has been received. Your art commission booking is now confirmed!
          I'll start working on your project soon.
        </p>

        <p className="text-ghost/50 text-sm mb-6">
          You'll receive an email confirmation shortly with your booking details.
        </p>

        <Button
          onClick={() => navigate('/dashboard')}
          className="bg-blood hover:bg-blood/80"
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default PaymentSuccess;