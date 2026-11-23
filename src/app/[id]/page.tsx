import { Metadata } from 'next';
import { getInvitationData, getGuestById } from '@/lib/data';
import { TopBar } from '@/components/TopBar';
import { Hero } from '@/components/Hero';
import { CassettesSection } from '@/components/CassettesSection';
import { RSVPSection } from '@/components/RSVPSection';
import { SaveInvitation } from '@/components/SaveInvitation';
import { Footer } from '@/components/Footer';
import { InvalidGuest } from '@/components/InvalidGuest';

interface PageProps {
  params: {
    id: string;
  };
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const guest = await getGuestById(params.id);
  if (!guest) {
    return {
      title: 'Thiệp mời không hợp lệ',
    };
  }

  return {
    title: `Thiệp mời · ${guest.name}`,
    description: `Thiệp mời tham dự lễ tốt nghiệp gửi đến ${guest.name}`,
  };
}

export default async function GuestInvitePage({ params }: PageProps) {
  const { id } = params;
  const [invitationData, guest] = await Promise.all([
    getInvitationData(),
    getGuestById(id),
  ]);

  // If the guest is not found or url has been modified to an invalid ID
  if (!guest) {
    return <InvalidGuest attemptedId={id} reason="not_found" />;
  }

  return (
    <div className="min-h-screen">
      <TopBar eventDate={invitationData.host.time} />
      <Hero guest={guest} host={invitationData.host} />
      <main>
        <CassettesSection host={invitationData.host} />
        <RSVPSection guest={guest} />
        <SaveInvitation guest={guest} host={invitationData.host} />
      </main>
      <Footer graduateName={invitationData.host.name} phone={invitationData.host.phone} />
    </div>
  );
}
