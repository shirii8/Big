import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
// import { connectToDatabase } from '@/lib/mongodb'; // Society standard DB utility
// import User from '@/models/User'; 

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Logic: Validate user and password here
    // const isMatch = await bcrypt.compare(password, user.password);

    const token = jwt.sign(
      { email, role: "member" }, 
      process.env.JWT_SECRET!, 
      { expiresIn: '24h' }
    );

    const response = NextResponse.json(
      { success: true, message: "Welcome to WebND" }, 
      { status: 200 }
    );

    // Set Secure Cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400, // 1 day
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}