import { NextResponse } from 'next/server'

// 백엔드 API URL - 실제 백엔드 서버 주소로 변경해야 합니다
const BACKEND_API_URL = 'http://localhost:8080/api'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // 필수 필드 확인
    if (!body.userId || !body.name || !body.email || !body.password) {
      return NextResponse.json(
        { message: '모든 필수 필드를 입력해주세요.' },
        { status: 400 }
      )
    }
    
    // 백엔드 서버로 요청 전송
    const response = await fetch(`${BACKEND_API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: body.userId,
        name: body.name,
        email: body.email,
        password: body.password,
        role: body.role || 'PATIENT'
      }),
    })
    
    // 백엔드 응답 처리
    const data = await response.json()
    
    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || '회원가입에 실패했습니다.' },
        { status: response.status }
      )
    }
    
    return NextResponse.json(
      { message: '회원가입이 완료되었습니다.', user: data },
      { status: 201 }
    )
  } catch (error) {
    console.error('회원가입 처리 중 오류 발생:', error)
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 