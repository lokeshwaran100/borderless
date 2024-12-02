"use client"
import React from 'react';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { LoginButton } from '../LoginButton';
import { Button } from '../LoginButton';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { SearchBar } from './Searchbar';

const Navbar = () => {
  const { data: session } = useSession();
  return (
    <header className="flex justify-between items-center p-4 bg-gray-100">
      <NavigationMenu.Root className="flex justify-between w-full max-w-screen-xl mx-auto">
        <div className="flex items-center gap-8">
          <Link href="/">
            <div className="text-xl font-bold">Pay App</div>
          </Link>
          {session && <SearchBar />}
        </div>

        <div className="flex gap-4">
          <NavigationMenu.List className="flex gap-4">
            <NavigationMenu.Item>
              <Link href="/register">
                {!session && (<Button>Register</Button>)}
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
