'use client';

import React, { useState } from 'react';
import { Guest } from '@/types/invitation';
import { triggerConfetti } from './Confetti';

interface RSVPSectionProps {
  guest: Guest;
}

export const RSVPSection: React.FC<RSVPSectionProps> = ({ guest }) => {
  const [confirmed, setConfirmed] = useState<boolean>(guest.confirmation);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'ok' | 'err' | '' }>({
    text: guest.confirmation ? 'Cảm ơn bạn! Hẹn gặp bạn tại buổi tiệc 🎸' : '',
    type: guest.confirmation ? 'ok' : '',
  });

  const handleConfirm = async () => {
    if (confirmed || loading) return;

    setLoading(true);
    setStatusMsg({ text: 'Đang xác nhận…', type: '' });

    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: guest.id }),
      });

      const result = await response.json();

      if (response.ok && result.ok) {
        setConfirmed(true);
        setStatusMsg({
          text: 'Cảm ơn bạn! Hẹn gặp bạn tại buổi tiệc 🎸',
          type: 'ok',
        });
        triggerConfetti();
      } else {
        setStatusMsg({
          text: result.error || 'Có lỗi xảy ra, vui lòng thử lại.',
          type: 'err',
        });
      }
    } catch (err) {
      console.error('RSVP error:', err);
      setStatusMsg({
        text: 'Không thể kết nối đến máy chủ. Vui lòng thử lại.',
        type: 'err',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rsvp">
      <div className="rsvp-box">
        {/* Stamp "Đã xác nhận" */}
        <div className={`stamp ${confirmed ? 'show' : ''}`} id="stamp">
          Đã xác nhận
        </div>

        <h2>
          Bạn sẽ <span>đến</span> chứ?
        </h2>

        <button
          className="btn"
          id="confirmBtn"
          disabled={confirmed || loading}
          onClick={handleConfirm}
        >
          {loading ? 'Đang gửi…' : confirmed ? 'Đã xác nhận ✓' : 'Mình sẽ đến!'}
        </button>

        <div
          className={`status ${statusMsg.type}`}
          role="status"
          aria-live="polite"
        >
          {statusMsg.text}
        </div>

        <div className="guest-id mono">
          MÃ KHÁCH: {guest.id.toUpperCase()}
        </div>
      </div>
    </section>
  );
};
