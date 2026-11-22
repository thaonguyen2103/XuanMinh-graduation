'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface InvalidGuestProps {
  attemptedId?: string;
  reason?: 'not_found' | 'no_id';
}

export const InvalidGuest: React.FC<InvalidGuestProps> = ({ attemptedId, reason = 'not_found' }) => {
  const [code, setCode] = useState('');
  const router = useRouter();

  const handleGo = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = code.trim();
    if (trimmed) {
      router.push(`/${trimmed}`);
    }
  };

  return (
    <div className="home-screen">
      {/* Topbar */}
      <div className="topbar mono">
        <span>GRADUATION GIG · LIVE</span>
        <span>ADMIT ONE</span>
      </div>

      <div className="home-body">
        {/* Đĩa than & sticker huy hiệu vàng ở góc trên bên phải */}
        <div className="home-decor" aria-hidden="true">
          <div className="home-record">
            <div className="home-record-center"></div>
          </div>
          <div className="home-sticker mono">
            <span className="home-sticker-title">ONLY ONCE<br />IN LIFE</span>
            <span className="home-sticker-sub">★ 2026 ★</span>
          </div>
        </div>

        {/* Khối nội dung chính */}
        <div className="home-content">
          <div className="kicker mono">THIỆP MỜI TỐT NGHIỆP · XMINH</div>

          <h1 className="home-title">
            {reason === 'no_id' ? (
              <>
                <span>THIỆP MỜI</span>
                <span>CÁ NHÂN</span>
              </>
            ) : (
              <>
                <span>KHÔNG TÌM THẤY</span>
                <span>THIỆP MỜI</span>
              </>
            )}
          </h1>

          {reason === 'no_id' ? (
            <div className="home-desc">
              <p className="home-desc-lead">
                Chào mừng bạn đến với trang thiệp mời lễ tốt nghiệp của <span className="home-name-tag">XMINH</span> .
              </p>
              <p className="home-desc-sub">
                Mỗi vị khách quý đều có một liên kết thiệp mời riêng được thiết kế kèm hình ảnh và thông điệp dành riêng cho bạn. Vui lòng truy cập theo đường link cá nhân đã nhận được.
              </p>
            </div>
          ) : (
            <div className="home-desc">
              <p className="home-desc-lead">
                Mã thiệp mời <span className="home-name-tag text-[#ecd39a]">&ldquo;{attemptedId || '...'}&rdquo;</span> không tồn tại trong danh sách.
              </p>
              <p className="home-desc-sub">
                Hệ thống bảo mật không cho phép chỉnh sửa URL tự do. Vui lòng kiểm tra lại liên kết được gửi cho bạn hoặc nhập mã thiệp mời bên dưới.
              </p>
            </div>
          )}

          {/* Vé nhập mã thiệp mời riêng */}
          <div className="home-ticket-card">
            <div className="ticket-tape"></div>
            <form onSubmit={handleGo}>
              <label htmlFor="home-code-input" className="ticket-label mono">
                BẠN CÓ MÃ THIỆP MỜI RIÊNG?
              </label>
              <div className="ticket-input-wrap">
                <input
                  id="home-code-input"
                  type="text"
                  placeholder="Nhập mã thiệp mời của bạn..."
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="ticket-input mono"
                  autoComplete="off"
                  spellCheck="false"
                />
              </div>
              <button type="submit" className="ticket-btn mono">
                <span>Mở thiệp →</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mono">
        <p>
          Made with <b>♥</b> &amp; loud music — <b>XMINH</b>
        </p>
      </footer>
    </div>
  );
};
