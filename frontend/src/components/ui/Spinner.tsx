interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    colour?: 'green' | 'white' | 'gray';
    className?: string;
}

const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
};

const colourClasses = {
    green: 'border-green-600',
    white: 'border-white',
    gray: 'border-gray-600'
};

export const Spinner = ({ size = 'md', colour = 'green', className = '' }: SpinnerProps) => {
    return (
        <div
            className={`
                ${sizeClasses[size]}
                ${colourClasses[colour]}
                border-2 border-t-transparent rounded-full animate-spin
                ${className}
            `}
        />
    );
};