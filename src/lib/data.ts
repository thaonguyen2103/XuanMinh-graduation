import fs from 'fs';
import path from 'path';
import { InvitationData, Guest } from '@/types/invitation';

// Path to invitation.json
const DATA_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'invitation.json');

/**
 * Read invitation data from JSON file
 */
export function getInvitationData(): InvitationData {
  try {
    const rawData = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
    return JSON.parse(rawData) as InvitationData;
  } catch (error) {
    console.error('Error reading invitation.json:', error);
    throw new Error('Could not read invitation data');
  }
}

/**
 * Find guest by ID (case-insensitive for convenience and user friendliness)
 */
export function getGuestById(id: string): Guest | null {
  if (!id) return null;
  const data = getInvitationData();
  const normalizedId = id.trim().toLowerCase();
  const guest = data.guests.find((g) => g.id.toLowerCase() === normalizedId);
  return guest || null;
}

/**
 * Check if a guest ID exists in invitation data
 */
export function isValidGuestId(id: string): boolean {
  return getGuestById(id) !== null;
}

/**
 * Update guest confirmation status in JSON file
 */
export function confirmGuestAttendance(id: string): { success: boolean; guest?: Guest; error?: string } {
  try {
    if (!id) {
      return { success: false, error: 'Mã khách mời không hợp lệ.' };
    }

    const data = getInvitationData();
    const normalizedId = id.trim().toLowerCase();
    const guestIndex = data.guests.findIndex((g) => g.id.toLowerCase() === normalizedId);

    if (guestIndex === -1) {
      return { success: false, error: 'Không tìm thấy khách mời trong hệ thống.' };
    }

    // Update confirmation to true
    data.guests[guestIndex].confirmation = true;

    // Write back to JSON file formatted nicely
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');

    return { success: true, guest: data.guests[guestIndex] };
  } catch (error) {
    console.error('Error updating confirmation in invitation.json:', error);
    return { success: false, error: 'Lỗi khi cập nhật trạng thái xác nhận.' };
  }
}
