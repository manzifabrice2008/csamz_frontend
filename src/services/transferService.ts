import axios from 'axios';
import { getAuthToken } from './authService';

const API_URL = import.meta.env.VITE_API_URL || 'https://csamz-backend.onrender.com/api';

// Submit a new transfer request
export const submitTransferRequest = async (data: {
  currentInstitution: string;
  targetInstitution: string;
  reason: string;
  witnessDocument: File;
}) => {
  const formData = new FormData();
  formData.append('currentInstitution', data.currentInstitution);
  formData.append('targetInstitution', data.targetInstitution);
  formData.append('reason', data.reason);
  formData.append('witnessDocument', data.witnessDocument);

  const response = await axios.post(`${API_URL}/transfers/request`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${getAuthToken()}`
    }
  });
  return response.data;
};

// Get all transfer requests (admin only)
export const getTransferRequests = async () => {
  const response = await axios.get(`${API_URL}/transfers`, {
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`
    }
  });
  return response.data;
};

// Get my transfer requests (student)
export const getMyTransferRequests = async () => {
  const response = await axios.get(`${API_URL}/transfers/my-requests`, {
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`
    }
  });
  return response.data;
};

// Update transfer status (admin only)
export const updateTransferStatus = async (transferId: string, status: 'approved' | 'rejected', adminNotes?: string) => {
  const response = await axios.patch(
    `${API_URL}/transfers/${transferId}/status`,
    { status, adminNotes },
    {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      }
    }
  );
  return response.data;
};
