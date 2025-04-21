import { NextResponse } from 'next/server'

// 백엔드 API URL
const BACKEND_API_URL = 'http://localhost:8080/api'

export async function PUT(request: Request) {
  try {
    // 요청 바디 추출
    const body = await request.json()
    
    // 필수 필드 확인
    if (!body.name || !body.email) {
      return NextResponse.json(
        { message: '이름과 이메일은 필수 입력 항목입니다.' },
        { status: 400 }
      )
    }
    
    // 토큰 확인
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: '인증 토큰이 필요합니다.' },
        { status: 401 }
      )
    }
    
    const token = authHeader.split(' ')[1]
    
    // 백엔드 서버로 요청 전송
    const response = await fetch(`${BACKEND_API_URL}/users/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: body.name,
        email: body.email
      }),
    })
    
    // 응답 처리 - 안전하게 처리
    let data;
    const contentType = response.headers.get('content-type');
    const hasJsonContent = contentType && contentType.includes('application/json');
    
    if (hasJsonContent) {
      const text = await response.text();
      try {
        // 응답이 비어있지 않은 경우에만 JSON 파싱 시도
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        console.error('JSON 파싱 에러:', e, '원본 응답:', text);
        data = {};
      }
    } else {
      data = {}; // JSON이 아닌 경우 기본값 설정
    }
    
    if (!response.ok) {
      return NextResponse.json(
        { message: (data && data.message) || '정보 수정에 실패했습니다.' },
        { status: response.status }
      )
    }
    
    return NextResponse.json({
      message: '정보가 성공적으로 업데이트되었습니다.',
      user: data // 백엔드에서 반환한 사용자 정보
    })
  } catch (error) {
    console.error('사용자 정보 업데이트 중 오류 발생:', error)
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 