'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Guest, HostInfo } from '@/types/invitation';

interface SaveInvitationProps {
  guest: Guest;
  host: HostInfo;
}

export const SaveInvitation: React.FC<SaveInvitationProps> = ({ guest, host }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [statusText, setStatusText] = useState<string>('');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadFilename, setDownloadFilename] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const personalizedMessage = (guest.message || host.defaultMessage).replace(/\{name\}/g, guest.name);

  // Default graduation photo
  const defaultPhotoSrc = '/images/default-photo.jpg';
  const initialPhotoSrc = guest.type === 'vip' 
    ? `/images/guest-imgs/${guest.id}.jpg` 
    : defaultPhotoSrc;
  const signatureSrc = host.signatureImage || '/images/signature.png';

  // Helper to load image
  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => {
        // Fallback for vip image if .jpg fails, try default
        if (src !== defaultPhotoSrc) {
          const fallbackImg = new Image();
          fallbackImg.crossOrigin = 'anonymous';
          fallbackImg.onload = () => resolve(fallbackImg);
          fallbackImg.onerror = () => reject(new Error('Failed to load image'));
          fallbackImg.src = defaultPhotoSrc;
        } else {
          reject(new Error('Failed to load image'));
        }
      };
      img.src = src;
    });
  };

  // Helper to create inverted signature for dark background
  const createInvertedImage = (img: HTMLImageElement): HTMLCanvasElement => {
    const c = document.createElement('canvas');
    c.width = img.naturalWidth || img.width || 200;
    c.height = img.naturalHeight || img.height || 124;
    const ctx = c.getContext('2d');
    if (!ctx) return c;

    ctx.drawImage(img, 0, 0);
    try {
      const imgData = ctx.getImageData(0, 0, c.width, c.height);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        // Invert RGB: r = 255 - r, g = 255 - g, b = 255 - b
        data[i] = 255 - data[i];
        data[i + 1] = 255 - data[i + 1];
        data[i + 2] = 255 - data[i + 2];
      }
      ctx.putImageData(imgData, 0, 0);
    } catch {
      // In case of CORS canvas security exception
    }
    return c;
  };

  // Helper to draw wrapped text
  const drawWrappedText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ) => {
    const words = text.split(' ');
    let line = '';
    const lines: string[] = [];

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        lines.push(line.trim());
        line = words[n] + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line.trim());

    // Draw lines centered
    const totalBlockHeight = lines.length * lineHeight;
    let startY = y - totalBlockHeight / 2 + lineHeight / 2;

    for (let k = 0; k < lines.length; k++) {
      ctx.fillText(lines[k], x, startY);
      startY += lineHeight;
    }
  };

  // Main frame renderer on canvas
  const renderInvitationFrame = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    frameIndex: number,
    totalFrames: number,
    photoImg: HTMLImageElement | null,
    sigElement: HTMLCanvasElement | HTMLImageElement | null
  ) => {
    const t = (frameIndex / totalFrames) * Math.PI * 2;

    // 1. NỀN DENIM RETRO
    ctx.fillStyle = '#3a6ba8';
    ctx.fillRect(0, 0, width, height);

    // Chấm bi họa tiết retro (polka dot denim pattern)
    ctx.fillStyle = 'rgba(13, 21, 32, 0.28)';
    const dotSpacing = 22;
    for (let dx = 10; dx < width; dx += dotSpacing) {
      for (let dy = 10; dy < height; dy += dotSpacing) {
        ctx.beginPath();
        ctx.arc(dx, dy, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Vignette bóng mờ xung quanh
    const vignette = ctx.createRadialGradient(
      width / 2, height / 2, width * 0.3,
      width / 2, height / 2, width * 0.8
    );
    vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vignette.addColorStop(1, 'rgba(13, 21, 32, 0.45)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);

    // Keep the poster centered within Instagram Story's safe area.
    const contentScale = 0.84;
    ctx.save();
    ctx.translate((width * (1 - contentScale)) / 2, height * 0.06);
    ctx.scale(contentScale, contentScale);

    // 1. EVENT BANNER UNDER THE PHOTO
    ctx.save();
    ctx.translate(width / 2, 785);
    ctx.rotate(-0.035); // -2 deg
    ctx.fillStyle = '#0d1520';
    ctx.fillRect(-470, -28, 940, 56);
    ctx.font = '700 22px "Space Mono", monospace';
    ctx.fillStyle = '#eef3fa';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('GRADUATION PARTY · CHỈ DÀNH CHO KHÁCH MỜI', 0, 0, 900);
    ctx.restore();

    // 2. STACKED GRADUATION TITLE
    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = '700 42px "Anton", sans-serif';
    ctx.fillStyle = '#c9d6ea';
    ctx.fillText('LỄ', width / 2, 895);

    ctx.font = '400 118px "Anton", sans-serif';
    ctx.fillStyle = '#0d1520';
    ctx.fillText('TỐT', width / 2 + 7, 1010 + 7, 650);
    ctx.fillText('NGHIỆP', width / 2 + 7, 1120 + 7, 760);
    ctx.fillStyle = '#eef3fa';
    ctx.fillText('TỐT', width / 2, 1010, 650);
    ctx.fillText('NGHIỆP', width / 2, 1120, 760);
    ctx.restore();

    // 3. PHOTO STAGE (VINYL RECORD + POLAROID + GOLD STICKER)
    const stageY = 440;

    // --- A. ĐĨA THAN XOAY (VINYL RECORD) ---
    const recordX = width / 2 + 220;
    const recordY = stageY - 15;
    const recordRadius = 235;

    ctx.save();
    ctx.translate(recordX, recordY);
    ctx.rotate(t); // Xoay trơn tru 360 độ

    // Bóng đổ đĩa than
    ctx.beginPath();
    ctx.arc(8, 8, recordRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(13, 21, 32, 0.7)';
    ctx.fill();

    // Thân đĩa than màu đen
    ctx.beginPath();
    ctx.arc(0, 0, recordRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#0d1520';
    ctx.fill();

    // Các đường rãnh âm thanh (vinyl grooves)
    ctx.lineWidth = 1.5;
    for (let r = 62; r < recordRadius - 8; r += 12) {
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.strokeStyle = (r % 24 === 0) ? '#263750' : '#141d2a';
      ctx.stroke();
    }

    // Nhãn tâm đĩa màu trắng (record center label)
    ctx.beginPath();
    ctx.arc(0, 0, 56, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#c9d6ea';
    ctx.stroke();

    // Chữ trên đĩa than
    ctx.font = '700 10px "Space Mono", monospace';
    ctx.fillStyle = '#0d1520';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('XMINH · 2026', 0, -22);
    ctx.fillText('SIDE A · TRACK 01', 0, 22);

    // Lỗ tâm đĩa than
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
    ctx.fillStyle = '#0d1520';
    ctx.fill();
    ctx.restore();

    // --- B. KHUNG ẢNH POLAROID ---
    const photoFrameX = width / 2;
    const photoFrameY = stageY;
    const photoCardW = 820;
    const photoCardH = 560;

    ctx.save();
    ctx.translate(photoFrameX, photoFrameY);
    ctx.rotate(-0.038); // nghiêng -2.2 độ

    // Bóng đổ khung ảnh
    ctx.fillStyle = '#0d1520';
    ctx.fillRect(-photoCardW / 2 + 8, -photoCardH / 2 + 8, photoCardW, photoCardH);

    // Thân giấy Polaroid trắng
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-photoCardW / 2, -photoCardH / 2, photoCardW, photoCardH);

    // Vùng ảnh bên trong
    const pad = 12;
    const imgAreaW = photoCardW - pad * 2;
    const imgAreaH = photoCardH - pad * 2 - 44;
    const imgX = -photoCardW / 2 + pad;
    const imgY = -photoCardH / 2 + pad;

    ctx.fillStyle = '#c9d6ea';
    ctx.fillRect(imgX, imgY, imgAreaW, imgAreaH);

    // Vẽ ảnh tốt nghiệp
    if (photoImg) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(imgX, imgY, imgAreaW, imgAreaH);
      ctx.clip();

      const imgRatio = photoImg.naturalWidth / photoImg.naturalHeight;
      const areaRatio = imgAreaW / imgAreaH;
      let drawW, drawH, drawX, drawY;

      if (imgRatio > areaRatio) {
        drawH = imgAreaH;
        drawW = imgAreaH * imgRatio;
        drawX = imgX - (drawW - imgAreaW) / 2;
        drawY = imgY;
      } else {
        drawW = imgAreaW;
        drawH = imgAreaW / imgRatio;
        drawX = imgX;
        drawY = imgY - (drawH - imgAreaH) / 2;
      }

      ctx.drawImage(photoImg, drawX, drawY, drawW, drawH);
      ctx.restore();
    }

    // Dòng chữ Polaroid dưới ảnh
    ctx.font = '700 12px "Space Mono", monospace';
    ctx.fillStyle = '#0d1520';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('CLASS OF 2026 · MỘT CHƯƠNG MỚI →', 0, photoCardH / 2 - 22, photoCardW - 32);

    // Miếng băng dính dán đỉnh ảnh
    ctx.fillStyle = 'rgba(201, 214, 234, 0.9)';
    ctx.fillRect(-45, -photoCardH / 2 - 12, 90, 24);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.lineWidth = 1;
    ctx.strokeRect(-45, -photoCardH / 2 - 12, 90, 24);

    ctx.restore();

    // --- C. STICKER HUY HIỆU VÀNG (FLOATING GOLD STICKER) ---
    const stickerBaseX = width / 2 + 320;
    const stickerBaseY = stageY - 180;
    const floatY = Math.sin(t) * 8;
    const floatRot = 0.18 + Math.sin(t) * 0.08;

    ctx.save();
    ctx.translate(stickerBaseX, stickerBaseY + floatY);
    ctx.rotate(floatRot);

    // Bóng đổ sticker
    ctx.beginPath();
    ctx.arc(4, 4, 60, 0, Math.PI * 2);
    ctx.fillStyle = '#0d1520';
    ctx.fill();

    // Thân sticker vàng
    ctx.beginPath();
    ctx.arc(0, 0, 60, 0, Math.PI * 2);
    ctx.fillStyle = '#ecd39a';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#0d1520';
    ctx.stroke();

    // Chữ bên trong huy hiệu
    ctx.fillStyle = '#0d1520';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '400 22px "Anton", sans-serif';
    ctx.fillText('ONLY ONCE', 0, -20, 100);
    ctx.fillText('IN LIFE', 0, 4, 100);
    ctx.font = '700 11px "Space Mono", monospace';
    ctx.fillText('★ 2026 ★', 0, 28, 100);
    ctx.restore();

    // 4. PERSONALIZED INVITATION TICKET
    ctx.save();
    const forCardY = 1280;
    ctx.translate(width / 2, forCardY);
    ctx.rotate(-0.024); // -1.4 deg

    // Bóng đổ thẻ
    ctx.fillStyle = '#0d1520';
    ctx.fillRect(-390 + 6, -72 + 6, 780, 144);

    // Thân giấy thẻ
    ctx.fillStyle = '#eef3fa';
    ctx.fillRect(-390, -72, 780, 144);

    // Miếng băng dính trên thẻ
    ctx.fillStyle = 'rgba(201, 214, 234, 0.88)';
    ctx.fillRect(-52, -84, 104, 24);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.strokeRect(-52, -84, 104, 24);

    // Dòng chữ "VÉ MỜI DÀNH CHO"
    ctx.font = '700 19px "Space Mono", monospace';
    ctx.fillStyle = '#3b5483';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('VÉ MỜI DÀNH CHO', 0, -24);

    // Tên khách mời Anton
    ctx.font = '400 58px "Anton", sans-serif';
    ctx.fillStyle = '#0d1520';
    ctx.fillText(guest.name.toUpperCase(), 0, 30, 740);
    ctx.restore();

    // 5. PERSONALIZED MESSAGE
    ctx.save();
    ctx.font = '500 26px "Be Vietnam Pro", sans-serif';
    ctx.fillStyle = '#eef3fa';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    drawWrappedText(ctx, personalizedMessage, width / 2, 1410, 850, 38);
    ctx.restore();

    // 6. EVENT DATE, TIME, AND PLACE
    let dateStr = '29.11.2026';
    let timeStr = '16:00';
    let weekdayStr = 'Chủ Nhật';
    try {
      const d = new Date(host.time);
      dateStr = new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'Asia/Ho_Chi_Minh',
      }).format(d);
      timeStr = new Intl.DateTimeFormat('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Asia/Ho_Chi_Minh',
      }).format(d);
      weekdayStr = new Intl.DateTimeFormat('vi-VN', { weekday: 'long', timeZone: 'Asia/Ho_Chi_Minh' }).format(d);
      weekdayStr = weekdayStr.charAt(0).toUpperCase() + weekdayStr.slice(1);
    } catch {}

    const infoBoxY = 1570;
    const infoBoxW = 900;
    const infoBoxH = 180;

    ctx.save();
    ctx.translate(width / 2, infoBoxY);

    // Bóng đổ hộp thông tin
    ctx.fillStyle = '#0d1520';
    ctx.fillRect(-infoBoxW / 2 + 6, -infoBoxH / 2 + 6, infoBoxW, infoBoxH);

    // Thân hộp thông tin màu tối retro
    ctx.fillStyle = '#111d2e';
    ctx.fillRect(-infoBoxW / 2, -infoBoxH / 2, infoBoxW, infoBoxH);

    // Viền vàng cổ điển
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#ecd39a';
    ctx.strokeRect(-infoBoxW / 2, -infoBoxH / 2, infoBoxW, infoBoxH);

    // Đường kẻ đứt ngăn cách giữa Thời gian và Địa điểm
    ctx.beginPath();
    ctx.setLineDash([5, 5]);
    ctx.moveTo(0, -infoBoxH / 2 + 16);
    ctx.lineTo(0, infoBoxH / 2 - 16);
    ctx.strokeStyle = 'rgba(201, 214, 234, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.setLineDash([]); // Bỏ nét đứt

    // --- CỘT TRÁI: THỜI GIAN ---
    ctx.textAlign = 'center';
    // Nhãn
    ctx.font = '700 15px "Space Mono", monospace';
    ctx.fillStyle = '#ecd39a';
    ctx.fillText('🗓️ THỜI GIAN', -infoBoxW / 4, -42);

    // Giờ & Ngày Anton
    ctx.font = '400 36px "Anton", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${timeStr} · ${dateStr}`, -infoBoxW / 4, 2, 410);

    // Thứ / Ghi chú
    ctx.font = '500 17px "Be Vietnam Pro", sans-serif';
    ctx.fillStyle = '#c9d6ea';
    ctx.fillText(`${weekdayStr} (${host.timeNote || 'Cửa mở trước 30p'})`, -infoBoxW / 4, 44, 410);

    // --- CỘT PHẢI: ĐỊA ĐIỂM ---
    // Nhãn
    ctx.font = '700 15px "Space Mono", monospace';
    ctx.fillStyle = '#ecd39a';
    ctx.fillText('📍 ĐỊA ĐIỂM', infoBoxW / 4, -42);

    // Tên hội trường
    ctx.font = '400 30px "Anton", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(host.placeName || 'Hội trường Trần Chí Đáo', infoBoxW / 4, 2, 410);

    // Địa chỉ chi tiết
    ctx.font = '500 17px "Be Vietnam Pro", sans-serif';
    ctx.fillStyle = '#c9d6ea';
    ctx.fillText(host.address || 'Nhà Điều hành ĐHQG-HCM', infoBoxW / 4, 44, 410);

    ctx.restore();

    // 7. CLOSING AND SIGNATURE
    ctx.save();
    ctx.font = '700 20px "Space Mono", monospace';
    ctx.fillStyle = '#c9d6ea';
    ctx.textAlign = 'center';
    ctx.fillText((host.closing || 'THÂN MẾN,').toUpperCase(), width / 2, 1700, 840);

    if (sigElement) {
      const sigH = 110;
      const sigRatio = (sigElement.width || 200) / (sigElement.height || 124);
      const sigW = sigH * sigRatio;
      ctx.drawImage(sigElement, width / 2 - sigW / 2, 1720, sigW, sigH);
    }
    ctx.restore();

    // 8. FOOTER
    ctx.save();
    ctx.font = '700 16px "Space Mono", monospace';
    ctx.fillStyle = '#7fa6d6';
    ctx.textAlign = 'center';
    ctx.fillText(`CLASS OF 2026 · ${host.name.toUpperCase()} GRADUATION GIG`, width / 2, 1875, 1000);
    ctx.restore();

    ctx.restore();
  };

  // Trigger Save Video
  const handleSaveVideo = async () => {
    setIsModalOpen(true);
    setIsRecording(true);
    setProgress(0);
    setIsSuccess(false);
    setErrorMessage(null);
    setDownloadUrl(null);
    setStatusText('Đang nạp ảnh và phông chữ thiệp mời…');

    try {
      // 1. Chờ phông chữ tải xong
      if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }

      // 2. Tải ảnh đại diện và chữ ký
      setStatusText('Đang chuẩn bị hình ảnh…');
      let photoImg: HTMLImageElement | null = null;
      let sigElement: HTMLCanvasElement | HTMLImageElement | null = null;

      try {
        photoImg = await loadImage(initialPhotoSrc);
      } catch (e) {
        console.warn('Could not load photo, proceeding with placeholder', e);
      }

      try {
        const rawSig = await loadImage(signatureSrc);
        if (host.signatureInvert) {
          sigElement = createInvertedImage(rawSig);
        } else {
          sigElement = rawSig;
        }
      } catch (e) {
        console.warn('Could not load signature, proceeding without it', e);
      }

      // 3. Khởi tạo Canvas (chuẩn dọc 1080 x 1920 cho video Story / TikTok / Mobile)
      const CANVAS_W = 1080;
      const CANVAS_H = 1920;
      const canvas = document.createElement('canvas');
      canvas.width = CANVAS_W;
      canvas.height = CANVAS_H;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Canvas 2D context not supported');
      }

      // Vẽ thử frame đầu tiên lên preview canvas trong modal
      if (previewCanvasRef.current) {
        const pCtx = previewCanvasRef.current.getContext('2d');
        if (pCtx) {
          renderInvitationFrame(ctx, CANVAS_W, CANVAS_H, 0, 90, photoImg, sigElement);
          pCtx.clearRect(0, 0, previewCanvasRef.current.width, previewCanvasRef.current.height);
          pCtx.drawImage(canvas, 0, 0, previewCanvasRef.current.width, previewCanvasRef.current.height);
        }
      }

      // 4. Kiểm tra hỗ trợ MediaRecorder & captureStream
      const hasMediaRecorder = typeof MediaRecorder !== 'undefined';
      const hasCaptureStream = typeof canvas.captureStream === 'function';

      if (!hasMediaRecorder || !hasCaptureStream) {
        // Fallback: Thiết bị không hỗ trợ MediaRecorder (ví dụ trình duyệt webview rất cũ)
        // -> Xuất ảnh tĩnh PNG chất lượng cao
        setStatusText('Trình duyệt không hỗ trợ quay video, đang tạo ảnh PNG chất lượng cao…');
        renderInvitationFrame(ctx, CANVAS_W, CANVAS_H, 0, 90, photoImg, sigElement);
        canvas.toBlob((blob) => {
          if (!blob) throw new Error('Could not export canvas blob');
          const url = URL.createObjectURL(blob);
          const filename = `Thiep-Moi-Tot-Nghiep-${guest.name.replace(/\s+/g, '_')}.png`;
          setDownloadUrl(url);
          setDownloadFilename(filename);
          setIsSuccess(true);
          setIsRecording(false);
          setProgress(100);
          setStatusText('Đã tạo ảnh thiệp mời (PNG) chất lượng cao thành công!');

          // Tự động tải xuống
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
        }, 'image/png');
        return;
      }

      // 5. Chọn định dạng video hỗ trợ tốt nhất (mp4 hoặc webm)
      let selectedMimeType = 'video/webm';
      if (MediaRecorder.isTypeSupported('video/mp4')) {
        selectedMimeType = 'video/mp4';
      } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
        selectedMimeType = 'video/webm;codecs=vp9';
      } else if (MediaRecorder.isTypeSupported('video/webm')) {
        selectedMimeType = 'video/webm';
      }

      const stream = canvas.captureStream(30); // 30 FPS
      const recorder = new MediaRecorder(stream, {
        mimeType: selectedMimeType,
        videoBitsPerSecond: 4500000, // 4.5 Mbps cho độ sắc nét cao
      });

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      const totalFrames = 90; // 3 giây ở 30 FPS (1 vòng quay trọn vẹn 360 độ của đĩa than)
      let currentFrame = 0;
      const frameDelayMs = 1000 / 30; // ~33ms mỗi frame

      recorder.onstop = () => {
        const ext = selectedMimeType.includes('mp4') ? 'mp4' : 'webm';
        const blob = new Blob(chunks, { type: selectedMimeType });
        const url = URL.createObjectURL(blob);
        const filename = `Thiep-Moi-Tot-Nghiep-${guest.name.replace(/\s+/g, '_')}.${ext}`;

        setDownloadUrl(url);
        setDownloadFilename(filename);
        setIsSuccess(true);
        setIsRecording(false);
        setProgress(100);
        setStatusText('Tạo video thành công! Đang tự động lưu về máy…');

        // Tự động kích hoạt tải xuống
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
      };

      recorder.start();
      setStatusText('Đang dựng video thiệp mời… (3 giây)');

      // Vòng lặp vẽ từng khung hình theo thời gian thực
      const processFrame = () => {
        if (currentFrame >= totalFrames) {
          setStatusText('Đang đóng gói file video…');
          recorder.stop();
          return;
        }

        renderInvitationFrame(ctx, CANVAS_W, CANVAS_H, currentFrame, totalFrames, photoImg, sigElement);

        // Cập nhật live preview trong modal
        if (previewCanvasRef.current) {
          const pCtx = previewCanvasRef.current.getContext('2d');
          if (pCtx) {
            pCtx.clearRect(0, 0, previewCanvasRef.current.width, previewCanvasRef.current.height);
            pCtx.drawImage(canvas, 0, 0, previewCanvasRef.current.width, previewCanvasRef.current.height);
          }
        }

        currentFrame++;
        const pct = Math.round((currentFrame / totalFrames) * 95);
        setProgress(pct);

        setTimeout(processFrame, frameDelayMs);
      };

      processFrame();
    } catch (err) {
      console.error('Error exporting video:', err);
      setIsRecording(false);
      setErrorMessage('Có lỗi xảy ra khi tạo video. Bạn có thể thử lại hoặc lưu dưới dạng ảnh.');
      setStatusText('Không thể tạo video');
    }
  };

  // Helper tải lại video đã tạo
  const handleDownloadAgain = () => {
    if (downloadUrl && downloadFilename) {
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = downloadFilename;
      a.click();
    }
  };

  // Helper xuất ảnh PNG thay thế
  const handleDownloadPNG = async () => {
    try {
      setStatusText('Đang tạo ảnh PNG chất lượng cao…');
      let photoImg: HTMLImageElement | null = null;
      let sigElement: HTMLCanvasElement | HTMLImageElement | null = null;

      try {
        photoImg = await loadImage(initialPhotoSrc);
      } catch {}

      try {
        const rawSig = await loadImage(signatureSrc);
        sigElement = host.signatureInvert ? createInvertedImage(rawSig) : rawSig;
      } catch {}

      const CANVAS_W = 1080;
      const CANVAS_H = 1920;
      const canvas = document.createElement('canvas');
      canvas.width = CANVAS_W;
      canvas.height = CANVAS_H;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      renderInvitationFrame(ctx, CANVAS_W, CANVAS_H, 0, 90, photoImg, sigElement);

      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const filename = `Thiep-Moi-Tot-Nghiep-${guest.name.replace(/\s+/g, '_')}.png`;
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
      }, 'image/png');
    } catch (err) {
      console.error('Error exporting PNG:', err);
    }
  };

  // Đóng modal khi nhấn Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isRecording) {
        setIsModalOpen(false);
      }
    };
    if (isModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen, isRecording]);

  return (
    <>
      {/* Khối button Save your invitation dưới cùng */}
      <section className="save-invitation-section" aria-label="Lưu thiệp mời">
        <div className="save-invitation-box">
          <div className="save-kicker mono">KỶ NIỆM TỐT NGHIỆP · CLASS OF 2026</div>
          <h3 className="save-title">LƯU LẠI THIỆP MỜI CỦA BẠN</h3>
          <p className="save-subtitle">
            Lưu giữ khoảnh khắc đặc biệt với video thiệp mời hoạt ảnh đĩa than retro độc quyền dành riêng cho <b>{guest.name}</b>.
          </p>

          <button
            type="button"
            className="save-invitation-btn mono"
            onClick={handleSaveVideo}
            disabled={isRecording}
            title="Bấm để xuất và tải video thiệp mời"
          >
            <span className="save-btn-icon" aria-hidden="true">🎬</span>
            <span>{isRecording ? 'ĐANG TẠO VIDEO…' : 'SAVE YOUR INVITATION'}</span>
          </button>
        </div>
      </section>

      {/* Modal tiến trình tạo và tải video */}
      {isModalOpen && (
        <div 
          className="video-export-modal-backdrop"
          onClick={() => {
            if (!isRecording) setIsModalOpen(false);
          }}
          role="dialog"
          aria-modal="true"
        >
          <div 
            className="video-export-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Dải băng dính trang trí */}
            <div className="phone-modal-tape"></div>

            {!isRecording && (
              <button
                type="button"
                className="video-export-close mono"
                onClick={() => setIsModalOpen(false)}
                aria-label="Đóng"
              >
                ✕
              </button>
            )}

            <div className="video-export-kicker mono">XUẤT VIDEO THIỆP MỜI</div>
            <h3 className="video-export-title">
              {isSuccess ? 'ĐÃ TẢI XUỐNG VIDEO!' : 'ĐANG DỰNG VIDEO THIỆP MỜI'}
            </h3>

            {/* Live Canvas Preview */}
            <div className="video-preview-wrapper">
              <canvas
                ref={previewCanvasRef}
                width={270}
                height={480}
                className="video-preview-canvas"
              />
              {isRecording && (
                <div className="video-recording-badge mono">
                  <span className="recording-dot"></span> REC (30 FPS)
                </div>
              )}
            </div>

            {/* Thanh tiến trình */}
            <div className="video-progress-bar-bg">
              <div 
                className="video-progress-bar-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <p className="video-export-status mono">
              {statusText} ({progress}%)
            </p>

            {errorMessage && (
              <p className="video-export-error">{errorMessage}</p>
            )}

            {/* Các nút hành động khi hoàn thành */}
            {isSuccess && (
              <div className="video-export-actions">
                <button
                  type="button"
                  className="video-action-btn primary-btn mono"
                  onClick={handleDownloadAgain}
                >
                  📥 TẢI LẠI VIDEO
                </button>
                <button
                  type="button"
                  className="video-action-btn secondary-btn mono"
                  onClick={handleDownloadPNG}
                >
                  📸 LƯU ẢNH (PNG)
                </button>
                <button
                  type="button"
                  className="video-action-btn close-btn mono"
                  onClick={() => setIsModalOpen(false)}
                >
                  ĐÓNG
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
