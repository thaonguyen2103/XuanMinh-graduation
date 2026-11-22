'use client';

import React, { useState } from 'react';
import { Guest, HostInfo } from '@/types/invitation';

interface HeroProps {
  guest: Guest;
  host: HostInfo;
}

export const Hero: React.FC<HeroProps> = ({ guest, host }) => {
  // Determine guest message
  const personalizedMessage = (guest.message || host.defaultMessage).replace(/\{name\}/g, guest.name);

  // Determine photo path:
  // Normal guests: use image 1 (/images/1.jpg)
  // VIP guests: use individual image named after their ID (/images/[id].png)
  const defaultPhotoSrc = '/images/1.jpg';
  const initialPhotoSrc = guest.type === 'vip' ? `/images/${guest.id}.png` : defaultPhotoSrc;

  const [imgSrc, setImgSrc] = useState<string>(initialPhotoSrc);

  const signatureSrc = host.signatureImage || '/images/signature.png';

  return (
    <header className="hero">
      <div className="hero-in">
        <div>
          <div className="kicker mono">Graduation Party · Chỉ dành cho khách mời</div>
          <h1>
            <span className="small">Lễ</span>
            <span className="big">
              Tốt
              <br />
              Nghiệp
            </span>
          </h1>

          <div className="for">
            <small className="mono">
              Vé mời dành cho {guest.type === 'vip' && <span className="font-bold text-[#b58117]">(VIP)</span>}
            </small>
            <b>{guest.name}</b>
          </div>

          <div className="note">
            <p className="thanks">{personalizedMessage}</p>
            <div className="closing mono">{host.closing || 'Thân mến,'}</div>
            <div className={`signature ${host.signatureInvert ? 'invert' : ''}`}>
              <img
                src={signatureSrc}
                alt="Chữ ký"
                width={200}
                height={124}
                style={{ height: '124px', width: 'auto' }}
              />
            </div>
          </div>
        </div>

        <div className="stage">
          <div className="record" aria-hidden="true"></div>

          <figure className="photo">
            <img
              src={imgSrc}
              alt={`Ảnh tốt nghiệp dành cho ${guest.name}`}
              width={1000}
              height={1149}
              onError={() => {
                // If specific VIP image is not found, fallback gracefully to default photo
                if (imgSrc !== defaultPhotoSrc) {
                  setImgSrc(defaultPhotoSrc);
                }
              }}
            />
            <figcaption className="mono">
              <span>Class of 2026 · Một chương mới →</span>
            </figcaption>
          </figure>

          <div className="sticker" aria-hidden="true">
            <div>
              Only once
              <br />
              in life
              <small>★ 2026 ★</small>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
