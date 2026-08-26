import { InputHTMLAttributes } from 'react';

interface FormCheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export function FormCheckbox({ label, id, className = '', ...props }: FormCheckboxProps) {
    return (
        <label className="remember" htmlFor={id}>
            <input
                type="checkbox"
                id={id}
                className={`custom-checkbox ${className}`.trim()}
                {...props}
            />
            <span>{label}</span>
        </label>
    );
}
