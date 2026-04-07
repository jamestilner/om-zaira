import { useState, useEffect } from "react";
import AdminUsersManagement from "./components/AdminUsersManagement";
import RoleManagement from "./components/RoleManagement";
import Dashboard from "./components/Dashboard";
import ProductManagement from "./components/ProductManagement";
import PlanManagement from "./components/PlanManagement";
import MembershipPlans from "./components/MembershipPlans";
import EventManagement from "./components/EventManagement";
import Memberships from "./components/Memberships";
import MembershipUsers from "./components/MembershipUsers";
import UIKit from "./components/UIKit";
import SampleDesign from "./components/SampleDesign";
import { Sidebar } from "./components/Sidebar";
import { GlobalHeader } from "./components/GlobalHeader";
import Authentication from "./components/Authentication";
import Comments from "./components/Comments";
import Groups from "./modules/groups/Groups";
import TransactionReport from "./components/TransactionReport";
import DailyCollectionReport from "./components/DailyCollectionReport";
import OfflinePurchaseReport from "./components/OfflinePurchaseReport";
import { Toaster } from "sonner";

export default function App() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      return saved === "dark";
    }
    return false;
  });

  const [currentTheme, setCurrentTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("colorTheme") || "natural";
    }
    return "natural";
  });

  const [isSidebarCollapsed, setIsSidebarCollapsed] =
    useState(false);

  const [currentPage, setCurrentPage] = useState("dashboard");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    // In production, check for valid token/session here
    const authToken = localStorage.getItem("authToken");
    setIsAuthenticated(!!authToken);
  }, []);

  /* -------------------- Theme Effects -------------------- */
  useEffect(() => {
    const root = document.documentElement;

    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem("colorTheme", currentTheme);
    document.documentElement.setAttribute(
      "data-theme",
      currentTheme,
    );
  }, [currentTheme]);

  const handleLogout = () => {
    console.log("Logout clicked");
    // Clear authentication
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    setCurrentPage("dashboard"); // Reset to default page
  };

  const handleNavigate = (pageId: string) => {
    setCurrentPage(pageId);
  };

  const handleNavigateToProfile = () => {
    console.log("Navigate to profile");
    // For now, show an alert since profile page doesn't exist yet
    alert("Profile page coming soon!");
  };

  const handleNavigateToSettings = () => {
    console.log("Navigate to settings");
    // For now, show an alert since settings page doesn't exist yet
    alert("Settings page coming soon!");
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-950 transition-colors">
        <Authentication
          onLoginSuccess={() => {
            // Set auth token in production
            localStorage.setItem("authToken", "demo-token");
            setIsAuthenticated(true);
            setCurrentPage("dashboard");
          }}
        />

        {/* Toast */}
        <Toaster
          position="top-right"
          expand
          richColors
          closeButton
          theme={isDark ? "dark" : "light"}
        />
      </div>
    );
  }

  // Show main application if authenticated
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 transition-colors">
      {/* Sidebar */}
      <Sidebar
        onLogout={handleLogout}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() =>
          setIsSidebarCollapsed(!isSidebarCollapsed)
        }
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />

      {/* Main Content */}
      <main
        className={`transition-all duration-300 ${isSidebarCollapsed ? "ml-16" : "ml-64"
          }`}
      >
        {/* Global Header */}
        <GlobalHeader
          isDarkMode={isDark}
          onToggleDarkMode={() => setIsDark(!isDark)}
          isSidebarCollapsed={isSidebarCollapsed}
          currentTheme={currentTheme}
          onThemeChange={setCurrentTheme}
          onNavigateToProfile={handleNavigateToProfile}
          onNavigateToSettings={handleNavigateToSettings}
          onLogout={handleLogout}
        />

        {/* Page Content */}
        {currentPage === "dashboard" ? (
          <Dashboard />
        ) : currentPage === "products" ? (
          <ProductManagement />
        ) : currentPage === "plans" ? (
          <PlanManagement onNavigate={handleNavigate} />
        ) : currentPage === "events" ? (
          <EventManagement />
        ) : currentPage === "memberships" ? (
          <Memberships />
        ) : currentPage === "customers" ? (
          <MembershipUsers />
        ) : currentPage === "comments" ? (
          <Comments />
        ) : currentPage === "groups" ? (
          <Groups />
        ) : currentPage === "ui-kit" ? (
          <UIKit />
        ) : currentPage === "sample-design" ? (
          <SampleDesign />
        ) : currentPage === "admin-users" ? (
          <AdminUsersManagement />
        ) : currentPage === "roles" ? (
          <RoleManagement />
        ) : currentPage === "transaction-report" ? (
          <TransactionReport />
        ) : currentPage === "daily-collection-report" ? (
          <DailyCollectionReport />
        ) : currentPage === "offline-purchase-report" ? (
          <OfflinePurchaseReport />
        ) : (
          <div className="p-6 text-neutral-500">
            Select a module to preview UI components
          </div>
        )}
      </main>

      {/* Toast */}
      <Toaster
        position="top-right"
        expand
        richColors
        closeButton
        theme={isDark ? "dark" : "light"}
      />
    </div>
  );
}