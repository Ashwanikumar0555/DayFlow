import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const LeavePage = () => {
  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Leave Management</h2>
            <Button>Apply for Leave</Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
            {['Casual Leave', 'Sick Leave', 'Earned Leave', 'Unpaid Leave'].map((type) => (
                <Card key={type}>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">{type}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12 / 12</div>
                        <p className="text-xs text-muted-foreground">Available</p>
                    </CardContent>
                </Card>
            ))}
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Leave Requests</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground text-center py-10">No pending leave requests.</p>
            </CardContent>
        </Card>
    </div>
  );
};

export default LeavePage;
