"use client"
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { loginUserService } from '@/services/user';
import { setUser } from '../store/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import AddUser from '@/components/addUser';
const loginSchema = z.object({
  email: z.string().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

function Login() {
  const [loginError, setLoginError] = useState<string | null>(null);
    const dispatch = useDispatch();
    const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
        setLoginError(null);
        // Simulate API call
        const formData = {
            'email': data.email,
            'password': data.password
        }
        const res = await loginUserService(formData);
        if(res.data && res.data.user && res.data.accessToken){
            window.localStorage.setItem('user', JSON.stringify(res.data.user));
            window.localStorage.setItem('accessToken', JSON.stringify(res.data.accessToken));
            window.localStorage.setItem('refreshToken', JSON.stringify(res.data.refreshToken));
            dispatch(setUser(res.data.user));
            router.replace('/home')
        }
    } catch (error) {
      // Handle login error
      setLoginError("Invalid email or password");
    }
  };
  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6">Log In</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="emailOrUsername" className="block mb-1">Email or Username</label>
          <input
            id="emailOrUsername"
            {...register('email')}
            className="w-full px-3 py-2 border rounded"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block mb-1">Password</label>
          <input
            id="password"
            type="password"
            {...register('password')}
            className="w-full px-3 py-2 border rounded"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>

        {loginError && <p className="text-red-500 text-sm">{loginError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isSubmitting ? 'Logging In...' : 'Log In'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p>Don't have an account? <a href="/signup" className="text-blue-500 hover:underline">Sign up</a></p>
      </div>
    </div>
  );
}

export default AddUser(Login);