import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AttendancePage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Attendance</h2>
        <div className="space-x-2">
            <Button variant="outline">Weekly View</Button>
            <Button>Check In / Out</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
          <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Work Hours</CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">42h 30m</div>
                  <p className="text-xs text-muted-foreground">This week</p>
              </CardContent>
          </Card>
          <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">On Time Arrival</CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">95%</div>
                  <p className="text-xs text-muted-foreground">Last 30 days</p>
              </CardContent>
          </Card>
      </div>

       <Card>
           <CardHeader>
               <CardTitle>Daily Logs</CardTitle>
           </CardHeader>
           <CardContent>
               <div className="space-y-4">
                   <p className="text-sm text-muted-foreground text-center py-10">Select an employee or view your own logs.</p>
               </div>
           </CardContent>
       </Card>
    </div>
  );
};

export default AttendancePage;
