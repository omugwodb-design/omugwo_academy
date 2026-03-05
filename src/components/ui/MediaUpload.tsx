import React, { useRef, useState } from 'react';
import { Upload, X, Loader2, Image as ImageIcon, FileText, Video as VideoIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { cn } from '../../lib/utils';

interface MediaUploadProps {
    value: string;
    onChange: (url: string) => void;
    className?: string;
    bucket?: string;
    folder?: string;
    placeholder?: string;
    type?: 'image' | 'video' | 'document';
    accept?: string;
}

export const MediaUpload: React.FC<MediaUploadProps> = ({
    value,
    onChange,
    className,
    bucket = 'assets',
    folder = 'general',
    placeholder = 'Upload File',
    type = 'image',
    accept
}) => {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate size (e.g., max 50MB)
        if (file.size > 50 * 1024 * 1024) {
            toast.error('File too large (max 50MB)');
            return;
        }

        setIsUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${folder}/${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;

            const { data, error } = await supabase.storage
                .from(bucket)
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) {
                // Fallback or throw
                console.error('Upload Error:', error);

                if (error.message.includes('Bucket not found') || error.message.includes('row-level security')) {
                    toast.error('Storage bucket not configured securely. Using local preview temporarily.', { duration: 4000 });
                    const objectUrl = URL.createObjectURL(file);
                    onChange(objectUrl);
                } else {
                    throw error;
                }
            } else if (data) {
                const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(fileName);
                onChange(publicData.publicUrl);
                toast.success('Upload complete');
            }

        } catch (err: any) {
            toast.error(err.message || 'Failed to upload file');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const clearImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange('');
    };

    const defaultAccept = type === 'image' ? 'image/*' : type === 'video' ? 'video/*' : '.pdf,.doc,.docx,.txt';

    return (
        <div className={cn("relative group border-2 border-dashed rounded-xl overflow-hidden transition-all duration-300",
            value ? "border-transparent bg-gray-50 dark:bg-gray-900" : "border-gray-300 dark:border-gray-700 hover:border-primary-500 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 cursor-pointer",
            className
        )}>
            {value ? (
                <div className="relative w-full h-full min-h-[160px] flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                    {type === 'image' && (
                        <img src={value} alt="Uploaded media" className="absolute inset-0 w-full h-full object-cover" />
                    )}
                    {type === 'video' && (
                        <video src={value} className="absolute inset-0 w-full h-full object-cover" controls={false} />
                    )}
                    {type === 'document' && (
                        <div className="flex flex-col items-center justify-center p-4">
                            <FileText className="w-12 h-12 text-primary-500 mb-2" />
                            <a href={value} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary-600 hover:underline max-w-full truncate px-4">
                                View Document
                            </a>
                        </div>
                    )}
                    <div className={cn(
                        "absolute inset-0 bg-black/40 transition-opacity flex items-center justify-center gap-2",
                        type === 'document' ? "opacity-100 bg-transparent top-auto bottom-4" : "opacity-0 group-hover:opacity-100"
                    )}>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="p-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 font-medium text-sm flex items-center gap-2 shadow-sm"
                        >
                            <Upload className="w-4 h-4" /> Change
                        </button>
                        <button
                            onClick={clearImage}
                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium text-sm shadow-sm"
                            title="Remove"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ) : (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center w-full h-full min-h-[160px] p-6 text-center"
                >
                    {isUploading ? (
                        <div className="flex flex-col items-center text-primary-600">
                            <Loader2 className="w-8 h-8 animate-spin mb-2" />
                            <span className="text-sm font-medium">Uploading...</span>
                        </div>
                    ) : (
                        <>
                            <div className="w-12 h-12 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mb-3">
                                {type === 'image' && <ImageIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />}
                                {type === 'video' && <VideoIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />}
                                {type === 'document' && <FileText className="w-6 h-6 text-primary-600 dark:text-primary-400" />}
                            </div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white mb-1">{placeholder}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                {type === 'image' ? 'SVG, PNG, JPG or GIF (max. 50MB)' : type === 'video' ? 'MP4, WebM or Ogg (max. 50MB)' : 'PDF, DOC, TXT (max. 50MB)'}
                            </span>
                        </>
                    )}
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept={accept || defaultAccept}
                onChange={handleFileChange}
                disabled={isUploading}
            />
        </div>
    );
};
