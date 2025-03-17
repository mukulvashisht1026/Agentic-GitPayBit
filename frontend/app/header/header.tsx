'use client';

import LoginLogout from "./component/LoginLogout";

export default function Header() {
  return (
    <header className="sticky top-0 shadow-lg bg-black z-10 border-cyan-10 border-b-2">
      <nav className="mb-2 px-6 lg:px-12 py-2.5">
        <div className="flex justify-between items-center mx-auto">
          {/* Logo - Aligned more to the left */}
          <div className="flex items-center">
            <span className="text-xl font-semibold whitespace-nowrap text-white">
              GitBit
            </span>
          </div>

          {/* Spacer to push LoginLogout to the right */}
          <div className="flex-1"></div>

          {/* Login Button - Aligned more to the right */}
          <div className="flex items-center">
            <LoginLogout />
          </div>
        </div>
      </nav>
    </header>
  );
}
