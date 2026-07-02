import { Component, type ErrorInfo, type ReactNode } from "react";
import { Alert } from "../ui/Alert";
import { Button } from "../ui/Button";

interface ErrorBoundaryProps { 
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor (props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error('ErrorBoundary caught: ', error, errorInfo);

        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="p-4">
                    <Alert 
                        type="error"
                        title="Something went wrong"
                        message={this.state.error?.message || 'An unexpected error occurred.'}
                        onDismiss={() => this.setState({ hasError: false, error: null })}
                    />
                    <Button
                        variant="primary"
                        onClick={() => this.setState({ hasError: false, error: null })}
                        className="mt-4"
                    >
                        Try Again
                    </Button>
                </div>
            );
        }
        return this.props.children;
    }
}