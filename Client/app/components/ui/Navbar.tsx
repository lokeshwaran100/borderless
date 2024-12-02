"use client"
import React from 'react';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { LoginButton } from '../LoginButton';
import { Button } from '../LoginButton';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { SearchBar } from './Searchbar';
import { signIn, signOut } from 'next-auth/react';

const Navbar = () => {
  const { data: session } = useSession();
  return (
    <header className="w-full top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
      <NavigationMenu.Root className="flex justify-between w-full max-w-screen-xl mx-auto py-4 px-6">
        <div className="flex items-center gap-8">
          <Link href="/">
            <div className="text-xl font-semibold text-gray-900">Pay App</div>
          </Link>
          {session && <SearchBar />}
        </div>

        <div className="flex gap-4">
          <NavigationMenu.List className="flex items-center gap-4">
            <NavigationMenu.Item>
              {!session && (
                <Link href="/register">
                  <button className="px-6 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                    Register
                  </button>
                </Link>
              )}
            </NavigationMenu.Item>
            <NavigationMenu.Item>
              <button 
                className="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                onClick={() => {    if (session) {
                  // User is signed in, sign them out
                  signOut();
                } else {
                  // User is not signed in, sign them in      
            
                  // Sign in with Google after authorization
                  signIn("google");
                }}}
              >
                {session ? 'Sign Out' : 'Google Log In'}
              </button>
            </NavigationMenu.Item>
          </NavigationMenu.List>
        </div>
      </NavigationMenu.Root>
    </header>
  );
};

export default Navbar;
