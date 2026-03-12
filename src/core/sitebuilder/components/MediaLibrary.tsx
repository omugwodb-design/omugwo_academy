// Asset Management System with Media Library
import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { cn } from '../../../lib/utils';
import { useEditorStore } from '../store/editor-store';
import {
  Image,
  Video,
  FileText,
  Music,
  File,
  Upload,
  Search,
  Grid,
  List,
  Trash2,
  Download,
  Copy,
  ExternalLink,
  MoreHorizontal,
  FolderOpen,
  Folder,
  Plus,
  X,
  Check,
  Filter,
  SortAsc,
  SortDesc,
  RefreshCw,
  Cloud,
  HardDrive,
} from 'lucide-react';

// Asset types
export type AssetType = 'image' | 'video' | 'audio' | 'document' | 'other';

// Asset interface
export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  url: string;
  thumbnail?: string;
  size: number; // bytes
  width?: number;
  height?: number;
  duration?: number; // for video/audio
  mimeType: string;
  alt?: string;
  tags: string[];
  folderId: string | null;
  createdAt: string;
  updatedAt: string;
  source: 'local' | 'cloud' | 'external';
  metadata?: Record<string, any>;
}

// Folder interface
export interface AssetFolder {
  id: string;
  name: string;
  parentId: string | null;
  color?: string;
  createdAt: string;
}

// Upload status
export interface UploadStatus {
  id: string;
  name: string;
  progress: number;
  status: 'pending' | 'uploading' | 'complete' | 'error';
  error?: string;
}

// Asset type configurations
const ASSET_TYPE_CONFIG: Record<AssetType, { icon: React.FC<{ className?: string }>; color: string; accept: string }> = {
  image: { icon: Image, color: 'text-green-500', accept: 'image/*' },
  video: { icon: Video, color: 'text-blue-500', accept: 'video/*' },
  audio: { icon: Music, color: 'text-purple-500', accept: 'audio/*' },
  document: { icon: FileText, color: 'text-orange-500', accept: '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx' },
  other: { icon: File, color: 'text-gray-500', accept: '*' },
};

// Get asset type from mime type
const getAssetTypeFromMime = (mimeType: string): AssetType => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('sheet') || mimeType.includes('presentation')) return 'document';
  return 'other';
};

// Format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

// Local storage key
const ASSETS_STORAGE_KEY = 'omugwo_assets';
const FOLDERS_STORAGE_KEY = 'omugwo_asset_folders';

