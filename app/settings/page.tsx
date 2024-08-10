"use client";
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updateUserProfile } from '@/services/user';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import AddUser from '@/components/addUser';
import { setUser } from '../store/userSlice';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
function isValidEmail(email:string) {
    // Regular expression for validating an email address
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
const updateSchema = z.object({
  name: z.string()
    .refine((str) => str.length === 0  || str.length>=3, "Name must be at least 2 characters")
    .optional(),
  username: z.string()
    .refine((str) => str.length === 0  || str.length>=3, "Username must be at least 3 characters")
    .optional(),
  email: z.string()
    .refine((str) => str.length === 0 || isValidEmail(str), "Invalid email address")
    ,
  password: z.string()
  .refine((str) => str.length === 0  || (str.length>=8 && str.length<=16), "Password must be between 8 to 16 characters")
  .optional(),
  avatar: z
    .any()
    .refine((file) => file?.length === 0 || file?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB`)
    .refine(
      (file) => file?.length === 0 || ACCEPTED_IMAGE_TYPES.includes(file?.[0]?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported"
    ).optional(),
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

type UpdateFormData = z.infer<typeof updateSchema>;

function Settings() {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UpdateFormData>({
    resolver: zodResolver(updateSchema),
  });
  
  const onSubmit = async (data: UpdateFormData) => {
    try {
        const formData = new FormData();
        let valid = false;
        if(data.name)
        formData.append('fullName', data.name), valid = true;
        if(data.username)
        formData.append('username', data.username), valid = true;
        if(data.email)
        formData.append('email', data.email), valid = true;
        if(data.password)
        formData.append('password', data.password), valid = true;
        if(data.avatar && data.avatar.length>0)
        formData.append('avatar', data.avatar[0]), valid = true; // Correctly append the avatar file
        if (data.coverImage && data.coverImage.length > 0) {
        formData.append('coverImage', data.coverImage[0]), valid = true; // Append the cover image if it exists
        }
        if(valid){
            const res = await updateUserProfile(formData);
            reset();
            setAvatarPreview(null);
            setCoverPreview(null);
            window.localStorage.setItem("user", JSON.stringify(res.data));
            router.replace('/home');
            dispatch(setUser(res.data));
        }
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
      <h2 className="text-2xl font-bold mb-6">Update account</h2>
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
      </form>
    </div>
  );
}

export default AddUser(Settings);