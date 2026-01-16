import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { useToast } from '../ui/use-toast';
import { getTransferRequests, getMyTransferRequests, updateTransferStatus } from '../../services/transferService';
import { useAuth } from '../../hooks/useAuth';

type TransferRequest = {
  id: string;
  current_institution: string;
  target_institution: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  document_url: string;
  admin_notes?: string;
  student_name?: string;
  student_trade?: string;
};

type TransferRequestListProps = {
  isAdminView?: boolean;
};

export function TransferRequestList({ isAdminView = false }: TransferRequestListProps) {
  const [requests, setRequests] = useState<TransferRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const response = isAdminView 
        ? await getTransferRequests() 
        : await getMyTransferRequests();
      setRequests(response.transfers || []);
    } catch (error) {
      console.error('Error fetching transfer requests:', error);
      toast({
        title: 'Error',
        description: 'Failed to load transfer requests',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [isAdminView]);

  const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await updateTransferStatus(id, status);
      toast({
        title: 'Success',
        description: `Transfer request ${status} successfully`,
        variant: 'default',
      });
      fetchRequests();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update transfer status',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading transfer requests...</div>;
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No transfer requests found</p>
        {!isAdminView && (
          <Button className="mt-4" onClick={() => navigate('/transfers/new')}>
            Create New Request
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {isAdminView && (
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Institution Transfer Requests</h2>
        </div>
      )}

      <div className="space-y-4">
        {requests.map((request) => (
          <Card key={request.id} className="overflow-hidden">
            <CardHeader className="bg-muted/50 p-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    {isAdminView ? (
                      <>
                        {request.student_name} - {request.student_trade}
                      </>
                    ) : (
                      'Transfer Request'
                    )}
                  </CardTitle>
                  <div className="text-sm text-muted-foreground mt-1">
                    {format(new Date(request.created_at), 'MMM d, yyyy h:mm a')}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(request.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Current Institution</h4>
                  <p>{request.current_institution}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Target Institution</h4>
                  <p>{request.target_institution}</p>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-muted-foreground">Reason</h4>
                <p className="whitespace-pre-line">{request.reason}</p>
              </div>

              {request.admin_notes && (
                <div className="mb-4 p-3 bg-muted/30 rounded-md">
                  <h4 className="text-sm font-medium text-muted-foreground">Admin Notes</h4>
                  <p className="whitespace-pre-line">{request.admin_notes}</p>
                </div>
              )}

              <div className="flex flex-wrap gap-4 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(request.document_url, '_blank')}
                >
                  View Document
                </Button>

                {isAdminView && request.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleStatusUpdate(request.id, 'approved')}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleStatusUpdate(request.id, 'rejected')}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