// Asset Manager Hook
export const useAssetManager = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [folders, setFolders] = useState<AssetFolder[]>([]);
  const [uploads, setUploads] = useState<UploadStatus[]>([]);

  // Load from storage
  useEffect(() => {
    const storedAssets = localStorage.getItem(ASSETS_STORAGE_KEY);
    const storedFolders = localStorage.getItem(FOLDERS_STORAGE_KEY);
    
    if (storedAssets) {
      try {
        setAssets(JSON.parse(storedAssets));
      } catch (e) {
        console.error('Failed to load assets:', e);
      }
    }
    
    if (storedFolders) {
      try {
        setFolders(JSON.parse(storedFolders));
      } catch (e) {
        console.error('Failed to load folders:', e);
      }
    }
  }, []);

  // Persist assets
  const persistAssets = useCallback((newAssets: Asset[]) => {
    localStorage.setItem(ASSETS_STORAGE_KEY, JSON.stringify(newAssets));
    setAssets(newAssets);
  }, []);

  // Persist folders
  const persistFolders = useCallback((newFolders: AssetFolder[]) => {
    localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(newFolders));
    setFolders(newFolders);
  }, []);

  // Upload file
  const uploadFile = useCallback(async (file: File, folderId: string | null = null): Promise<Asset | null> => {
    const uploadId = `upload_${Date.now()}`;
    
    // Add to upload queue
    setUploads(prev => [...prev, {
      id: uploadId,
      name: file.name,
      progress: 0,
      status: 'uploading',
    }]);

    try {
      // Simulate upload progress (in production, this would be actual upload)
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 50));
        setUploads(prev => prev.map(u =>
          u.id === uploadId ? { ...u, progress: i } : u
        ));
      }

      // Create asset
      const assetType = getAssetTypeFromMime(file.type);
      const asset: Asset = {
        id: `asset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: assetType,
        url: URL.createObjectURL(file), // In production, this would be a CDN URL
        size: file.size,
        mimeType: file.type,
        tags: [],
        folderId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        source: 'local',
      };

      // Get image dimensions if applicable
      if (assetType === 'image') {
        const img = new window.Image();
        img.src = asset.url;
        await new Promise(resolve => {
          img.onload = () => {
            asset.width = img.width;
            asset.height = img.height;
            asset.thumbnail = asset.url;
            resolve(null);
          };
        });
      }

      // Save asset
      persistAssets([...assets, asset]);
      
      // Mark upload complete
      setUploads(prev => prev.map(u =>
        u.id === uploadId ? { ...u, status: 'complete' } : u
      ));

      // Remove from queue after delay
      setTimeout(() => {
        setUploads(prev => prev.filter(u => u.id !== uploadId));
      }, 1000);

      return asset;
    } catch (error) {
      setUploads(prev => prev.map(u =>
        u.id === uploadId ? { ...u, status: 'error', error: String(error) } : u
      ));
      return null;
    }
  }, [assets, persistAssets]);

  // Upload from URL
  const uploadFromUrl = useCallback(async (url: string, name?: string, folderId: string | null = null): Promise<Asset | null> => {
    try {
      const assetName = name || url.split('/').pop() || 'External Asset';
      const asset: Asset = {
        id: `asset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: assetName,
        type: 'image', // Assume image for URLs
        url,
        thumbnail: url,
        size: 0,
        mimeType: 'image/unknown',
        tags: [],
        folderId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        source: 'external',
      };

      persistAssets([...assets, asset]);
      return asset;
    } catch (error) {
      console.error('Failed to add asset from URL:', error);
      return null;
    }
  }, [assets, persistAssets]);

  // Delete asset
  const deleteAsset = useCallback((assetId: string) => {
    const filtered = assets.filter(a => a.id !== assetId);
    persistAssets(filtered);
  }, [assets, persistAssets]);

  // Update asset
  const updateAsset = useCallback((assetId: string, updates: Partial<Asset>) => {
    const updated = assets.map(a =>
      a.id === assetId
        ? { ...a, ...updates, updatedAt: new Date().toISOString() }
        : a
    );
    persistAssets(updated);
  }, [assets, persistAssets]);

  // Create folder
  const createFolder = useCallback((name: string, parentId: string | null = null): AssetFolder => {
    const folder: AssetFolder = {
      id: `folder_${Date.now()}`,
      name,
      parentId,
      createdAt: new Date().toISOString(),
    };
    persistFolders([...folders, folder]);
    return folder;
  }, [folders, persistFolders]);

  // Delete folder
  const deleteFolder = useCallback((folderId: string) => {
    // Move assets to parent or root
    const updatedAssets = assets.map(a =>
      a.folderId === folderId ? { ...a, folderId: null } : a
    );
    persistAssets(updatedAssets);

    // Delete folder
    const filtered = folders.filter(f => f.id !== folderId);
    persistFolders(filtered);
  }, [assets, folders, persistAssets, persistFolders]);

  // Get assets by folder
  const getAssetsByFolder = useCallback((folderId: string | null) => {
    return assets.filter(a => a.folderId === folderId);
  }, [assets]);

  // Get folder tree
  const getFolderTree = useCallback(() => {
    const buildTree = (parentId: string | null): (AssetFolder & { children: AssetFolder[] })[] => {
      return folders
        .filter(f => f.parentId === parentId)
        .map(f => ({ ...f, children: buildTree(f.id) }));
    };
    return buildTree(null);
  }, [folders]);

  // Search assets
  const searchAssets = useCallback((query: string) => {
    const q = query.toLowerCase();
    return assets.filter(a =>
      a.name.toLowerCase().includes(q) ||
      a.tags.some(t => t.toLowerCase().includes(q)) ||
      a.alt?.toLowerCase().includes(q)
    );
  }, [assets]);

  return {
    assets,
    folders,
    uploads,
    uploadFile,
    uploadFromUrl,
    deleteAsset,
    updateAsset,
    createFolder,
    deleteFolder,
    getAssetsByFolder,
    getFolderTree,
    searchAssets,
  };
};

