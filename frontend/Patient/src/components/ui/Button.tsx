import React from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
    className,
    variant = 'primary',
    size = 'md',
    ...props
}) => {
    return (
        <button
            className={cn(
                'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
                {
                    'bg-primary text-white hover:bg-primary/90': variant === 'primary',
                    'bg-secondary text-text hover:bg-secondary/80': variant === 'secondary',
                    'border-2 border-primary text-primary hover:bg-primary/5': variant === 'outline',
                    'hover:bg-gray-100 text-gray-700': variant === 'ghost',

                    'h-8 px-3 text-xs': size === 'sm',
                    'h-10 px-4 py-2': size === 'md',
                    'h-12 px-6 text-lg': size === 'lg',
                },
                className
            )}
            {...props}
        />
    );
};
