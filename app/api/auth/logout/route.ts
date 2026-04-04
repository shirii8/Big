import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json(
      { success: true, message: "Logged out from WebND" }, 
      { status: 200 }
    );

    // Expire the cookie immediately
    response.cookies.set('token', '', { 
      expires: new Date(0),
      path: '/' 
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}