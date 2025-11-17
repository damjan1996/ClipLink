export interface Clipper {
  id: string;
  name: string;
  email: string;
  registeredChannels?: string[];
  strikes: number;
  paymentBlocked: boolean;
  createdAt: Date;
}

export interface Video {
  id: string;
  clipperId: string;
  filename: string;
  uploadLink?: string;
  platform?: string;
  blobUrl?: string;
  videoHash?: string;
  audioFingerprint?: string;
  frameHashes?: string[];
  fileSize?: number;
  duration?: number;
  uploadDate: Date;
  validationStatus: 'pending' | 'approved' | 'rejected' | 'manual_review';
  confidenceScore?: number;
  duplicateOf?: string;
  videoType: 'normal' | 'translation';
  basePayment?: number;
  viewCount: number;
}

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  confidence: number;
  duplicateOf?: string;
  decision: 'auto_approve' | 'auto_reject' | 'manual_review';
}

export interface VideoProcessingResult {
  videoId: string;
  frameHashes: string[];
  audioFingerprint: string;
  duration: number;
  fileSize: number;
}

export interface UploadResponse {
  success: boolean;
  videoId?: string;
  status?: string;
  confidence?: number;
  message?: string;
}