import Image from 'next/image'
import { useState } from 'react'

export default function Avatar({ src, alt = 'avatar', width = 80, height = 80, className }) {
  const defaultSrc = '/images/icone-perfil.jpg'
  const [imgSrc, setImgSrc] = useState(src || defaultSrc)

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setImgSrc(defaultSrc)}
      unoptimized 
    />
  )
}