'use client';

import React from 'react';
import { HostInfo } from '@/types/invitation';
import { CountdownTimer } from './CountdownTimer';

interface CassettesSectionProps {
  host: HostInfo;
}

export const CassettesSection: React.FC<CassettesSectionProps> = ({ host }) => {
  const eventDate = new Date(host.time);

  // Formatting date helpers for Vietnamese
  const fmt = (options: Intl.DateTimeFormatOptions) => {
    try {
      return new Intl.DateTimeFormat('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
        ...options,
      }).format(eventDate);
    } catch {
      return '--';
    }
  };

  const dayNum = fmt({ day: '2-digit' });
  const monthYear = `Tháng ${fmt({ month: 'numeric' })} · ${fmt({ year: 'numeric' })}`;
  const weekday = fmt({ weekday: 'long' });
  const timeStr = fmt({ hour: '2-digit', minute: '2-digit', hour12: false });

  return (
    <section className="tickets" aria-label="Thông tin buổi lễ">
      <div className="section-label mono">
        <div className="flex items-center gap-2">
          <span>Side A · Mix by <span className="mix-by">{host.name}</span></span>
          <span className="equalizer" aria-hidden="true">
            <span className="equalizer-bar"></span>
            <span className="equalizer-bar"></span>
            <span className="equalizer-bar"></span>
            <span className="equalizer-bar"></span>
          </span>
        </div>
      </div>

      {/* SVG Reel Symbol for Cassette Deck */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <symbol id="reel" viewBox="0 0 60 60">
          <circle cx="30" cy="30" r="27" fill="#1b2636" stroke="#c9d6ea" strokeWidth="2" />
          <circle cx="30" cy="30" r="15" fill="#eef3fa" />
          <g stroke="#0d1520" strokeWidth="4" strokeLinecap="round">
            <line x1="30" y1="30" x2="30" y2="20" />
            <line x1="30" y1="30" x2="38.7" y2="35" />
            <line x1="30" y1="30" x2="21.3" y2="35" />
          </g>
          <circle cx="30" cy="30" r="4" fill="#0d1520" />
        </symbol>
      </svg>

      <div className="tapes">
        {/* Track 01: Date */}
        <article className="cassette" title="Di chuột để tua nhanh băng">
          <span className="screw tl"></span>
          <span className="screw tr"></span>
          <span className="screw bl"></span>
          <span className="screw br"></span>
          <div className="label">
            <div className="label-head mono">
              <span>Side A</span>
              <span>
                Track <b>01</b>
              </span>
            </div>
            <div className="trk">
              <div className="lbl mono">A1 · Ngày</div>
              <div className="big date-num">{dayNum}</div>
              <div className="note-s">
                <strong>{monthYear}</strong>
                <br />
                <span>{weekday}</span>
              </div>
            </div>
            <div className="label-band"></div>
          </div>
          <div className="deck" aria-hidden="true">
            <div className="base">
              <span className="hole h1"></span>
              <span className="hole h3"></span>
              <span className="hole h4"></span>
              <span className="hole h2"></span>
              <div className="window">
                <svg className="reel" viewBox="0 0 60 60">
                  <use href="#reel" />
                </svg>
                <svg className="reel r2" viewBox="0 0 60 60">
                  <use href="#reel" />
                </svg>
              </div>
            </div>
          </div>
        </article>

        {/* Track 02: Time */}
        <article className="cassette" title="Di chuột để tua nhanh băng">
          <span className="screw tl"></span>
          <span className="screw tr"></span>
          <span className="screw bl"></span>
          <span className="screw br"></span>
          <div className="label">
            <div className="label-head mono">
              <span>Side A</span>
              <span>
                Track <b>02</b>
              </span>
            </div>
            <div className="trk">
              <div className="lbl mono">A2 · Giờ</div>
              <div className="big time-num">{timeStr}</div>
              <div className="note-s">{host.timeNote || 'Cửa mở trước 30 phút'}</div>
            </div>
            <div className="label-band"></div>
          </div>
          <div className="deck" aria-hidden="true">
            <div className="base">
              <span className="hole h1"></span>
              <span className="hole h3"></span>
              <span className="hole h4"></span>
              <span className="hole h2"></span>
              <div className="window">
                <svg className="reel" viewBox="0 0 60 60">
                  <use href="#reel" />
                </svg>
                <svg className="reel r2" viewBox="0 0 60 60">
                  <use href="#reel" />
                </svg>
              </div>
            </div>
          </div>
        </article>

        {/* Track 03: Place */}
        <article className="cassette" title="Di chuột để tua nhanh băng">
          <span className="screw tl"></span>
          <span className="screw tr"></span>
          <span className="screw bl"></span>
          <span className="screw br"></span>
          <div className="label">
            <div className="label-head mono">
              <span>Side A</span>
              <span>
                Track <b>03</b>
              </span>
            </div>
            <div className="trk">
              <div className="lbl mono">A3 · Địa điểm</div>
              <div className="big place-name">{host.placeName}</div>
              <div className="note-s">
                <span>{host.address}</span>
              </div>
              {host.mapUrl && (
                <a href={host.mapUrl} target="_blank" rel="noopener noreferrer">
                  Xem bản đồ
                </a>
              )}
            </div>
            <div className="label-band"></div>
          </div>
          <div className="deck" aria-hidden="true">
            <div className="base">
              <span className="hole h1"></span>
              <span className="hole h3"></span>
              <span className="hole h4"></span>
              <span className="hole h2"></span>
              <div className="window">
                <svg className="reel" viewBox="0 0 60 60">
                  <use href="#reel" />
                </svg>
                <svg className="reel r2" viewBox="0 0 60 60">
                  <use href="#reel" />
                </svg>
              </div>
            </div>
          </div>
        </article>
      </div>

      <CountdownTimer targetDate={host.time} />
    </section>
  );
};
