import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { LogIn, AlertCircle } from 'lucide-react';
import logoSvg from '../assets/advantage-ceo-final.svg';
import { useAuth, UserRole } from '../context/AuthContext';

// Hardcoded user credentials
const USERS = [
  { email: 'ceo@company.com', password: 'password', role: 'CEO' as UserRole },
  { email: 'leader@company.com', password: 'password', role: 'LEADERSHIP TEAM' as UserRole },
  { email: 'pe@firm.com', password: 'password', role: 'PE & BOD' as UserRole }
];

// Login form schema
const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const [error, setError] = useState<string | null>(null);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { login } = useAuth();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    // Find user with matching credentials
    const user = USERS.find(
      (user) => user.email === values.email && user.password === values.password
    );

    if (user) {
      // Clear any previous errors
      setError(null);

      // Use the auth context to login
      login(user.email, user.role);

      // Show success toast
      toast({
        title: 'Login successful',
        description: `Welcome, ${user.role}`,
      });

      // Navigate to dashboard with a small delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-white to-neutral-100 py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="flex justify-center mb-8">
          <img src={logoSvg} alt="AdvantageCEO Logo" className="h-20 w-auto" />
        </div>
        
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center text-sm">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {error}
                  </div>
                )}
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your email" 
                          {...field}
                          autoComplete="email" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Enter your password" 
                          {...field}
                          autoComplete="current-password" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-1">
            <div className="text-xs text-center text-neutral-500">
              Demo Access:
            </div>
            <div className="text-xs text-center text-neutral-500">
              CEO: ceo@company.com | LEADERSHIP: leader@company.com | PE & BOD: pe@firm.com
            </div>
            <div className="text-xs text-center text-neutral-500">
              Password: "password" for all accounts
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;