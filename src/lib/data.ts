import fs from 'fs';
import path from 'path';
import { InvitationData, Guest } from '@/types/invitation';

const DATA_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'invitation.json');
const GITHUB_FILE_PATH = 'src/data/invitation.json';
const GITHUB_API_VERSION = '2022-11-28';

interface GitHubFileResponse {
  content: string;
  sha: string;
}

function getGitHubConfig() {
  const token = process.env.GITHUB_TOKEN;
  const repository = process.env.GITHUB_REPOSITORY;
  const branch = process.env.GITHUB_BRANCH || 'main';

  if (!token || !repository) {
    if (process.env.VERCEL) {
      throw new Error('GITHUB_TOKEN and GITHUB_REPOSITORY must be configured on Vercel.');
    }
    return null;
  }

  return { token, repository, branch };
}

async function getGitHubFile(config: NonNullable<ReturnType<typeof getGitHubConfig>>) {
  const response = await fetch(
    `https://api.github.com/repos/${config.repository}/contents/${GITHUB_FILE_PATH}?ref=${encodeURIComponent(config.branch)}`,
    {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${config.token}`,
        'X-GitHub-Api-Version': GITHUB_API_VERSION,
      },
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    throw new Error(`GitHub returned ${response.status} while reading invitation data.`);
  }

  return response.json() as Promise<GitHubFileResponse>;
}

function decodeGitHubFile(file: GitHubFileResponse): InvitationData {
  return JSON.parse(Buffer.from(file.content.replace(/\s/g, ''), 'base64').toString('utf-8')) as InvitationData;
}

/**
 * Read invitation data from JSON file
 */
export async function getInvitationData(): Promise<InvitationData> {
  const config = getGitHubConfig();
  if (config) {
    return decodeGitHubFile(await getGitHubFile(config));
  }

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
export async function getGuestById(id: string): Promise<Guest | null> {
  if (!id) return null;
  const data = await getInvitationData();
  const normalizedId = id.trim().toLowerCase();
  const guest = data.guests.find((g) => g.id.toLowerCase() === normalizedId);
  return guest || null;
}

/**
 * Check if a guest ID exists in invitation data
 */
export async function isValidGuestId(id: string): Promise<boolean> {
  return (await getGuestById(id)) !== null;
}

/**
 * Update guest confirmation status in JSON file
 */
export async function confirmGuestAttendance(
  id: string
): Promise<{ success: boolean; guest?: Guest; error?: string }> {
  if (!id) {
    return { success: false, error: 'Mã khách mời không hợp lệ.' };
  }

  const config = getGitHubConfig();
  const normalizedId = id.trim().toLowerCase();

  for (let attempt = 0; attempt < 3; attempt++) {
    const file = config ? await getGitHubFile(config) : null;
    const data = file
      ? decodeGitHubFile(file)
      : await getInvitationData();
    const guestIndex = data.guests.findIndex((guest) => guest.id.toLowerCase() === normalizedId);

    if (guestIndex === -1) {
      return { success: false, error: 'Không tìm thấy khách mời trong hệ thống.' };
    }

    data.guests[guestIndex].confirmation = true;

    if (!config) {
      fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
      return { success: true, guest: data.guests[guestIndex] };
    }
    if (!file) {
      throw new Error('Could not read invitation.json from GitHub before saving RSVP.');
    }

    const response = await fetch(
      `https://api.github.com/repos/${config.repository}/contents/${GITHUB_FILE_PATH}`,
      {
        method: 'PUT',
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${config.token}`,
          'X-GitHub-Api-Version': GITHUB_API_VERSION,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Confirm RSVP for ${data.guests[guestIndex].id}`,
          content: Buffer.from(JSON.stringify(data, null, 2), 'utf-8').toString('base64'),
          sha: file.sha,
          branch: config.branch,
        }),
        cache: 'no-store',
      }
    );

    if (response.ok) {
      return { success: true, guest: data.guests[guestIndex] };
    }

    if (response.status !== 409 && response.status !== 422) {
      throw new Error(`GitHub returned ${response.status} while saving RSVP.`);
    }
  }

  throw new Error('Could not save RSVP after concurrent updates to invitation.json.');
}
