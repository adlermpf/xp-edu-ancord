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
      <div className="relative max-h-[calc(100dvh-2rem)] w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        <div className="px-6 pt-6">
          {title ? (
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-text">{title}</h2>
            </div>
          ) : null}
          <div className="max-h-[calc(100dvh-11rem)] overflow-auto overscroll-contain pb-6">
            {children}
          </div>
        </div>

        {footer ? (
          <div className="grid gap-2 border-t border-border px-6 py-4 sm:flex sm:items-center sm:justify-end">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
