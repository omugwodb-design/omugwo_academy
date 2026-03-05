import React, { useState, useEffect } from 'react';
import { X, RotateCcw, Clock, User, Check } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useEditorStore } from './editor-store';
import { toast } from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

interface VersionHistoryModalProps {
  pageId: string;
  onClose: () => void;
}

interface PageVersion {
  id: string;
  version: number;
  blocks: any[];
  created_at: string;
  created_by: string;
  change_description: string;
}

export const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({ pageId, onClose }) => {
  const [versions, setVersions] = useState<PageVersion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const { getCurrentPage, setPages, pages } = useEditorStore();

  useEffect(() => {
    loadVersions();
  }, [pageId]);

  const loadVersions = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('site_page_versions')
        .select('*')
        .eq('page_id', pageId)
        .order('version', { ascending: false });

      if (error) throw error;
      setVersions(data || []);
    } catch (err: any) {
      console.error('Error loading versions:', err);
      toast.error('Failed to load version history');
    } finally {
      setIsLoading(false);
    }
  };

  const restoreVersion = async (version: PageVersion) => {
    if (!confirm(`Restore to version ${version.version}? This will replace your current draft.`)) {
      return;
    }

    try {
      const currentPage = getCurrentPage();
      if (!currentPage) return;

      // Update the page with the version's blocks
      const { error } = await supabase
        .from('site_pages')
        .update({
          draft_blocks: version.blocks,
          version: currentPage.version + 1,
          updated_at: new Date().toISOString(),
        })
        .eq('id', pageId);

      if (error) throw error;

      // Create a new version entry for this restore
      await supabase.from('site_page_versions').insert({
        page_id: pageId,
        version: currentPage.version + 1,
        blocks: version.blocks,
        change_description: `Restored from version ${version.version}`,
      });

      // Update local state
      setPages(
        pages.map((p) =>
          p.id === pageId
            ? {
                ...p,
                draftBlocks: version.blocks,
                version: p.version + 1,
              }
            : p
        )
      );

      toast.success(`Restored to version ${version.version}`);
      onClose();
    } catch (err: any) {
      console.error('Error restoring version:', err);
      toast.error('Failed to restore version');
    }
  };

  const previewVersion = (version: PageVersion) => {
    setSelectedVersion(version.id);
  };

  const selectedVersionData = versions.find((v) => v.id === selectedVersion);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white">Version History</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              View and restore previous versions of this page
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex min-h-0">
          {/* Version List */}
          <div className="w-80 border-r border-gray-200 dark:border-gray-800 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : versions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <Clock className="w-12 h-12 text-gray-300 dark:text-gray-700 mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">No version history yet</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Versions are created when you save changes
                </p>
              </div>
            ) : (
              <div className="p-4 space-y-2">
                {versions.map((version) => (
                  <button
                    key={version.id}
                    onClick={() => previewVersion(version)}
                    className={`w-full text-left p-4 rounded-xl transition-all ${
                      selectedVersion === version.id
                        ? 'bg-primary-50 dark:bg-primary-900/20 border-2 border-primary-500'
                        : 'bg-gray-50 dark:bg-gray-800 border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                          <span className="text-xs font-bold text-primary-600 dark:text-primary-400">
                            v{version.version}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            Version {version.version}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDistanceToNow(new Date(version.created_at), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </div>
                    {version.change_description && (
                      <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                        {version.change_description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <User className="w-3 h-3" />
                      <span>{version.created_by || 'System'}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Preview Panel */}
          <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950">
            {selectedVersionData ? (
              <div className="p-6">
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Version {selectedVersionData.version}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(selectedVersionData.created_at).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => restoreVersion(selectedVersionData)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold text-sm transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Restore This Version
                    </button>
                  </div>

                  {selectedVersionData.change_description && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        {selectedVersionData.change_description}
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Blocks in this version:
                    </p>
                    <div className="space-y-1">
                      {selectedVersionData.blocks.map((block: any, index: number) => (
                        <div
                          key={block.id || index}
                          className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                          <Check className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {block.type} - {block.props?.title || block.props?.heading || 'Untitled'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <Clock className="w-16 h-16 text-gray-300 dark:text-gray-700 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  Select a version to preview
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
