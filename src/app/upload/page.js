'use client'; 

import { useState, useEffect } from 'react';
import AWS from 'aws-sdk';
import Image from "next/image";
import { supabase } from '../supabase'
import { useRouter } from 'next/navigation';

export default function Home() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [tags, setTags] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [showAddNewTag, setShowAddNewTag] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [isUploaded, setIsUploaded] = useState(false);
  const [s3Url, setS3Url] = useState('');
  const [error, setError] = useState('');

  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return;
      }
    }
    
    checkUser();
  }, [router])

  const handlePostImage = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return;
      }


      
      console.log('Attempting insert' );

      const { data, error } = await supabase
        .from('image')
        .insert({
          userid: user.id,
          url: s3Url,
          tags: tags,
        });

      if (error) {
        console.error('Insert error:', error);
        throw error;
      }

      console.log('Insert successful:', data);
      router.push('/dashboard');
    } catch (err) {
      console.error('Full error:', err);
      setError(err.message || 'Failed to save image');
    }
  }

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      setFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const uploadToS3AndBackend = async (e) => {
    const file = e.target.files[0];

    if (file) {
      setFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }


    if (!file) return;
    
    setIsUploading(true);
    
    AWS.config.update({
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
      region: process.env.NEXT_PUBLIC_AWS_REGION
    });

    const s3 = new AWS.S3();

    try {
      const s3Upload = await s3.upload({
        Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
        Key: `uploads/${Date.now()}-${file.name}`,
        Body: file,
        ContentType: file.type,
      }).promise();

      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: s3Upload.Location,
          key: s3Upload.Key,
          bucket: s3Upload.Bucket,
          filename: file.name,
          type: file.type
        })
      });

      const data = await response.json();
      setIsUploaded(true);
      setTags(data.tags);
      setS3Url(s3Upload.Location);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && newTag.trim()) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
      setShowAddNewTag(false);
    }
  };

  const handleDeleteTag = (indexToDelete) => {
    setTags(tags.filter((_, index) => index !== indexToDelete));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">
          Image Tagger
        </h1>

        <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-6 md:p-8">
          <form onDragEnter={handleDrag} className="space-y-8">
            {/* File Upload Area */}
            <div 
              className={`
                relative border-2 border-dashed rounded-xl p-8
                transition-all duration-300 ease-in-out
                ${dragActive ? 'border-blue-500 bg-blue-50/50' : 'border-gray-300 hover:border-blue-400'}
                ${file ? 'bg-gray-50/50' : 'bg-white/50'}
                group
              `}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                onChange={uploadToS3AndBackend}
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              <div className="text-center">
                {!file ? (
                  <>
                    <div className="mx-auto w-16 h-16 mb-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full p-3 shadow-lg group-hover:scale-110 transition-transform">
                      <svg className="w-full h-full text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-600 font-medium">Drop your image here, or click to browse</p>
                    <p className="text-gray-400 text-sm mt-2">Supported formats: JPG, PNG, GIF</p>
                  </>
                ) : (
                  <div className="relative aspect-video max-h-[400px] overflow-hidden rounded-xl shadow-lg">
                    <img 
                      src={previewUrl}
                      alt="Preview"
                      className="object-contain w-full h-full"
                    />
                    {isUploading && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </form>

          {/* Tags Display */}
          {tags.length > 0 && (
            <div className="mt-8 p-6 bg-white/50 backdrop-blur rounded-xl border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                Detected Tags
              </h2>
              <div className="flex flex-wrap gap-2 items-center">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-4 py-1.5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 rounded-full text-sm font-medium hover:from-blue-500/20 hover:to-purple-500/20 transition-all duration-300 group relative flex items-center gap-2"
                  >
                    {tag}
                    <button
                      onClick={() => handleDeleteTag(index)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500"
                      aria-label="Delete tag"
                    >
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                      </svg>
                    </button>
                  </span>
                ))}
                
                {showAddNewTag ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={handleAddTag}
                      placeholder="Type and press Enter"
                      className="px-4 py-1.5 bg-white border border-gray-200 text-gray-800 rounded-full text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                      autoFocus
                    />
                    <button
                      onClick={() => setShowAddNewTag(false)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAddNewTag(true)}
                    className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                    </svg>
                    Add tag
                  </button>
                )}
              </div>
            </div>
          )}

          {isUploaded && (
            <button
              className="mt-8 w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl text-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              onClick={handlePostImage}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Post Image
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
