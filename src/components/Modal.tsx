import React from "react";

type ModalProps = {
  open: boolean;
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
  footer?: React.ReactNode;
};

export function Modal({ open, title, children, onClose, footer }: ModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title ?? "Modal"}
    >
      <button
        aria-label="Fechar modal"
        className="absolute inset-0 bg-black/50 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg rounded-2xl  bg-card shadow-soft border border-border">
        <div className="px-6 pt-6">
          {title ? (
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-text">{title}</h2>
            </div>
          ) : null}
          <div className="pb-6">{children}</div>
        </div>

        {footer ? (
          <div className="flex items-center justify-end gap-2 border-t border-border px-6 py-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
