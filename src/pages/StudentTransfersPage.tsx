import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TransferRequestList } from '@/components/transfers/TransferRequestList';
import { TransferRequestForm } from '@/components/transfers/TransferRequestForm';

export function StudentTransfersPage() {
  const [activeTab, setActiveTab] = useState('my-requests');
  const [showNewForm, setShowNewForm] = useState(false);

  if (showNewForm) {
    return (
      <div className="container mx-auto py-8">
        <Button 
          variant="ghost" 
          onClick={() => setShowNewForm(false)}
          className="mb-6"
        >
          ← Back to My Requests
        </Button>
        <TransferRequestForm />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Institution Transfers</h1>
        <Button onClick={() => setShowNewForm(true)}>
          New Transfer Request
        </Button>
      </div>

      <Tabs 
        defaultValue="my-requests" 
        className="w-full"
        onValueChange={setActiveTab}
      >
        <TabsList>
          <TabsTrigger value="my-requests">My Requests</TabsTrigger>
          <TabsTrigger value="new-request">New Request</TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-requests" className="mt-6">
          <TransferRequestList />
        </TabsContent>
        
        <TabsContent value="new-request" className="mt-6">
          <TransferRequestForm onSuccess={() => setActiveTab('my-requests')} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
