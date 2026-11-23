'use client';

import React from 'react';
import { HostInfo } from '@/types/invitation';
import { CountdownTimer } from './CountdownTimer';
import { PhoneContact } from './PhoneContact';

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
  const monthNumber = Number(fmt({ month: 'numeric' }));
  const yearNumber = Number(fmt({ year: 'numeric' }));
  const monthYear = `Tháng ${monthNumber} · ${yearNumber}`;
  const weekday = fmt({ weekday: 'long' });
  const timeStr = fmt({ hour: '2-digit', minute: '2-digit', hour12: false });
  const firstWeekday = (new Date(Date.UTC(yearNumber, monthNumber - 1, 1)).getUTCDay() + 6) % 7;
  const daysInMonth = new Date(Date.UTC(yearNumber, monthNumber, 0)).getUTCDate();
  const calendarDays = Array.from({ length: 42 }, (_, index) => {
    const day = index - firstWeekday + 1;
    return day > 0 && day <= daysInMonth ? day : null;
  });
  const weekdayLabels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

  return (
    <section className="tickets" id="ticketsSection" aria-label="Thông tin buổi lễ">
      <div className="section-label mono">
        Side A · Mix by <span className="mix-by">{host.name}</span>
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
        <article className="cassette">
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
            <div className="trk date-track">
              <div className="lbl mono">A1 · Ngày</div>
              <div className="date-calendar-content">
                <div className="date-highlight">
                  <div className="big date-num">{dayNum}</div>
                  <div className="note-s">
                    <strong>{monthYear}</strong>
                    <span>{weekday}</span>
                  </div>
                </div>
                <div className="mini-calendar" aria-label={`Lịch ${monthYear}`}>
                  <div className="mini-calendar-title mono">{monthYear}</div>
                  <div className="mini-calendar-grid">
                    {weekdayLabels.map((label) => (
                      <span className="mini-calendar-weekday" key={label}>{label}</span>
                    ))}
                    {calendarDays.map((day, index) => (
                      <span
                        className={`mini-calendar-day${day === Number(dayNum) ? ' event-day' : ''}`}
                        key={index}
                      >
                        {day || ''}
                      </span>
                    ))}
                  </div>
                </div>
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
        <article className="cassette">
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
        <article className="cassette">
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
              <div className="track-actions">
                {host.mapUrl && (
                  <a href={host.mapUrl} target="_blank" rel="noopener noreferrer" className="map-btn">
                    Xem bản đồ
                  </a>
                )}
                {host.phone && (
                  <PhoneContact phone={host.phone} name={host.name} variant="badge" label="Hotline" />
                )}
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
      </div>

      <CountdownTimer targetDate={host.time} />
    </section>
  );
};
