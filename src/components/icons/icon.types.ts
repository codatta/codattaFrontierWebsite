export interface IconProps {
  color?: string
  size?: number
  strokeWidth?: number
  className?: string
  fill?: string
  onMouseEnter?: (event: React.MouseEvent<SVGElement>) => void
  onMouseLeave?: (event: React.MouseEvent<SVGElement>) => void
}
