import { ButtonHTMLAttributes, ReactNode } from 'react';

interface FormButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    icon?: string;
    variant?: 'primary' | 'sso';
    isLoading?: boolean;
}

export function FormButton({
    children,
    icon,
    variant = 'primary',
    isLoading = false,
    className = '',
    disabled,
    ...props
}: FormButtonProps) {
    const baseClass = variant === 'sso' ? 'btn-sso' : 'btn-login';

    return (
        <button
            className={`${baseClass} ${className}`.trim()}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <>
                    <span className="btn-spinner"></span>
                    <span>Memproses...</span>
                </>
            ) : (
                <>
                    {children}
                    {icon && <i className={`bi ${icon}`}></i>}
                </>
            )}
        </button>
    );
}
