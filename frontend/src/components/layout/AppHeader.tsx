import { useAuth } from "@/contexts/AuthContext";
import { NotificationBell } from "@/components/ui/NotificationBell";
import { LogOut, Settings as SettingsIcon, User, CreditCard, Bell } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AppHeader = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth/login');
  };

  const getUserInitials = () => {
    if (!user?.fullName) return 'U';
    const names = user.fullName.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return names[0].substring(0, 2).toUpperCase();
  };

  const getDisplayName = () => {
    if (!user?.fullName) return 'User';
    const names = user.fullName.split(' ');
    if (names.length >= 2) {
      return `${names[0]} ${names[names.length - 1]}`;
    }
    return names[0];
  };

  const getRoleDisplay = () => {
    if (!user?.role) return 'User';
    const roleMap: Record<string, string> = {
      radiologist: 'Radiologist',
      physician: 'Physician',
      researcher: 'Medical Researcher',
      admin: 'Hospital Admin',
    };
    return roleMap[user.role] || 'User';
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-background/80 backdrop-blur-md border-b border-border flex items-center justify-between px-6">
      <div className="flex-1" /> {/* Empty space on left since sidebar is there */}
      
      <div className="flex items-center gap-4">
        {/* System Status - Subtle dot */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 border border-border">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-risk-low opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-risk-low"></span>
          </span>
          <span className="text-xs text-muted-foreground font-medium">Operational</span>
        </div>

        <NotificationBell />

        <div className="h-6 w-px bg-border mx-1 hidden sm:block" />

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-12 flex items-center gap-3 px-2 hover:bg-secondary/50">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium leading-none mb-1 text-foreground">{getDisplayName()}</p>
                <p className="text-xs text-muted-foreground leading-none">{getRoleDisplay()}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-semibold text-sm shrink-0">
                {getUserInitials()}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 p-2">
            <div className="flex items-center gap-3 p-2 mb-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                {getUserInitials()}
              </div>
              <div className="flex flex-col space-y-1">
                <p className="font-semibold text-sm text-foreground leading-none">{getDisplayName()}</p>
                <p className="text-xs text-muted-foreground leading-none">{user?.email || "user@medvision.ai"}</p>
              </div>
              <div className="ml-auto">
                <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Pro
                </span>
              </div>
            </div>
            
            <DropdownMenuSeparator className="mx-1 opacity-50" />
            
            <div className="px-2 py-1.5 mt-1">
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">My Account</p>
            </div>
            
            <DropdownMenuItem 
              className="cursor-pointer rounded-md py-2 px-3 mx-1 focus:bg-secondary/60" 
              onSelect={() => navigate('/settings?tab=profile')}
            >
              <User className="mr-3 h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Profile</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              className="cursor-pointer rounded-md py-2 px-3 mx-1 focus:bg-secondary/60" 
              onSelect={() => navigate('/settings?tab=billing')}
            >
              <CreditCard className="mr-3 h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Billing</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              className="cursor-pointer rounded-md py-2 px-3 mx-1 focus:bg-secondary/60" 
              onSelect={() => navigate('/settings?tab=notifications')}
            >
              <Bell className="mr-3 h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Notifications</span>
            </DropdownMenuItem>
            
            <div className="px-2 py-1.5 mt-2">
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Workspace</p>
            </div>
            
            <DropdownMenuItem 
              className="cursor-pointer rounded-md py-2 px-3 mx-1 focus:bg-secondary/60" 
              onSelect={() => navigate('/settings?tab=display')}
            >
              <SettingsIcon className="mr-3 h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Settings</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator className="mx-1 my-2 opacity-50" />
            
            <DropdownMenuItem 
              onSelect={handleSignOut}
              className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer rounded-md py-2 px-3 mx-1"
            >
              <LogOut className="mr-3 h-4 w-4" />
              <span className="text-sm font-medium">Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default AppHeader;
