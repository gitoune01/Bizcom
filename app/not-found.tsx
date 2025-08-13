"use client";
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const NotFound = () => {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center ">
      <Image
        src="/images/logo.svg"  
        alt="404"
        width={48}
        height={48}
        priority={true}
      />
      <div className="p-6 rounded-lg shadow-md text-center w-1/3">
        <h1 className="text-3xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-destructive">The page you are looking for does not exist.</p>
        <Button  variant={"outline"} className='mt-4 ml-2' onClick={()=> window.location.href = "/"}>Go Back</Button>
      </div>
    </div>
  );
};

export default NotFound;
