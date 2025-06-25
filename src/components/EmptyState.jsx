import React from 'react';
import { Empty, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const EmptyState = ({ 
    title = 'No data available',
    description = 'There are no items to display at the moment.',
    actionText,
    onAction,
    icon,
    className = ''
}) => {
    return (
        <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
            <Empty
                image={icon || Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                    <div className="text-center">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
                        <p className="text-gray-500">{description}</p>
                    </div>
                }
            >
                {actionText && onAction && (
                    <Button 
                        type="primary" 
                        icon={<PlusOutlined />}
                        onClick={onAction}
                        size="large"
                    >
                        {actionText}
                    </Button>
                )}
            </Empty>
        </div>
    );
};

export default EmptyState;
