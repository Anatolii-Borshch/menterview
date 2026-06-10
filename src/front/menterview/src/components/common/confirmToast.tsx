import { toast, type Id } from 'react-toastify';

interface ConfirmToastOptions {
  confirmText?: string;
  cancelText?: string;
  title?: string;
  danger?: boolean;
}

export function confirmToast(message: string, options: ConfirmToastOptions = {}): Promise<boolean> {
  return new Promise((resolve) => {
    let resolved = false;

    const resolveOnce = (value: boolean) => {
      if (resolved) return;
      resolved = true;
      resolve(value);
    };

    const toastId: Id = toast(
      <div className="min-w-72">
        {options.title ? <p className="text-sm font-semibold text-navy mb-1">{options.title}</p> : null}
        <p className="text-sm text-navy/80">{message}</p>
        <div className="mt-3 flex justify-end gap-2">
          <button
            onClick={() => {
              resolveOnce(false);
              toast.dismiss(toastId);
            }}
            className="px-3 py-1.5 rounded-md border border-periwinkle text-xs text-navy/70 hover:text-navy hover:border-navy/30 transition-colors"
          >
            {options.cancelText ?? 'Cancel'}
          </button>
          <button
            onClick={() => {
              resolveOnce(true);
              toast.dismiss(toastId);
            }}
            className={`px-3 py-1.5 rounded-md text-xs text-white transition-colors ${
              options.danger
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-cornflower hover:bg-cornflower/90'
            }`}
          >
            {options.confirmText ?? 'Confirm'}
          </button>
        </div>
      </div>,
      {
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
        draggable: false,
        onClose: () => resolveOnce(false),
      }
    );
  });
}
