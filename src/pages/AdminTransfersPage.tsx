import { TransferRequestList } from '@/components/transfers/TransferRequestList';

export function AdminTransfersPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Institution Transfer Requests</h1>
      </div>
      
      <TransferRequestList isAdminView={true} />
    </div>
  );
}
