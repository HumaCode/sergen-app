import { InputHTMLAttributes, ReactNode } from 'react';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon: string;
    error?: string;
    rightElement?: ReactNode;
}

export function FormInput({
    label,
    icon,
    error,
    rightElement,
    id,
    className = '',
    ...props
}: FormInputProps) {
    return (
        <div className={`field ${error ? 'has-error' : ''}`}>
            <label htmlFor={id}>{label}</label>
            <div className={`input-wrap ${error ? 'input-error-shake' : ''}`}>
                <i className={`bi ${icon} input-icon`}></i>
                <input id={id} className={className} {...props} />
                {rightElement}
            </div>
        </div>
    );
}
