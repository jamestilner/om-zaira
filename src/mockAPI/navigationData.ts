import {
  LayoutDashboard,
  Building2,
  Users,
  FileText,
  Clock,
  Plane,
  Palette,
  Layers,
  Settings,
  Package,
  Crown,
  Calendar,
  CreditCard,
  Shield,
  MessageSquare,
  FileBarChart,
} from "lucide-react";

export interface SubMenuItem {
  id: string;
  label: string;
  onClick?: () => void;
  active?: boolean;
}

export interface MenuItem {
  id: string;
  label: string;
  icon?: any;
  onClick?: () => void;
  active?: boolean;
  subItems?: SubMenuItem[];
}

export const getNavigationData = (
  currentPage: string = "directory",
  onNavigate: (pageId: string) => void = () => { },
): MenuItem[] => {
  return [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      onClick: () => onNavigate("dashboard"),
      active: currentPage === "dashboard",
    },
    /*
    {
      id: "hb-templates",
      label: "HB Templates",
      icon: Building2,
      subItems: [
        {
          id: "ui-kit",
          label: "UI Kit",
          onClick: () => onNavigate("ui-kit"),
          active: currentPage === "ui-kit",
        },
        {
          id: "sample-design",
          label: "Sample Page",
          onClick: () => onNavigate("sample-design"),
          active: currentPage === "sample-design",
        },
      ],
    },
    */
    {
      id: "products",
      label: "Products",
      icon: Package,
      onClick: () => onNavigate("products"),
      active: currentPage === "products",
    },
    {
      id: "plans",
      label: "Plans",
      icon: Crown,
      onClick: () => onNavigate("plans"),
      active: currentPage === "plans",
    },
    {
      id: "events",
      label: "Events",
      icon: Calendar,
      onClick: () => onNavigate("events"),
      active: currentPage === "events",
    },
    {
      id: "memberships",
      label: "Memberships",
      icon: CreditCard,
      onClick: () => onNavigate("memberships"),
      active: currentPage === "memberships",
    },
    {
      id: "customers",
      label: "Customers",
      icon: Users,
      onClick: () => onNavigate("customers"),
      active: currentPage === "customers",
    },
    /*
    {
      id: "comments",
      label: "Comments",
      icon: MessageSquare,
      onClick: () => onNavigate("comments"),
      active: currentPage === "comments",
    },
    */
    {
      id: "groups",
      label: "Groups",
      icon: Layers,
      onClick: () => onNavigate("groups"),
      active: currentPage === "groups",
    },
    {
      id: "reports",
      label: "Reports",
      icon: FileBarChart,
      subItems: [
        {
          id: "transaction-report",
          label: "Transaction Report",
          onClick: () => onNavigate("transaction-report"),
          active: currentPage === "transaction-report",
        },
        {
          id: "daily-collection-report",
          label: "Daily Collection Report",
          onClick: () => onNavigate("daily-collection-report"),
          active: currentPage === "daily-collection-report",
        },
        {
          id: "offline-purchase-report",
          label: "Offline Purchase Report",
          onClick: () => onNavigate("offline-purchase-report"),
          active: currentPage === "offline-purchase-report",
        },
      ],
    },
    {
      id: "admin-management",
      label: "Admin Management",
      icon: Settings,
      subItems: [
        {
          id: "admin-users",
          label: "Admin Users",
          onClick: () => onNavigate("admin-users"),
          active: currentPage === "admin-users",
        },
        {
          id: "roles",
          label: "Role Management",
          onClick: () => onNavigate("roles"),
          active: currentPage === "roles",
        },
      ],
    },
  ];
};