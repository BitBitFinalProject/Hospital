import { NextResponse } from 'next/server'

// 백엔드 API URL - 실제 백엔드 서버 주소로 변경해야 합니다
const BACKEND_API_URL = 'http://localhost:8080/api'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // 필수 필드 확인
    if (!body.email || !body.password) {
      return NextResponse.json(
        { message: '이메일과 비밀번호를 입력해주세요.' },
        { status: 400 }
      )
    }
    
    // 백엔드 서버로 요청 전송
    const response = await fetch(`${BACKEND_API_URL}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: body.email,
        password: body.password,
      }),
    })
    
    // 백엔드 응답 처리
    const data = await response.json()
    console.log('백엔드 로그인 응답:', data)
    
    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || '로그인에 실패했습니다.' },
        { status: response.status }
      )
    }
    
    // 백엔드 응답 구조를 프론트엔드에 맞게 변환
    // JwtResponse 형식 {accessToken, id, username, email, roles}
    if (data.accessToken) {
      return NextResponse.json({
        message: '로그인이 완료되었습니다.',
        accessToken: data.accessToken,
        id: data.id || '',
        email: data.email || '',
        username: data.username || '',
        roles: data.roles || ['PATIENT']
      })
    } else if (data.token) {
      // 다른 응답 구조 처리
      return NextResponse.json({
        message: '로그인이 완료되었습니다.',
        token: data.token,
        user: data.user || {
          id: data.id || '',
          email: data.email || '',
          name: data.name || '',
          role: data.role || 'PATIENT'
        }
      })
    } else {
      // 알 수 없는 응답 구조
      console.error('알 수 없는 응답 구조:', data)
      return NextResponse.json({
        message: '서버 응답 형식이 잘못되었습니다.',
        ...data // 디버깅용 데이터 포함
      }, { status: 500 })
    }
  } catch (error) {
    console.error('로그인 처리 중 오류 발생:', error)
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 