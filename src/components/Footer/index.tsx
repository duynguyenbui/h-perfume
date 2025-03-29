import Link from 'next/link'
import { Frame } from 'lucide-react'
export default function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
        <nav
          className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12"
          aria-label="Footer"
        >
          {[
            'Giới thiệu',
            'Sản phẩm',
            'Dịch vụ',
            'Liên hệ',
            'Chính sách riêng tư',
            'Điều khoản',
          ].map((item) => (
            <div key={item} className="pb-6">
              <Link
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm leading-6 text-muted-foreground hover:text-foreground"
              >
                {item}
              </Link>
            </div>
          ))}
        </nav>
        <p className="mt-10 text-center text-sm leading-5 text-muted-foreground">
          Thiết kế & Phát triển với ❤️ bởi H-Perfume. Bản quyền thuộc về H-Perfume
        </p>
      </div>
    </footer>
  )
}
