"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Root (thin wrapper for naming consistency)                          */
/* ------------------------------------------------------------------ */

export type DialogRootProps = React.ComponentPropsWithoutRef<
  typeof DialogPrimitive.Root
>;

export function DialogRoot(props: DialogRootProps) {
  return <DialogPrimitive.Root {...props} />;
}

/* ------------------------------------------------------------------ */
/*  Trigger                                                             */
/* ------------------------------------------------------------------ */

export type DialogTriggerProps = React.ComponentPropsWithoutRef<
  typeof DialogPrimitive.Trigger
>;

export const DialogTrigger = React.forwardRef<
  HTMLButtonElement,
  DialogTriggerProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center min-h-[44px] min-w-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest rounded-[3px]",
      className,
    )}
    {...props}
  />
));

DialogTrigger.displayName = "DialogTrigger";

/* ------------------------------------------------------------------ */
/*  Overlay                                                             */
/* ------------------------------------------------------------------ */

const DialogOverlay = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-charcoal/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
  />
));

DialogOverlay.displayName = "DialogOverlay";

/* ------------------------------------------------------------------ */
/*  Content                                                             */
/* ------------------------------------------------------------------ */

export type DialogContentProps = React.ComponentPropsWithoutRef<
  typeof DialogPrimitive.Content
> & {
  /** Hide the built-in close button when a custom one is preferred. */
  hideClose?: boolean;
};

export const DialogContent = React.forwardRef<
  HTMLDivElement,
  DialogContentProps
>(({ className, children, hideClose = false, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogOverlay />

    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-1/2 top-1/2 z-50 w-full max-w-[520px] -translate-x-1/2 -translate-y-1/2 bg-surface border border-rule rounded-[3px] p-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest",
        className,
      )}
      {...props}
    >
      {children}

      {!hideClose && (
        <DialogPrimitive.Close
          aria-label="Close dialog"
          className="absolute right-4 top-4 inline-flex items-center justify-center min-h-[44px] min-w-[44px] text-secondary hover:text-text transition-colors duration-[120ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest rounded-[3px] motion-reduce:transition-none"
        >
          <X size={16} aria-hidden="true" />
        </DialogPrimitive.Close>
      )}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));

DialogContent.displayName = "DialogContent";

/* ------------------------------------------------------------------ */
/*  Title                                                               */
/* ------------------------------------------------------------------ */

export type DialogTitleProps = React.ComponentPropsWithoutRef<
  typeof DialogPrimitive.Title
>;

export const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  DialogTitleProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("font-heading font-medium text-xl text-text", className)}
    {...props}
  />
));

DialogTitle.displayName = "DialogTitle";

/* ------------------------------------------------------------------ */
/*  Close (exported for custom close buttons inside content)            */
/* ------------------------------------------------------------------ */

export type DialogCloseProps = React.ComponentPropsWithoutRef<
  typeof DialogPrimitive.Close
>;

export const DialogClose = React.forwardRef<
  HTMLButtonElement,
  DialogCloseProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Close
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center min-h-[44px] min-w-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest rounded-[3px]",
      className,
    )}
    {...props}
  />
));

DialogClose.displayName = "DialogClose";
