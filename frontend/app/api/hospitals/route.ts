import { NextResponse } from 'next/server'

// 백엔드 API URL
const BACKEND_API_URL = 'http://localhost:8080/api'

export async function GET(request: Request) {
  try {
    // URL에서 검색 파라미터 추출
    const { searchParams } = new URL(request.url)
    const name = searchParams.get('name')
    const address = searchParams.get('address')
    const departmentName = searchParams.get('departmentName')
    
    // 검색 파라미터가 있으면 검색 API 사용, 없으면 전체 목록 조회
    let url = `${BACKEND_API_URL}/hospitals`
    if (name || address || departmentName) {
      url = `${url}/search?`
      if (name) url += `name=${encodeURIComponent(name)}&`
      if (address) url += `address=${encodeURIComponent(address)}&`
      if (departmentName) url += `departmentName=${encodeURIComponent(departmentName)}`
      // 마지막 & 제거
      url = url.endsWith('&') ? url.slice(0, -1) : url
    }

    // 백엔드 서버로 요청 전송
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    // 응답 처리
    const data = await response.json()
    
    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || '병원 목록을 불러오는데 실패했습니다.' },
        { status: response.status }
      )
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('병원 목록 조회 중 오류 발생:', error)
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 