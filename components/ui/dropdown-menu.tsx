"use client";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
export const DropdownMenuGroup = DropdownMenuPrimitive.Group;
export const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
export const DropdownMenuSub = DropdownMenuPrimitive.Sub;
export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

export function DropdownMenuContent(props: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>) {
  return <DropdownMenuPrimitive.Portal><DropdownMenuPrimitive.Content sideOffset={10} collisionPadding={12} className="avatar-menu z-50 min-w-48 overflow-hidden rounded-2xl border border-line bg-white p-2 shadow-soft" {...props} /></DropdownMenuPrimitive.Portal>;
}

export function DropdownMenuItem(props: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>) {
  return <DropdownMenuPrimitive.Item className="focus-ring flex cursor-pointer select-none items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-600 outline-none transition hover:bg-gray-50 hover:text-ink data-[highlighted]:bg-gray-50" {...props} />;
}

export function DropdownMenuLabel(props: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label>) {
  return <DropdownMenuPrimitive.Label className="px-3 py-2 text-xs font-semibold text-gray-500" {...props} />;
}

export function DropdownMenuSeparator(props: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>) {
  return <DropdownMenuPrimitive.Separator className="my-1 h-px bg-line" {...props} />;
}
