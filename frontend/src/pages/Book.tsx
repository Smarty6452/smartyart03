import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Upload, X, CreditCard, Palette } from 'lucide-react';
import axios from 'axios';
import { z } from 'zod';

const bookingSchema = z.object({
  customerName: z.string().min(2).max(100),
  customerEmail: z.string().email(),
  customerPhone: z.string().optional(),
  projectDescription: z.string().min(10).max(1000),
  artType: z.string().min(1),
  artSize: z.string().optional(),
  deadline: z.string().optional(),
  paymentMethod: z.enum(['stripe', 'etransfer']).default('stripe'),
});

const artTypes = ['Charcoal Portrait', 'Digital Art', 'Pencil Sketch', 'Event Art', 'Custom Request'];
const artSizes = ['17 x 24.8 CM', '22.9 x 30.5 CM', '27.9 x 35.6 CM', 'A4 SIZE', 'Custom'];

interface FormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  projectDescription: string;
  artType: string;
  artSize: string;
  deadline: string;
  paymentMethod: 'stripe' | 'etransfer';
}

interface Errors {
  [key: string]: string | undefined;
}

const Book = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    projectDescription: '',
    artType: '',
    artSize: '',
    deadline: '',
    paymentMethod: 'stripe',
  });
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        customerName: user.fullName || '',
        customerEmail: user.email,
      }));
    }
  }, [user]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) {
    navigate('/auth');
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter(file => 
      file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024
    );
    
    if (validFiles.length !== selectedFiles.length) {
      toast({ 
        title: 'Invalid files', 
        description: 'Only images under 10MB are allowed', 
        variant: 'destructive' 
      });
    }
    
    setFiles(prev => [...prev, ...validFiles].slice(0, 5));
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const validateStep = (currentStep: number): boolean => {
    try {
      let schema;
      if (currentStep === 1) {
        schema = bookingSchema.pick({ 
          customerName: true, 
          customerEmail: true, 
          projectDescription: true, 
          artType: true 
        });
      } else {
        schema = bookingSchema;
      }
      schema.parse(formData);
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors = err.errors.reduce((acc: Errors, e) => {
          const field = e.path[0] as string;
          acc[field] = e.message;
          return acc;
        }, {});
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;
    setSubmitting(true);

    try {
      const formDataUpload = new FormData();
      
      // Append form fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataUpload.append(key, value);
      });
      
      // Append files
      files.forEach(file => {
        formDataUpload.append('files', file);
      });

      const res = await axios.post(`${import.meta.env.VITE_API_BASE}/bookings`, formDataUpload, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
      });
      
      // Redirect to Stripe Checkout if stripe
      if (res.data.stripeUrl) {
        window.location.href = res.data.stripeUrl;
      } else {
        toast({ title: 'Success', description: 'Booking created! Check email for e-Transfer instructions.' });
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error('Booking error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to create booking';
      toast({ 
        title: 'Booking Error', 
        description: errorMessage, 
        variant: 'destructive' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const goToNextStep = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    }
  };

  const goToPreviousStep = () => {
    setStep(prev => prev - 1);
  };

  return (
    <div className="min-h-screen bg-dark-300 text-ghost py-8">
      <div className="container max-w-2xl mx-auto px-4 md:px-0">
        <button 
          onClick={() => navigate('/dashboard')} 
          className="flex items-center gap-2 text-ghost/70 hover:text-blood transition-colors mb-8"
        >
          <ArrowLeft size={18} />
          <span>Back to Dashboard</span>
        </button>

        <div className="bg-dark-100 border border-charcoal-200 rounded-lg p-6 md:p-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Palette className="text-blood" size={28} />
            <h1 className="text-2xl font-serif">Book Custom Art</h1>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step >= s ? 'bg-blood text-ghost' : 'bg-charcoal-200 text-ghost/50'
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div className={`w-12 h-0.5 ${step > s ? 'bg-blood' : 'bg-charcoal-200'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Project Details */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-serif mb-4">Project Details</h2>
              
              <div>
                <Label className="text-ghost">Your Name *</Label>
                <Input
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  className="bg-dark-200 border-charcoal-200 text-ghost mt-1"
                  placeholder="Your full name"
                />
                {errors.customerName && <p className="text-red-400 text-sm mt-1">{errors.customerName}</p>}
              </div>

              <div>
                <Label className="text-ghost">Email *</Label>
                <Input
                  name="customerEmail"
                  type="email"
                  value={formData.customerEmail}
                  onChange={handleInputChange}
                  className="bg-dark-200 border-charcoal-200 text-ghost mt-1"
                  placeholder="your@email.com"
                />
                {errors.customerEmail && <p className="text-red-400 text-sm mt-1">{errors.customerEmail}</p>}
              </div>

              <div>
                <Label className="text-ghost">Phone (Optional)</Label>
                <Input
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleInputChange}
                  className="bg-dark-200 border-charcoal-200 text-ghost mt-1"
                  placeholder="+1 (234) 567-8900"
                />
              </div>

              <div>
                <Label className="text-ghost">Art Type *</Label>
                <select
                  name="artType"
                  value={formData.artType}
                  onChange={handleInputChange}
                  className="w-full mt-1 px-4 py-2 bg-dark-200 border border-charcoal-200 rounded-md text-ghost"
                >
                  <option value="">Select art type</option>
                  {artTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.artType && <p className="text-red-400 text-sm mt-1">{errors.artType}</p>}
              </div>

              <div>
                <Label className="text-ghost">Project Description *</Label>
                <Textarea
                  name="projectDescription"
                  value={formData.projectDescription}
                  onChange={handleInputChange}
                  className="bg-dark-200 border-charcoal-200 text-ghost mt-1"
                  rows={4}
                  placeholder="Describe what you'd like me to create..."
                />
                {errors.projectDescription && <p className="text-red-400 text-sm mt-1">{errors.projectDescription}</p>}
              </div>

              <Button
                onClick={goToNextStep}
                disabled={submitting}
                className="w-full bg-blood hover:bg-blood/80 mt-4"
              >
                Continue to Upload References
              </Button>
            </div>
          )}

          {/* Step 2: Reference Images */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-serif mb-4">Reference Images</h2>
              <p className="text-ghost/70 text-sm mb-4">
                Upload up to 5 reference images to help me understand your vision (optional).
              </p>

              <div className="border-2 border-dashed border-charcoal-200 rounded-lg p-8 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="mx-auto text-ghost/50 mb-2" size={32} />
                  <p className="text-ghost/70">Click to upload or drag and drop</p>
                  <p className="text-ghost/50 text-sm">PNG, JPG up to 10MB each</p>
                </label>
              </div>

              {files.length > 0 && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {files.map((file, index) => (
                    <div key={index} className="relative bg-dark-200 rounded-lg p-2">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded"
                      />
                      <button
                        onClick={() => removeFile(index)}
                        className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                      >
                        <X size={14} />
                      </button>
                      <p className="text-xs text-ghost/50 mt-1 truncate">{file.name}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-ghost">Size (Optional)</Label>
                  <select
                    name="artSize"
                    value={formData.artSize}
                    onChange={handleInputChange}
                    className="w-full mt-1 px-4 py-2 bg-dark-200 border border-charcoal-200 rounded-md text-ghost"
                  >
                    <option value="">Select size</option>
                    {artSizes.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label className="text-ghost">Deadline (Optional)</Label>
                  <Input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    className="bg-dark-200 border-charcoal-200 text-ghost mt-1"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <Button
                  variant="outline"
                  onClick={goToPreviousStep}
                  className="flex-1 border-charcoal-200 text-ghost"
                >
                  Back
                </Button>
                <Button
                  onClick={goToNextStep}
                  className="flex-1 bg-blood hover:bg-blood/80"
                >
                  Review Order
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Review & Pay */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-serif mb-4">Review & Pay Deposit</h2>
              
              <div className="bg-dark-200 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-ghost/70">Name:</span>
                  <span>{formData.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ghost/70">Email:</span>
                  <span>{formData.customerEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ghost/70">Art Type:</span>
                  <span>{formData.artType}</span>
                </div>
                {formData.artSize && (
                  <div className="flex justify-between">
                    <span className="text-ghost/70">Size:</span>
                    <span>{formData.artSize}</span>
                  </div>
                )}
                {formData.deadline && (
                  <div className="flex justify-between">
                    <span className="text-ghost/70">Deadline:</span>
                    <span>{formData.deadline}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-ghost/70">References:</span>
                  <span>{files.length} file(s)</span>
                </div>
              </div>

              <div>
                <Label className="text-ghost">Payment Method *</Label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  className="w-full mt-1 px-4 py-2 bg-dark-200 border border-charcoal-200 rounded-md text-ghost"
                >
                  <option value="stripe">Credit Card (Stripe)</option>
                  <option value="etransfer">Interac e-Transfer</option>
                </select>
                {errors.paymentMethod && <p className="text-red-400 text-sm mt-1">{errors.paymentMethod}</p>}
              </div>

              {formData.paymentMethod === 'stripe' ? (
                <div className="bg-blood/10 border border-blood/30 rounded-lg p-4 mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="text-blood" size={20} />
                    <span className="font-semibold">Deposit Required</span>
                  </div>
                  <p className="text-ghost/70 text-sm">
                    A $20 deposit is required to secure your booking. The remaining balance will be due upon completion.
                  </p>
                  <p className="text-2xl font-bold text-blood mt-2">$20.00 USD</p>
                </div>
              ) : (
                <div className="bg-blood/10 border border-blood/30 rounded-lg p-4 mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="text-blood" size={20} />
                    <span className="font-semibold">e-Transfer Instructions</span>
                  </div>
                  <p className="text-ghost/70 text-sm">
                    Send $20 deposit via Interac e-Transfer to admin@xdevverse.com. Include your booking ID in the message.
                  </p>
                  <p className="text-ghost/70 text-sm mt-2">
                    For more info, call 742-999-0414 or chat on WhatsApp.
                  </p>
                </div>
              )}

              <div className="flex gap-4 mt-6">
                <Button
                  variant="outline"
                  onClick={goToPreviousStep}
                  className="flex-1 border-charcoal-200 text-ghost"
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 bg-blood hover:bg-blood/80"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-l-2 border-ghost"></span>
                      Processing...
                    </span>
                  ) : formData.paymentMethod === 'stripe' ? (
                    <>
                      <CreditCard size={18} className="mr-2" />
                      Pay $20 Deposit
                    </>
                  ) : (
                    'Submit Booking'
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Book;