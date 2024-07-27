"use client";
import React, { useState,useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { publishVideo } from '@/services/video';
import AddUser from '@/components/addUser';

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB for video

const ACCEPTED_VIDEO_TYPES = [
  "video/mp4",
  "video/mpeg",
  "video/quicktime",
  "video/x-msvideo",
  "video/x-ms-wmv",
  "video/x-matroska",
  "video/webm",
  "video/x-flv",
  "video/3gpp",
  "video/x-m4v",
  "video/ogg",
  "video/avi",
  "application/x-troff-msvideo",
  "video/msvideo"
];

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const uploadSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  videoFile: z
    .any()
    .refine((file) => file?.length === 1, "Video is required")
    .refine((file) => file?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 100MB`)
    .refine(
      (file) => {
        if (!file?.[0]) return false;
        const fileType = file[0].type;
        const fileName = file[0].name.toLowerCase();
        return ACCEPTED_VIDEO_TYPES.includes(fileType) || 
               fileName.endsWith('.avi') ||
               fileName.endsWith('.mp4') ||
               fileName.endsWith('.mov') ||
               fileName.endsWith('.wmv') ||
               fileName.endsWith('.mkv') ||
               fileName.endsWith('.webm') ||
               fileName.endsWith('.flv') ||
               fileName.endsWith('.3gp') ||
               fileName.endsWith('.m4v') ||
               fileName.endsWith('.ogg');
      },
      "Please upload a valid video file. Most major video formats are supported."
    ),
  thumbnail: z
    .any()
    .refine((file) => file?.length === 1, "Thumbnail is required")
    .refine((file) => file?.[0]?.size <= 5 * 1024 * 1024, `Max file size for thumbnail is 5MB`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.[0]?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported for thumbnail"
    ),
});

type UploadFormData = z.infer<typeof uploadSchema>;

function Upload() {
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const router = useRouter();
  useEffect(() => {
    return () => {
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }
    };
  }, [videoPreview]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
  });

  const onSubmit = async (data: UploadFormData) => {
    setUploadStatus('loading');
    setStatusMessage('Uploading video...');
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      if (data.description) formData.append('description', data.description);
      formData.append('videoFile', data.videoFile[0]);
      formData.append('thumbnail', data.thumbnail[0]);
        await publishVideo(formData);
      setUploadStatus('success');
      setStatusMessage('Video uploaded successfully!');
      // Optionally redirect or update UI
      // router.push('/videos');
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      setStatusMessage('Failed to upload video. Please try again.');
    }
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>,
    isVideo: boolean = false
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (isVideo) {
        setPreview(URL.createObjectURL(file));
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-center">Upload Video</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            id="title"
            {...register('title')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.title && <p className="mt-2 text-sm text-red-600">{errors.title.message}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description (Optional)</label>
          <textarea
            id="description"
            {...register('description')}
            rows={3}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
            <label htmlFor="videoFile" className="block text-sm font-medium text-gray-700">Video File</label>
            <input
                id="videoFile"
                type="file"
                accept="video/*,.avi"
                {...register('videoFile')}
                onChange={(e) => handleFileChange(e, setVideoPreview, true)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.videoFile && <p className="mt-2 text-sm text-red-600">{errors.videoFile.message as string}</p>}
            {videoPreview && (
                <video controls className="mt-4 w-full max-h-64 object-contain">
                <source src={videoPreview} />
                Your browser does not support the video tag.
                </video>
            )}
        </div>

        <div>
          <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700">Thumbnail</label>
          <input
            id="thumbnail"
            type="file"
            accept="image/*"
            {...register('thumbnail')}
            onChange={(e) => handleFileChange(e, setThumbnailPreview)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.thumbnail && <p className="mt-2 text-sm text-red-600">{errors.thumbnail.message as string}</p>}
          {thumbnailPreview && <img src={thumbnailPreview} alt="Thumbnail preview" className="mt-4 w-full max-h-64 object-contain" />}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || uploadStatus === 'loading'}
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 transition duration-200"
        >
          {isSubmitting || uploadStatus === 'loading' ? 'Uploading...' : 'Upload Video'}
        </button>

        {uploadStatus !== 'idle' && (
          <div className={`mt-4 p-4 rounded-md ${uploadStatus === 'success' ? 'bg-green-100 text-green-700' : uploadStatus === 'error' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
            {statusMessage}
          </div>
        )}
      </form>
    </div>
  );
}
export default AddUser(Upload);