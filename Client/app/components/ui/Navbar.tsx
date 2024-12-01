import React from 'react';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { LoginButton } from '../LoginButton';
import { Button } from '../LoginButton';
import Link from 'next/link';

const Navbar = () => {
  return (
    <header className="flex justify-between items-center p-4 bg-gray-100">
      <NavigationMenu.Root className="flex justify-between w-full max-w-screen-xl mx-auto">
        {/* Left section with buttons */}
        <div>
          Pay App
        </div>

        {/* Right section with logo */}
        <div className="flex gap-4">
          <NavigationMenu.List className="flex gap-4">
          <NavigationMenu.Item>
            <Link href="/register">
            <Button>Register</Button>
            </Link>
            </NavigationMenu.Item>
            <NavigationMenu.Item>
                <LoginButton/>
            </NavigationMenu.Item>
          </NavigationMenu.List>
        </div>
      </NavigationMenu.Root>
    </header>
  );
};

export default Navbar;
