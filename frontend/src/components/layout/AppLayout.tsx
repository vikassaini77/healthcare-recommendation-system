import { ReactNode } from "react";
import AppSidebar from "./AppSidebar";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="print:hidden"><AppSidebar /></div>
      <main className="ml-16 lg:ml-64 print:ml-0 min-h-screen transition-all duration-300 print:min-h-0">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
