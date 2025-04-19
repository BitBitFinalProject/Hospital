"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"

// 사용자 정보 타입 정의
type User = {
  id: string
  email: string
  name: string
  role: string
}

// 컨텍스트에서 사용할 값 타입 정의
type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (token: string, user: User) => void
  logout: () => void
  isAuthenticated: boolean
}

// 기본값으로 컨텍스트 생성
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
  isAuthenticated: false
})

// 컨텍스트 훅
export const useAuth = () => useContext(AuthContext)

// 컨텍스트 프로바이더
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // 컴포넌트 마운트 시 로컬 스토리지에서 사용자 정보 복원
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    const storedToken = localStorage.getItem("token")
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
    }
    
    setIsLoading(false)
  }, [])

  // 로그인 함수
  const login = (token: string, userData: User) => {
    localStorage.setItem("token", token)
    localStorage.setItem("user", JSON.stringify(userData))
    setUser(userData)
  }

  // 로그아웃 함수
  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    router.push("/")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  )
} 