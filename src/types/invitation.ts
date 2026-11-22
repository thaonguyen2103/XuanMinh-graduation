export interface HostInfo {
  name: string;
  time: string; // ISO 8601 string, e.g. "2026-12-20T18:00:00+07:00"
  timeNote: string;
  placeName: string;
  address: string;
  mapUrl: string;
  closing: string;
  defaultMessage: string;
  signatureImage?: string;
  signatureInvert?: boolean;
}

export type GuestType = 'normal' | 'vip';

export interface Guest {
  id: string;
  name: string;
  type: GuestType;
  confirmation: boolean;
  message?: string;
}

export interface InvitationData {
  host: HostInfo;
  guests: Guest[];
}
