import React from "react";

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    description?: string;
    footer?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, className = "", title, description, footer }) => {
    return (
        <div className={`bg-surface-white rounded-xl border border-gray-200 shadow-sm ${className}`}>
            {(title || description) && (
                <div className="p-6 pb-2">
                    {title && <h3 className="text-lg font-semibold text-dark-slate leading-none tracking-tight">{title}</h3>}
                    {description && <p className="text-sm text-gray-500 mt-1.5">{description}</p>}
                </div>
            )}
            <div className="p-6 pt-2">
                {children}
            </div>
            {footer && (
                <div className="flex items-center p-6 pt-0">
                    {footer}
                </div>
            )}
        </div>
    );
};

export default Card;
