import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string // Thêm thuộc tính id
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}
