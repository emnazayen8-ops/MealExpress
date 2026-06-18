import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';

  const logout = () => {
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  return (
    <nav className="bg-[#291B25] text-white px-6 py-4 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to={isAdmin ? '/admin' : '/'} className="flex items-center gap-2">
          <img src="/MealExpress.png" alt="MealExpress" className="h-10 w-auto" />
          <span className="text-2xl font-bold tracking-tight hidden sm:block">MealExpress</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center">
          {!isAdmin && (
            <>
              <Link to="/" className="hover:text-[#F7B9A1] transition">Home</Link>
              <Link to="/boxes" className="hover:text-[#F7B9A1] transition">Our Boxes</Link>
              <Link to="/about" className="hover:text-[#F7B9A1] transition">About</Link>
              <Link to="/contact" className="hover:text-[#F7B9A1] transition">Contact</Link>
            </>
          )}
          {user ? (
            <>
              {isAdmin && (
                <Link to="/admin" className="text-[#61A6AB] hover:text-[#F7B9A1] transition">Admin Dashboard</Link>
              )}
              {!isAdmin && (
                <Link to="/dashboard" className="hover:text-[#F7B9A1] transition">My Account</Link>
              )}
              <button onClick={logout} className="bg-[#ED5B2D] px-4 py-2 rounded-lg hover:bg-[#d94d22] transition">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-[#F7B9A1] transition">Login</Link>
              <Link to="/register" className="bg-[#ED5B2D] px-4 py-2 rounded-lg hover:bg-[#d94d22] transition">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button className="md:hidden text-2xl" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 pb-4 space-y-3">
          {!isAdmin && (
            <>
              <Link to="/" className="block hover:text-[#F7B9A1] transition" onClick={() => setMenuOpen(false)}>Home</Link>
              <Link to="/boxes" className="block hover:text-[#F7B9A1] transition" onClick={() => setMenuOpen(false)}>Our Boxes</Link>
              <Link to="/about" className="block hover:text-[#F7B9A1] transition" onClick={() => setMenuOpen(false)}>About</Link>
              <Link to="/contact" className="block hover:text-[#F7B9A1] transition" onClick={() => setMenuOpen(false)}>Contact</Link>
            </>
          )}
          {user ? (
            <>
              {isAdmin && (
                <Link to="/admin" className="block text-[#61A6AB]" onClick={() => setMenuOpen(false)}>Admin Dashboard</Link>
              )}
              {!isAdmin && (
                <Link to="/dashboard" className="block" onClick={() => setMenuOpen(false)}>My Account</Link>
              )}
              <button onClick={() => { logout(); setMenuOpen(false); }} className="bg-[#ED5B2D] px-4 py-2 rounded-lg w-full">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="block bg-[#ED5B2D] px-4 py-2 rounded-lg text-center" onClick={() => setMenuOpen(false)}>
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;