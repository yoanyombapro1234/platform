import React from "react";
import { cn } from "src/lib/utils";
import { selectCurrentUserAccount } from "src/redux/slice/authentication/AuthenticationSelector";
import { useAppSelector } from "src/redux/store/hooks";

/**
 * Props for the SidebarLayoutComponent.
 */
interface SidebarLayoutProps {
  /**
   * Additional class names to apply styling.
   * @default undefined
   */
  className?: string;
  children: React.ReactNode;
  /**
   * The title to be displayed on the sidebar.
   */
  title: string;
}

/**
 * A layout component that provides a styled sidebar.
 * It's designed to be hidden on medium (`md`) screens and smaller.
 *
 * @example
 * ```tsx
 * <SidebarLayoutComponent title="Details">
 *   // children components here
 * </SidebarLayoutComponent>
 * ```
 */
const SidebarLayout: React.FC<SidebarLayoutProps> = ({
  className,
  children,
  title,
}) => {
  return (
    <div className={cn("pb-12 hidden md:block", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-xl font-semibold tracking-tight">
            {title}
          </h2>
          <div className="space-y-1">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default SidebarLayout;
