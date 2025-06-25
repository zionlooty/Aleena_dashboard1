import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const PageLoader = ({ 
    size = 'large', 
    tip = 'Loading...', 
    className = '',
    fullScreen = false 
}) => {
    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

    if (fullScreen) {
        return (
            <div className={`fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50 ${className}`}>
                <div className="text-center">
                    <Spin indicator={antIcon} size={size} />
                    <p className="mt-4 text-gray-600">{tip}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex items-center justify-center py-12 ${className}`}>
            <div className="text-center">
                <Spin indicator={antIcon} size={size} />
                <p className="mt-4 text-gray-600">{tip}</p>
            </div>
        </div>
    );
};

export default PageLoader;
