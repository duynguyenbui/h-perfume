import React from 'react'
import '../tailwinds.css'
import { ArrowLeft, FrameIcon } from 'lucide-react'
import Link from 'next/link'

const Logo: React.FC = () => {
  return (
    <Link href="/" className="group flex items-center space-x-3 font-bold">
      <ArrowLeft className="h-5 w-5 text-primary transition-transform group-hover:-translate-x-1" />
      <div className="flex items-center space-x-2 text-5xl">
        <FrameIcon className="h-10 w-10" />
        <span className="text-3xl">
          <span className="text-primary">e</span>
          <span className="font-bold text-4xl">Doctors</span>
        </span>
      </div>
    </Link>
  )
}

export default Logo
