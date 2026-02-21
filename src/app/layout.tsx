import { AuthProvider } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body>
        <AuthProvider>
          <Navbar />
          <div className="container mx-auto mt-4">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}