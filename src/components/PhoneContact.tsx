'use client';

import React, { useState, useEffect } from 'react';

interface PhoneContactProps {
  phone?: string;
  name?: string;
  label?: string;
  variant?: 'badge' | 'button' | 'pill';
}

export const PhoneContact: React.FC<PhoneContactProps> = ({
  phone = '+84834926699',
  name = 'XMINH',
  label = 'HOTLINE',
  variant = 'badge',
}) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Format phone display nicely (0834 926 699 gọn gàng)
  const formatPhone = (raw: string) => {
    if (raw.startsWith('+84') && raw.length === 12) {
      return `0${raw.slice(3, 6)} ${raw.slice(6, 9)} ${raw.slice(9)}`;
    }
    if (raw.startsWith('0') && raw.length === 10) {
      return `${raw.slice(0, 4)} ${raw.slice(4, 7)} ${raw.slice(7)}`;
    }
    return raw;
  };

  const displayPhone = formatPhone(phone);

  const isMobileMode = () => {
    if (typeof window === 'undefined') return false;
    const ua = navigator.userAgent;
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth <= 768;
    const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    return isMobileUA || (isTouch && isSmallScreen);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isMobileMode()) {
      // Ở chế độ điện thoại: gọi luôn
      window.location.href = `tel:${phone}`;
    } else {
      // Ở chế độ máy tính (ko thể gọi trực tiếp): hiện nút / popover copy
      setShowModal(true);
    }
  };

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(phone);
      } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = phone;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowModal(false);
      }
    };
    if (showModal) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showModal]);

  return (
    <>
      <div className="phone-contact-wrapper">
        <button
          type="button"
          onClick={handleClick}
          className={`phone-trigger-btn mono ${variant}`}
          title="Bấm để gọi (điện thoại) hoặc sao chép số (máy tính)"
        >
          <span className="phone-icon" aria-hidden="true">📞</span>
          {label && <span className="phone-label-text">{label}:</span>}
          <span className="phone-num-text">{displayPhone}</span>
        </button>
      </div>

      {/* Popover / Modal khi bấm trên máy tính */}
      {showModal && (
        <div 
          className="phone-modal-backdrop" 
          onClick={() => setShowModal(false)}
          role="dialog"
          aria-modal="true"
        >
          <div 
            className="phone-modal-box" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Dải băng dính trang trí */}
            <div className="phone-modal-tape"></div>

            <button 
              type="button" 
              className="phone-modal-close mono"
              onClick={() => setShowModal(false)}
              aria-label="Đóng"
            >
              ✕
            </button>

            <div className="phone-modal-kicker mono">LIÊN HỆ TRỰC TIẾP</div>
            <h3 className="phone-modal-title">SỐ ĐIỆN THOẠI {name.toUpperCase()}</h3>

            <div className="phone-modal-display mono">
              {displayPhone}
            </div>

            <p className="phone-modal-hint">
              Bạn đang duyệt web trên máy tính. Bạn có thể sao chép số hoặc gọi qua ứng dụng liên kết:
            </p>

            <div className="phone-modal-actions">
              <button
                type="button"
                className={`phone-action-btn copy-btn mono ${copied ? 'copied' : ''}`}
                onClick={handleCopy}
              >
                {copied ? '✓ ĐÃ SAO CHÉP!' : '📋 SAO CHÉP SỐ'}
              </button>

              <a
                href={`tel:${phone}`}
                className="phone-action-btn call-btn mono"
              >
                📞 GỌI ĐIỆN
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
