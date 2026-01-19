// Auth.jsx (corrected with types)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, ArrowLeft, Palette } from 'lucide-react';
import { z } from 'zod';

const authSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password too short'),
  fullName: z.string().min(2, 'Name too short').optional(),
});

interface Errors {
  [key: string]: string | undefined;
}

const Auth = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [isForgot, setIsForgot] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});
  const { login, signup, forgotPassword } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateForm = () => {
    try {
      const data = isForgot ? { email } : isLogin ? { email, password } : { email, password, fullName };
      authSchema.parse(data);
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      if (isForgot) {
        await forgotPassword(email);
        setIsForgot(false);
        toast({ title: 'Reset link sent!', description: 'Check your email' });
      } else if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password, fullName);
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Operation failed';
      toast({ title: 'Error', description: message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-300 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-ghost/70 hover:text-blood mb-8">
          <ArrowLeft size={18} />
          Back to Home
        </button>

        <div className="bg-dark-100 border border-charcoal-200 rounded-lg p-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Palette className="text-blood" size={28} />
            <h1 className="text-2xl font-serif">Smarty<span className="text-blood">Art</span></h1>
          </div>

          <h2 className="text-xl text-center text-ghost mb-6">
            {isForgot ? 'Reset Password' : isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isForgot && !isLogin && (
              <div>
                <Label htmlFor="fullName" className="text-ghost">Full Name</Label>
                <Input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="bg-dark-200 border-charcoal-200 text-ghost mt-1" placeholder="Your name" />
                {errors.fullName && <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>}
              </div>
            )}

            <div>
              <Label htmlFor="email" className="text-ghost">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-dark-200 border-charcoal-200 text-ghost mt-1" placeholder="your@email.com" />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
            </div>

            {!isForgot && (
              <div>
                <Label htmlFor="password" className="text-ghost">Password</Label>
                <div className="relative mt-1">
                  <Input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="bg-dark-200 border-charcoal-200 text-ghost pr-10" placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ghost/50 hover:text-ghost">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full bg-blood hover:bg-blood/80 text-ghost">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-l-2 border-ghost"></span>
                  Processing...
                </span>
              ) : (
                isForgot ? 'Send Reset Link' : isLogin ? 'Sign In' : 'Create Account'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => isForgot ? setIsForgot(false) : setIsLogin(!isLogin)}
              className="text-ghost/70 hover:text-blood transition-colors text-sm"
            >
              {isForgot ? "Back to Login" : isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
            {!isForgot && isLogin && (
              <button
                onClick={() => setIsForgot(true)}
                className="text-ghost/70 hover:text-blood transition-colors text-sm ml-2"
              >
                Forgot password?
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
