import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const correctPassword = process.env.JURY_PASSWORD;

    if (password === correctPassword) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, message: 'Incorrect password' });
    }
  } catch (error) {
    console.error('Error verifying password:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while verifying the password' },
      { status: 500 }
    );
  }
}
