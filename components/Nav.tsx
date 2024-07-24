'use client'

import { useState } from 'react';

import React from 'react'
import Link from 'next/link';
import Image from 'next/image';


const Nav = () => {
  const [toggleDropdown, setToggleDropdown] = useState<boolean>(false);

  return (
    <nav className='flex justify-between items-center w-full mb-16 pt-3'>
      <div className='hover:bg-green-700 transition-all duration-1000 ease-in-out rounded-lg p-1'>
        <Link href='/' className='flex gap-2 flex-center'>
          <Image src="/assets/icons/icon.png" alt="logo" width={30} height={30} className='object-contain'/>
          <p className='logo_text'>Home</p>
        </Link>
      </div>



      {/* Desktop Nav */}
      <div className='sm:flex hidden gap-3 md:gap-5'>
        <Link href='/about' className='nav_heading' >
          About
        </Link>
        <Link href='/about' className='nav_heading' >
          Projects
        </Link>
        <Link href='/about' className='nav_heading' >
          Contact Me
        </Link>
      </div>

      {/* Mobile Navigation */}
      <div className='sm:hidden flex relative'>
        <Image src="/assets/icons/expand_dots.svg" alt="menu" width={37} height={37} className='rounded-full' onClick={() => setToggleDropdown((prev) => !prev)}/>
        {toggleDropdown && (
          <div className='dropdown'>
            <Link href='/about' className='nav_heading' >
              About
            </Link>
            <Link href='/about' className='nav_heading' >
              Projects
            </Link>
            <Link href='/about' className='nav_heading' >
              Contact Me
            </Link>
          </div>
        )}
      </div>

    </nav>
  )
}

export default Nav