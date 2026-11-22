'use client';

import React, { useState } from 'react';
import { Guest, HostInfo } from '@/types/invitation';

interface HeroProps {
  guest: Guest;
  host: HostInfo;
}

export const Hero: React.FC<HeroProps> = ({ guest, host }) => {
  const personalizedMessage = (guest.message || host.defaultMessage).replace(/\{name\}/g, guest.name);

  // Default graduation photo
  const defaultPhotoSrc = '/images/default-photo.jpg';

  // Support both guest-imgs and direct images folder for VIP
  const initialPhotoSrc = guest.type === 'vip' 
    ? `/images/guest-imgs/${guest.id}.jpg` 
    : defaultPhotoSrc;

  const [imgSrc, setImgSrc] = useState<string>(initialPhotoSrc);
  const [isLandscape, setIsLandscape] = useState<boolean>(true);
  const [spinFast, setSpinFast] = useState<boolean>(false);

  const signatureSrc = host.signatureImage || '/images/signature.png';

  const handleImageError = () => {
    // If guest-imgs .jpg fails, try .png, then /images/[id].png, then default photo
    if (imgSrc.includes('guest-imgs') && imgSrc.endsWith('.jpg')) {
      setImgSrc(`/images/guest-imgs/${guest.id}.png`);
    } else if (imgSrc.includes('guest-imgs')) {
      setImgSrc(`/images/${guest.id}.png`);
    } else if (imgSrc !== defaultPhotoSrc) {
      setImgSrc(defaultPhotoSrc);
    }
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.naturalWidth > img.naturalHeight) {
      setIsLandscape(true);
    } else {
      setIsLandscape(false);
    }
  };

  const toggleRecordSpin = () => {
    setSpinFast(prev => !prev);
  };

  return (
    <header className="hero">
      <div className="hero-in">
        {/* SÂN KHẤU (ẢNH + ĐĨA THAN + STICKER) */}
        <div 
          className={`stage ${isLandscape ? 'is-landscape' : 'is-portrait'} ${spinFast ? 'fast-spin' : ''}`}
          onClick={toggleRecordSpin}
          title="Chạm vào đĩa than để quẩy nhạc"
        >
          {/* Đĩa than xoay tròn phía sau ảnh */}
          <div className="record" aria-hidden="true">
            <div className="record-center"></div>
          </div>

          {/* Khung ảnh Polaroid tự co giãn theo tỷ lệ ảnh thực tế */}
          <figure className="photo">
            <img
              src={imgSrc}
              alt={`Ảnh tốt nghiệp của ${guest.name}`}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
            <figcaption className="mono">
              <span>CLASS OF 2026 · MỘT CHƯƠNG MỚI →</span>
            </figcaption>
          </figure>

          {/* Huy hiệu sticker vàng */}
          <div className="sticker" aria-hidden="true">
            <div>
              ONLY ONCE
              <br />
              IN LIFE
              <small>★ 2026 ★</small>
            </div>
          </div>
        </div>

        {/* NỘI DUNG VĂN BẢN (BANNER + TIÊU ĐỀ + VÉ MỜI + LỜI CHÚC + CHỮ KÝ) */}
        <div className="hero-content">
          <div className="kicker mono">GRADUATION PARTY · CHỈ DÀNH CHO KHÁCH MỜI</div>

          <h1>
            <span className="small">LỄ</span>
            <span className="big">
              TỐT
              <br />
              NGHIỆP
            </span>
          </h1>

          <div className="for">
            <small className="mono">VÉ MỜI DÀNH CHO</small>
            <b>{guest.name}</b>
          </div>

          <div className="note">
            <p className="thanks">{personalizedMessage}</p>
            <div className="closing mono">{host.closing || 'THÂN MẾN,'}</div>
            <div className={`signature ${host.signatureInvert ? 'invert' : ''}`}>
              <img
                src={signatureSrc}
                alt="Chữ ký"
                width={200}
                height={124}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
