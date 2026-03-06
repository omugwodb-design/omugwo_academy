import React from 'react';
import { Button } from './Button';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
  danger = false,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[10000]">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => {
          if (!isLoading) onCancel();
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-800">
          <div className="p-6">
            <h3 className="text-lg font-black text-gray-900 dark:text-white">{title}</h3>
            {description ? (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{description}</p>
            ) : null}

            <div className="mt-6 flex items-center justify-end gap-3">
              <Button
                variant="secondary"
                size="sm"
                disabled={isLoading}
                onClick={onCancel}
              >
                {cancelText}
              </Button>
              <Button
                variant={danger ? 'outline' : 'primary'}
                size="sm"
                isLoading={isLoading}
                onClick={onConfirm}
              >
                {confirmText}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
