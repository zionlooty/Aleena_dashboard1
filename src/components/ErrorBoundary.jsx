import React from 'react';
import { Result, Button } from 'antd';
import { MdError } from 'react-icons/md';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        
        // Log error to console in development
        if (process.env.NODE_ENV === 'development') {
            console.error('Error caught by boundary:', error, errorInfo);
        }
    }

    handleReload = () => {
        window.location.reload();
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <Result
                        status="error"
                        title="Something went wrong"
                        subTitle="An unexpected error occurred. Please try refreshing the page or contact support if the problem persists."
                        extra={[
                            <Button type="primary" key="reload" onClick={this.handleReload}>
                                Reload Page
                            </Button>,
                            <Button key="home" onClick={this.handleGoHome}>
                                Go to Dashboard
                            </Button>,
                        ]}
                    >
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <h4 className="text-red-800 font-medium mb-2">Error Details (Development Only):</h4>
                                <pre className="text-sm text-red-700 whitespace-pre-wrap">
                                    {this.state.error.toString()}
                                    {this.state.errorInfo.componentStack}
                                </pre>
                            </div>
                        )}
                    </Result>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
