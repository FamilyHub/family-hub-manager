'use client';

import { useState } from 'react';
import Sidebar from '@/components/home/Sidebar';
import TopBar from '@/components/home/TopBar';

export default function HomePage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <Sidebar isCollapsed={isSidebarCollapsed} onToggleCollapse={setIsSidebarCollapsed} />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 overflow-hidden">
          {/* Main content will go here */}
        </main>
      </div>
    </div>
  );
}
