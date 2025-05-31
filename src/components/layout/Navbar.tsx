"use client";
import Link from 'next/link';
import { Dumbbell } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-3">
        <Link href="/" className="flex items-center space-x-2 text-xl font-headline font-bold">
          <Dumbbell size={28} />
          <span>BB Workouts</span>
        </Link>
      </div>
    </nav>
  );
}
