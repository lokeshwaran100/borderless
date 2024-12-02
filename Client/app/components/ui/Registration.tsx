'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Wallet2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { signIn } from 'next-auth/react';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^\d{10}$/, 'Must be a 10-digit number'),
  recieveToken: z.enum(['USDC', 'USDT']),
});

export function RegistrationForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phone: '',
      recieveToken: 'USDC',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: values.name,
          phone: parseInt(values.phone),
          oktoId: 'default',
          recieveToken: values.recieveToken,
        }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }
      

      // Wait for Google sign-in to complete
      const result = await signIn("google", {
        redirect: false, 
        callbackUrl: '/' 
      });


      

    } catch (error) {
      console.error('Registration error:', error);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center mb-4">
          <Wallet2 className="h-12 w-12 text-primary" />
        </div>
        <CardTitle className="text-2xl text-center">Welcome to PayApp</CardTitle>
        <CardDescription className="text-center">
          Enter your details to get started
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="1234567890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="recieveToken"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Token</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select token" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="USDC">USDC</SelectItem>
                      <SelectItem value="USDT">USDT</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Connect With Google</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}