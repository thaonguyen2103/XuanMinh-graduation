'use client';

import React from 'react';
import Link from 'next/link';

interface InvalidGuestProps {
  attemptedId?: string;
  reason?: 'not_found' | 'no_id';
}

export const InvalidGuest: React.FC<InvalidGuestProps> = ({ attemptedId, reason = 'not_found' }) => {
  return (
    <div className="min-h-screen flex flex-col justify-between" style={{ background: 'var(--denim)' }}>
      <div className="topbar mono">
        <span>Graduation Gig · Live</span>
        <span>Access Error</span>
        <span>Invalid Link</span>
      </div>

      <div className="notice-box">
        <h2>Thiệp Mời Không Hợp Lệ</h2>
        {reason === 'no_id' ? (
          <p>
            Bạn đang truy cập trực tiếp vào trang chủ. Mỗi khách mời có một liên kết thiệp mời riêng dạng{' '}
            <code className="text-[#ecd39a] bg-[#0d1520] px-2 py-1 rounded">/[mã-khách-mời]</code>.
            <br />
            <br />
            Vui lòng sử dụng đúng liên kết cá nhân được gửi cho bạn trong thư mời!
          </p>
        ) : (
          <p>
            Mã khách mời <strong className="text-[#ecd39a]">&ldquo;{attemptedId}&rdquo;</strong> không tồn tại trong danh sách hoặc đường dẫn đã bị chỉnh sửa.
            <br />
            <br />
            Hệ thống không cho phép chỉnh sửa URL. Vui lòng bấm vào đúng liên kết thiệp mời ban đầu đã được gửi cho bạn.
          </p>
        )}

        <div className="mt-8 pt-6 border-t border-[#3a6ba8] text-sm text-[#a9bad6]">
          <p className="mb-4">Liên kết mẫu dùng thử trong danh sách JSON:</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/vip-01"
              className="bg-[#ecd39a] text-[#0d1520] font-bold px-4 py-2 hover:opacity-90 transition rounded-sm text-xs mono"
            >
              /vip-01 (VIP)
            </Link>
            <Link
              href="/vip-02"
              className="bg-[#ecd39a] text-[#0d1520] font-bold px-4 py-2 hover:opacity-90 transition rounded-sm text-xs mono"
            >
              /vip-02 (VIP Đã xác nhận)
            </Link>
            <Link
              href="/guest-01"
              className="bg-[#c9d6ea] text-[#0d1520] font-bold px-4 py-2 hover:opacity-90 transition rounded-sm text-xs mono"
            >
              /guest-01 (Normal)
            </Link>
            <Link
              href="/guest-02"
              className="bg-[#c9d6ea] text-[#0d1520] font-bold px-4 py-2 hover:opacity-90 transition rounded-sm text-xs mono"
            >
              /guest-02 (Normal)
            </Link>
            <Link
              href="/guest-xminh"
              className="bg-[#c9d6ea] text-[#0d1520] font-bold px-4 py-2 hover:opacity-90 transition rounded-sm text-xs mono"
            >
              /guest-xminh
            </Link>
          </div>
        </div>
      </div>

      <footer className="mono">
        <p>Graduation Invitation Platform — XMINH</p>
      </footer>
    </div>
  );
};
