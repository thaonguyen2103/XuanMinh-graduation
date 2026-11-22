import { NextRequest, NextResponse } from 'next/server';
import { confirmGuestAttendance, getGuestById } from '@/lib/data';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { ok: false, error: 'Thiếu mã khách mời hoặc mã không hợp lệ.' },
        { status: 400 }
      );
    }

    const result = confirmGuestAttendance(id);

    if (!result.success) {
      return NextResponse.json(
        { ok: false, error: result.error || 'Cập nhật thất bại.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: 'Xác nhận tham dự thành công!',
      guest: result.guest,
    });
  } catch (error) {
    console.error('RSVP API route error:', error);
    return NextResponse.json(
      { ok: false, error: 'Lỗi hệ thống khi xử lý xác nhận.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { ok: false, error: 'Thiếu tham số id.' },
      { status: 400 }
    );
  }

  const guest = getGuestById(id);
  if (!guest) {
    return NextResponse.json(
      { ok: false, error: 'Không tìm thấy khách mời.' },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true, guest });
}
