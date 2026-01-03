import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <Outlet />
        </div>
      </div>
      <div className="hidden bg-muted lg:block relative overflow-hidden">
         <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px]" />
         {/* Placeholder for a nice image later */}
         <div className="flex h-full items-center justify-center p-8 text-muted-foreground/50">
             <div className="text-center">
                 <h2 className="text-3xl font-bold tracking-tight text-foreground">DayFlow</h2>
                 <p>Every workday, perfectly aligned.</p>
             </div>
         </div>
      </div>
    </div>
  );
};

export default AuthLayout;
