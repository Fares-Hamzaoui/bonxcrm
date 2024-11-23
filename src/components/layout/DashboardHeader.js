import { useState } from 'react';
import { auth } from '../../config/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export function DashboardHeader() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <header className="bg-white shadow">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex-shrink-0 flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">BonxCRM</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <nav className="flex space-x-4">
              <a href="#" className="text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Agences</a>
              <a href="#" className="text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Administrateurs</a>
              <a href="#" className="text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Statistiques</a>
            </nav>
            
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
              >
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">SA</span>
                </div>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Se déconnecter
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
