'use client';

import React from 'react';

interface FooterProps {
  graduateName: string;
}

export const Footer: React.FC<FooterProps> = ({ graduateName }) => {
  return (
    <footer className="mono">
      <p>
        Made with <b>♥</b> &amp; loud music — <b>{graduateName}</b>
      </p>
    </footer>
  );
};
