import type { ReactNode } from 'react';

interface PageLayoutProps {
    children: ReactNode;
    title?: string;
    subtitle?: string;
    className?: string;
}

export const PageLayout = ({ children, title, subtitle, className = '' }: PageLayoutProps) => {
    return (
        <div className={`max-w-4xl mx-auto px-6 py-6 ${className}`}>
            {(title || subtitle) && (
                <div className="mb-6">
                    {title && <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>}
                    {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
                </div>
            )}
            {children}
        </div>
    );
};