import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { submitTransferRequest } from '../../services/transferService';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { useToast } from '../ui/use-toast';

type FormData = {
  currentInstitution: string;
  targetInstitution: string;
  reason: string;
  witnessDocument: FileList;
};

export function TransferRequestForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      await submitTransferRequest({
        ...data,
        witnessDocument: data.witnessDocument[0]
      });
      
      toast({
        title: 'Success',
        description: 'Your transfer request has been submitted successfully',
        variant: 'default',
      });
      
      navigate('/transfers/my-requests');
    } catch (error) {
      console.error('Error submitting transfer request:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit transfer request. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Institution Transfer Request</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="currentInstitution">
            Current Institution
          </label>
          <Input
            id="currentInstitution"
            {...register('currentInstitution', { required: 'Current institution is required' })}
            placeholder="Enter your current institution"
          />
          {errors.currentInstitution && (
            <p className="text-sm text-red-500 mt-1">{errors.currentInstitution.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="targetInstitution">
            Target Institution
          </label>
          <Input
            id="targetInstitution"
            {...register('targetInstitution', { required: 'Target institution is required' })}
            placeholder="Enter the institution you want to transfer to"
          />
          {errors.targetInstitution && (
            <p className="text-sm text-red-500 mt-1">{errors.targetInstitution.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="reason">
            Reason for Transfer
          </label>
          <Textarea
            id="reason"
            {...register('reason', { required: 'Please provide a reason for transfer' })}
            rows={4}
            placeholder="Explain why you want to transfer..."
          />
          {errors.reason && (
            <p className="text-sm text-red-500 mt-1">{errors.reason.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="witnessDocument">
            Witness Document (PDF only, max 5MB)
          </label>
          <Input
            id="witnessDocument"
            type="file"
            accept=".pdf"
            {...register('witnessDocument', {
              required: 'Witness document is required',
              validate: {
                isPdf: (files) => {
                  if (!files?.[0]) return true;
                  return files[0].type === 'application/pdf' || 'Only PDF files are allowed';
                },
                fileSize: (files) => {
                  if (!files?.[0]) return true;
                  return files[0].size <= 5 * 1024 * 1024 || 'File size must be less than 5MB';
                },
              },
            })}
          />
          {errors.witnessDocument && (
            <p className="text-sm text-red-500 mt-1">
              {errors.witnessDocument.message as string}
            </p>
          )}
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </Button>
        </div>
      </form>
    </div>
  );
}
