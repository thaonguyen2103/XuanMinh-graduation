'use client';

import React from 'react';
import { PhoneContact } from './PhoneContact';

interface FooterProps {
  graduateName: string;
  phone?: string;
}

export const Footer: React.FC<FooterProps> = ({ graduateName, phone }) => {
  return (
    <footer className="mono">
      {phone && (
        <div className="footer-hotline">
          <PhoneContact phone={phone} name={graduateName} variant="pill" label="HOTLINE" />
        </div>
      )}
      <p>
        Made with <b>♥</b> &amp; loud music — <b>{graduateName}</b>
      </p>
    </footer>
  );
};
