'use client';

import React from 'react';

interface TopBarProps {
  eventDate: string;
}

export const TopBar: React.FC<TopBarProps> = ({ eventDate }) => {
  // Format date for Vietnam locale: DD/MM/YYYY
  const formattedDate = React.useMemo(() => {
    try {
      const d = new Date(eventDate);
      return new Intl.DateTimeFormat('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(d);
    } catch {
      return '';
    }
  }, [eventDate]);

  return (
    <div className="topbar mono">
      <div className="flex items-center">
        <span>Graduation Gig · Live</span>
        <span className="equalizer" aria-hidden="true" title="Audio playing">
          <span className="equalizer-bar"></span>
          <span className="equalizer-bar"></span>
          <span className="equalizer-bar"></span>
          <span className="equalizer-bar"></span>
          <span className="equalizer-bar"></span>
        </span>
      </div>
      <span>{formattedDate}</span>
      <span>Admit One</span>
    </div>
  );
};
