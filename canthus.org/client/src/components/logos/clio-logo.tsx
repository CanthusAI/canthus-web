
interface ClioLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function ClioLogo({ className = "", size = 'md' }: ClioLogoProps) {
  const sizeClasses = {
    sm: 'h-6 w-auto',
    md: 'h-8 w-auto',
    lg: 'h-12 w-auto'
  };

  return (
    <img
      src="https://www.clio.com/wp-content/uploads/2025/09/clio-logo.svg"
      alt="Clio"
      className={`${sizeClasses[size]} ${className}`}
    />
  );
}