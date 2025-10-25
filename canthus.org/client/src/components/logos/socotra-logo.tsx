
interface SocotraLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function SocotraLogo({ className = "", size = 'md' }: SocotraLogoProps) {
  const sizeClasses = {
    sm: 'h-6 w-auto',
    md: 'h-8 w-auto',
    lg: 'h-12 w-auto'
  };

  return (
    <img
      src="https://www.socotra.com/wp-content/uploads/2024/02/socotra-dark.png"
      alt="Socotra"
      className={`${sizeClasses[size]} ${className}`}
    />
  );
}