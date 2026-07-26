'use client';
import { uploadReplay } from '@/app/actions';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/navigation';

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB

export function FileUpload() {
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/x-osu-replay': ['.osr'],
    },
    maxSize: MAX_FILE_SIZE,
    multiple: false,
    disabled: isUploading,
  
    onDrop: async (acceptedFiles, rejectedFiles) => {
      setError(null);

      // react-dropzone rejected the file
      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        setError(rejection.errors[0]?.message || 'File upload failed');
        return;
      }

      const file = acceptedFiles[0];
      if (!file) return;

      setIsUploading(true);

      try {
        const formData = new FormData();
        formData.append('file', file);

        const results = await uploadReplay(formData);

        if (!results.success) {
          setError(results.error);
          return;
        }

        router.push(`/scores/${results.id}`);
      } catch (err) {
        console.error(err);
        setError('Something went wrong. Please try again.');
      } finally {
        setIsUploading(false);
      }
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`
        flex min-h-64 w-full cursor-pointer flex-col items-center justify-center
        rounded-xl border-2 border-dashed p-8
        transition-colors
        ${isDragActive
          ? "border-blue-400/70 bg-blue-950/30"
          : "border-gray-500/40 bg-[#251e22] hover:border-gray-400/50 hover:bg-[#2d252a]"
        }
      `}
    >
      <input {...getInputProps()} />

      {isUploading ? (
        <p className="text-sm font-medium text-gray-200">Uploading...</p>
      ) : isDragActive ? (
        <p className="text-sm font-medium text-blue-400">
          Drop the file here...
        </p>
      ) : (
        <>
          <p className="text-sm font-medium text-gray-200">
            Drag & drop a file here
          </p>
          <p className="mt-1 text-sm text-gray-500">
            or click to select a file
          </p>
        </>
      )}

      {error && (
        <p className="mt-3 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}