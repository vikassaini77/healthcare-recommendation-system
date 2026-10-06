import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

export interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: "info" | "warning" | "success" | "error";
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, "id" | "time" | "read">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Simulated live notifications that arrive over time
const MOCK_LIVE_EVENTS = [
  { delay: 8000, type: "success" as const, title: "Analysis Complete", description: "Patient SCN-4878 results are ready." },
  { delay: 25000, type: "info" as const, title: "System Update", description: "MedVision core models updated to v2.4." },
  { delay: 45000, type: "warning" as const, title: "High Risk Scan", description: "Critical findings in SCN-5664. Please review immediately." },
];

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "n1",
      title: "Welcome to MedVision",
      description: "Your workspace is ready. You can now upload scans.",
      time: new Date().toISOString(),
      read: false,
      type: "info",
    }
  ]);

  const addNotification = (data: Omit<Notification, "id" | "time" | "read">) => {
    const newNotif: Notification = {
      ...data,
      id: `n_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      time: new Date().toISOString(),
      read: false,
    };
    
    setNotifications((prev) => [newNotif, ...prev]);

    // Also show a toast for live feedback
    if (data.type === "success") toast.success(data.title, { description: data.description });
    else if (data.type === "error") toast.error(data.title, { description: data.description });
    // else if (data.type === "warning") toast.warning(data.title, { description: data.description });
    else toast(data.title, { description: data.description });
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Setup mock live events
  useEffect(() => {
    const timers = MOCK_LIVE_EVENTS.map((event) => {
      return setTimeout(() => {
        addNotification({
          title: event.title,
          description: event.description,
          type: event.type,
        });
      }, event.delay);
    });

    return () => timers.forEach(clearTimeout);
  }, []); // Run once on mount

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};
