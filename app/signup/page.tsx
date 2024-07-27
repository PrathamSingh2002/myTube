"use client";
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signUpService } from '@/services/user';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import AddUser from '@/components/addUser';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  avatar: z
    .any()
    .refine((file) => file?.length === 1, "Avatar is required")
    .refine((file) => file?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.[0]?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported"
    ),
  coverImage: z
    .any()
    .refine(
      (file) => file?.length === 0 || file?.[0]?.size <= MAX_FILE_SIZE,
      `Max file size is 5MB`
    )
    .refine(
      (file) =>
        file?.length === 0 || ACCEPTED_IMAGE_TYPES.includes(file?.[0]?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported"
    )
    .optional(),
});

type SignupFormData = z.infer<typeof signupSchema>;

function Signup() {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });
  
  const onSubmit = async (data: SignupFormData) => {
    try {
      const formData = new FormData();
      formData.append('fullName', data.name);
      formData.append('username', data.username);
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('avatar', data.avatar[0]); // Correctly append the avatar file
      if (data.coverImage && data.coverImage.length > 0) {
        formData.append('coverImage', data.coverImage[0]); // Append the cover image if it exists
      }

      await signUpService(formData);
      router.replace('/login')
      reset();
      setAvatarPreview(null);
      setCoverPreview(null);
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6">Sign Up</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1">Name</label>
          <input
            id="name"
            {...register('name')}
            className="w-full px-3 py-2 border rounded"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="username" className="block mb-1">Username</label>
          <input
            id="username"
            {...register('username')}
            className="w-full px-3 py-2 border rounded"
          />
          {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block mb-1">Email</label>
          <input
            id="email"
            type="email"
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

        <div>
          <label htmlFor="avatar" className="block mb-1">Avatar</label>
          <input
            id="avatar"
            type="file"
            accept="image/*"
            {...register('avatar')}
            onChange={(e) => handleFileChange(e, setAvatarPreview)}
            className="w-full px-3 py-2 border rounded"
          />
          {errors.avatar && <p className="text-red-500 text-sm mt-1">{errors.avatar.message as string}</p>}
          {avatarPreview && <img src={avatarPreview} alt="Avatar preview" className="mt-2 w-24 h-24 object-cover rounded" />}
        </div>

        <div>
          <label htmlFor="coverImage" className="block mb-1">Cover Image (Optional)</label>
          <input
            id="coverImage"
            type="file"
            accept="image/*"
            {...register('coverImage')}
            onChange={(e) => handleFileChange(e, setCoverPreview)}
            className="w-full px-3 py-2 border rounded"
          />
          {errors.coverImage && <p className="text-red-500 text-sm mt-1">{errors.coverImage.message as string}</p>}
          {coverPreview && <img src={coverPreview} alt="Cover preview" className="mt-2 w-full h-32 object-cover rounded" />}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isSubmitting ? 'Signing Up...' : 'Sign Up'}
        </button>
        <div className="mt-6 text-center">
          <p>Already have an account? <a href="/login" className="text-blue-500 hover:underline">Sign up</a></p>
        </div>
      </form>
    </div>
  );
}

export default AddUser(Signup);