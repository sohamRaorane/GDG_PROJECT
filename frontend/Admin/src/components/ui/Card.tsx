import React from "react";

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: React.ReactNode;
    description?: string;
    footer?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, className = "", title, description, footer }) => {
    return (
        <div className={`bg-admin-surface rounded-xl border border-admin-border shadow-sm ${className}`}>
            {(title || description) && (
                <div className="p-6 pb-2">
                    {title && <div className="text-lg font-semibold text-admin-text leading-none tracking-tight">{title}</div>}
                    {description && <p className="text-sm text-slate-500 mt-1.5">{description}</p>}
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
