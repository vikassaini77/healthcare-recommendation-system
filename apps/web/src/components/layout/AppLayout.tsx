import { ReactNode } from "react";
import AppSidebar from "./AppSidebar";
import AppHeader from "./AppHeader";
import ChatbotWidget from "../chat/ChatbotWidget";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen relative">
      <div className="print:hidden"><AppSidebar /></div>
      <div className="ml-16 lg:ml-64 print:ml-0 flex flex-col min-h-screen transition-all duration-300">
        <AppHeader />
        <main className="flex-1 transition-all duration-300 print:min-h-0">
          {children}
        </main>
      </div>
      <div className="print:hidden">
        <ChatbotWidget />
      </div>
    </div>
  );
};

export default AppLayout;
