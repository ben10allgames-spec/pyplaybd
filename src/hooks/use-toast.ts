import { toast as sonnerToast } from "sonner";

type ToastInput = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
};

export function toast(input: ToastInput | string) {
  const opts = typeof input === "string" ? { title: input } : input;
  const message = opts.title ?? opts.description ?? "";
  const description = opts.title && opts.description ? opts.description : undefined;
  if (opts.variant === "destructive") {
    return sonnerToast.error(message, { description });
  }
  return sonnerToast(message, { description });
}

export function useToast() {
  return { toast, dismiss: sonnerToast.dismiss };
}
