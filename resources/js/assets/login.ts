import { useState } from 'react';

export function useLoginToggle() {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return {
        showPassword,
        togglePasswordVisibility,
    };
}
