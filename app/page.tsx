"use client"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import axios from "axios";  
import { useState, useEffect } from "react";
import Logout from "./logout";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  Email: z.string().email().min(2).max(50),
  password: z.string().min(2).max(50),
});

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Email: "",
      password: "",
    },
  });

  useEffect(() => {
    window.history.replaceState(null, '', '/Login');
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      setIsLoggedIn(true);
    }
  }, []);

 
  

  const handleError = (status: number, data: any) => {
    switch (status) {
      case 400:
        return 'Bad Request: Please check your input.';
      case 401:
        return 'Unauthorized: Please check your credentials.';
      case 403:
        return 'Forbidden: You do not have permission to access this resource.';
      case 404:
        return 'Not Found: The requested resource could not be found.';
      case 500:
        return 'Server Error: Please try again later.';
      default:
        return `Error: ${status} - ${data}`; 
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) { 
    try {
      const response = await axios.post('https://demo-server.gawx.ai/api/token/', {
        email: values.Email,
        password: values.password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(response.data);
      const accessToken = response.data.access;
      const refreshToken = response.data.refresh;
  
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
  
      setIsLoggedIn(true); 
      window.location.href = '/Login'; 
      window.location.href = '/';
      
     
      
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const message = handleError(error.response.status, error.response.data);
        alert(message);
      } else if (axios.isAxiosError(error) && error.request) {
        console.error('No response received:', error.request);
        alert('Network error: Please check your connection.');
      } else {
        console.error('Unexpected error:', error);
        alert('An unexpected error occurred.');
      }
    }
  }

  return (  
    <div>
      {!isLoggedIn ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-96 mx-auto mt-40">
            <FormField
              control={form.control}
              name="Email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
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
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Login</Button>
          </form>
        </Form>
      ) : (
        <Logout />
      )}
    </div>
  );
};

export default Home;
