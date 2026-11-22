import { InvalidGuest } from '@/components/InvalidGuest';

export const metadata = {
  title: 'Thiệp mời tốt nghiệp · XMINH',
};

export default function HomePage() {
  // Requirement 4: "link mỗi guest là /guest-id. không cho phép sửa url."
  // When accessing root "/", inform the user that each guest must access via their designated "/guest-id" link.
  return <InvalidGuest reason="no_id" />;
}
