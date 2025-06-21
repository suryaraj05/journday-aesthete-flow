
import { BookOpen, Book, Mail, Target, Goal, LogOut, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';

interface AppSidebarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function AppSidebar({ onNavigate, currentPage }: AppSidebarProps) {
  const { user, logout } = useAuth();

  const menuItems = [
    {
      title: "Dashboard",
      icon: Home,
      action: () => onNavigate('dashboard')
    },
    {
      title: "Reflections",
      icon: BookOpen,
      action: () => onNavigate('reflections')
    },
    {
      title: "Reading",
      icon: Book,
      action: () => onNavigate('reading')
    },
    {
      title: "My Goals",
      icon: Goal,
      action: () => onNavigate('goals')
    },
    {
      title: "Manifestation",
      icon: Target,
      action: () => onNavigate('manifestation')
    },
    {
      title: "Weekly Letter",
      icon: Mail,
      action: () => onNavigate('weeklyLetter')
    }
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 neumorphic flex items-center justify-center pulse-glow-animation">
            <img 
              src="/lovable-uploads/fea06144-508f-49e9-8fdf-15396ad4c3f8.png" 
              alt="JournDay Logo" 
              className="w-6 h-6"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">JournDay</h1>
            <p className="text-xs text-gray-600">{user?.email?.split('@')[0]}</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    onClick={item.action}
                    isActive={currentPage === item.title.toLowerCase().replace(' ', '')}
                    className="w-full justify-start"
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full justify-start"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