// Media Library Panel
interface MediaLibraryPanelProps {
  onSelectAsset?: (asset: Asset) => void;
  mode?: 'select' | 'manage';
  allowedTypes?: AssetType[];
  className?: string;
}

export const MediaLibraryPanel: React.FC<MediaLibraryPanelProps> = ({
  onSelectAsset,
  mode = 'manage',
  allowedTypes,
  className,
}) => {
  const {
    assets,
    folders,
    uploads,
    uploadFile,
    uploadFromUrl,
    deleteAsset,
    updateAsset,
    createFolder,
    getAssetsByFolder,
    getFolderTree,
    searchAssets,
  } = useAssetManager();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set());
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [filterType, setFilterType] = useState<AssetType | 'all'>('all');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtered and sorted assets
  const displayedAssets = useMemo(() => {
    let result = searchQuery ? searchAssets(searchQuery) : getAssetsByFolder(currentFolder);
    
    // Filter by type
    if (filterType !== 'all') {
      result = result.filter(a => a.type === filterType);
    }
    
    // Filter by allowed types
    if (allowedTypes) {
      result = result.filter(a => allowedTypes.includes(a.type));
    }
    
    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') comparison = a.name.localeCompare(b.name);
      if (sortBy === 'date') comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === 'size') comparison = a.size - b.size;
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return result;
  }, [searchQuery, currentFolder, filterType, allowedTypes, sortBy, sortOrder, searchAssets, getAssetsByFolder]);

  // Folder tree
  const folderTree = useMemo(() => getFolderTree(), [getFolderTree]);

  // Handle file upload
  const handleFileUpload = useCallback(async (files: FileList) => {
    for (let i = 0; i < files.length; i++) {
      await uploadFile(files[i], currentFolder);
    }
  }, [uploadFile, currentFolder]);

  // Handle URL upload
  const handleUrlUpload = useCallback(async () => {
    if (urlInput.trim()) {
      await uploadFromUrl(urlInput.trim(), undefined, currentFolder);
      setUrlInput('');
      setShowUrlInput(false);
    }
  }, [urlInput, uploadFromUrl, currentFolder]);

  // Toggle selection
  const toggleSelection = useCallback((assetId: string) => {
    setSelectedAssets(prev => {
      const newSet = new Set(prev);
      if (newSet.has(assetId)) {
        newSet.delete(assetId);
      } else {
        newSet.add(assetId);
      }
      return newSet;
    });
  }, []);

  // Handle asset click
  const handleAssetClick = useCallback((asset: Asset) => {
    if (mode === 'select' && onSelectAsset) {
      onSelectAsset(asset);
    } else {
      toggleSelection(asset.id);
    }
  }, [mode, onSelectAsset, toggleSelection]);

  // Render folder item
  const renderFolder = (folder: AssetFolder, children: AssetFolder[] = [], depth = 0) => (
    <div key={folder.id}>
      <button
        onClick={() => setCurrentFolder(folder.id)}
        className={cn(
          'w-full flex items-center gap-2 px-2 py-1.5 text-xs rounded-lg transition-colors',
          currentFolder === folder.id
            ? 'bg-primary-100 dark:bg-primary-950/30 text-primary-600'
            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        <Folder className="w-3.5 h-3.5" />
        <span className="truncate">{folder.name}</span>
      </button>
      {children.map(child => {
        const childItem = folderTree.find(f => f.id === child.id);
        return renderFolder(child, childItem?.children || [], depth + 1);
      })}
    </div>
  );

  // Render asset item
  const renderAsset = (asset: Asset) => {
    const isSelected = selectedAssets.has(asset.id);
    const config = ASSET_TYPE_CONFIG[asset.type];
    const Icon = config.icon;

    return (
      <div
        key={asset.id}
        onClick={() => handleAssetClick(asset)}
        className={cn(
          'group relative rounded-lg overflow-hidden cursor-pointer transition-all',
          viewMode === 'grid' && 'aspect-square',
          isSelected && 'ring-2 ring-primary-500',
          'hover:shadow-lg'
        )}
      >
        {viewMode === 'grid' ? (
          <>
            {/* Thumbnail */}
            <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800">
              {asset.thumbnail ? (
                <img
                  src={asset.thumbnail}
                  alt={asset.alt || asset.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Icon className={cn('w-8 h-8', config.color)} />
                </div>
              )}
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-0 left-0 right-0 p-2">
                <p className="text-xs text-white font-medium truncate">{asset.name}</p>
                <p className="text-xs text-white/70">{formatFileSize(asset.size)}</p>
              </div>
            </div>

            {/* Selection indicator */}
            {isSelected && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
          </>
        ) : (
          <div className={cn(
            'flex items-center gap-3 p-2 border rounded-lg',
            isSelected && 'border-primary-500 bg-primary-50/50'
          )}>
            <div className="w-10 h-10 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
              {asset.thumbnail ? (
                <img src={asset.thumbnail} alt="" className="w-full h-full object-cover" />
              ) : (
                <Icon className={cn('w-5 h-5', config.color)} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {asset.name}
              </p>
              <p className="text-xs text-gray-500">
                {formatFileSize(asset.size)} • {asset.type}
              </p>
            </div>
            {isSelected && (
              <Check className="w-4 h-4 text-primary-500" />
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn('flex flex-col h-full bg-white dark:bg-gray-900', className)}>
      {/* Header */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
            <Image className="w-4 h-4" />
            Media Library
          </h3>
          <div className="flex items-center gap-1">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-2 py-1 text-xs font-medium text-white bg-primary-600 rounded hover:bg-primary-700 flex items-center gap-1"
            >
              <Upload className="w-3 h-3" />
              Upload
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
          />
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-1 rounded-l',
                viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow' : ''
              )}
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-1 rounded-r',
                viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow' : ''
              )}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Filter by type */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as AssetType | 'all')}
            className="px-2 py-1 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded"
          >
            <option value="all">All Types</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="audio">Audio</option>
            <option value="document">Documents</option>
          </select>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-1">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'date' | 'size')}
            className="px-2 py-1 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded"
          >
            <option value="date">Date</option>
            <option value="name">Name</option>
            <option value="size">Size</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
          >
            {sortOrder === 'asc' ? <SortAsc className="w-3.5 h-3.5" /> : <SortDesc className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Folders */}
        <div className="w-40 border-r border-gray-200 dark:border-gray-800 overflow-y-auto p-2">
          <button
            onClick={() => setCurrentFolder(null)}
            className={cn(
              'w-full flex items-center gap-2 px-2 py-1.5 text-xs rounded-lg transition-colors mb-1',
              currentFolder === null
                ? 'bg-primary-100 dark:bg-primary-950/30 text-primary-600'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            )}
          >
            <FolderOpen className="w-3.5 h-3.5" />
            All Assets
          </button>
          {folderTree.map(folder => renderFolder(folder, folder.children))}
        </div>

        {/* Assets grid/list */}
        <div className="flex-1 overflow-y-auto p-3">
          {/* Upload progress */}
          {uploads.length > 0 && (
            <div className="mb-3 space-y-1">
              {uploads.map(upload => (
                <div key={upload.id} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <div className="flex-1">
                    <p className="text-xs font-medium truncate">{upload.name}</p>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 mt-1">
                      <div
                        className={cn(
                          'h-1 rounded-full transition-all',
                          upload.status === 'error' ? 'bg-red-500' : 'bg-primary-500'
                        )}
                        style={{ width: `${upload.progress}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{upload.progress}%</span>
                </div>
              ))}
            </div>
          )}

          {/* Assets */}
          {displayedAssets.length === 0 ? (
            <div className="text-center py-12">
              <Image className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No assets yet
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Upload images, videos, and more
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 px-4 py-2 text-xs font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
              >
                Upload Files
              </button>
            </div>
          ) : (
            <div className={cn(
              viewMode === 'grid'
                ? 'grid grid-cols-3 gap-2'
                : 'space-y-1'
            )}>
              {displayedAssets.map(asset => renderAsset(asset))}
            </div>
          )}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={allowedTypes?.map(t => ASSET_TYPE_CONFIG[t].accept).join(',') || '*'}
        onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
        className="hidden"
      />

      {/* URL Input Modal */}
      {showUrlInput && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 max-w-sm w-full mx-4">
            <h4 className="font-bold text-sm mb-3">Add from URL</h4>
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 text-sm border rounded-lg mb-3"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowUrlInput(false)}
                className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUrlUpload}
                className="px-3 py-1.5 text-sm text-white bg-primary-600 rounded hover:bg-primary-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaLibraryPanel;
