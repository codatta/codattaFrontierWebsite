import './AniImage.scss'

const AniImage: React.FC<{
  src: string
  className?: string
}> = ({ src, className }) => {
  // return <img src={src} className={`${className} ani-image`} />
  return <img src={src} className={`${className}`} />
}

export default AniImage
