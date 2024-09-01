import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from 'sonner';
import { useSupabaseAuth } from '../integrations/supabase';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const Login = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const { signIn, signUp } = useSupabaseAuth();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleSubmit = async (values) => {
    try {
      if (isLogin) {
        await signIn(values.email, values.password);
        toast.success('Logged in successfully!');
      } else {
        await signUp(values.email, values.password);
        toast.success('Signed up successfully! Please check your email to confirm your account.');
      }
      onClose();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="bg-card border-2 border-primary p-6 rounded-lg shadow-lg relative max-w-md w-full" style={{ filter: 'none', pointerEvents: 'auto' }}>
      <Button
        onClick={onClose}
        className="absolute top-2 right-2 text-primary hover:text-accent"
        variant="ghost"
      >
        <X size={24} />
      </Button>
      <h2 className="text-2xl font-bold mb-4 text-primary">{isLogin ? 'Login' : 'Sign Up'}</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" className="bg-background text-foreground border-input" />
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
                  <Input type="password" {...field} className="bg-background text-foreground border-input" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            {isLogin ? 'Login' : 'Sign Up'}
          </Button>
        </form>
      </Form>
      <Button
        onClick={() => setIsLogin(!isLogin)}
        className="w-full mt-4 bg-secondary text-secondary-foreground hover:bg-secondary/80"
      >
        {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Login'}
      </Button>
    </div>
  );
};

export default Login;
