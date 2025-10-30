import type React from 'react';

interface PermissionGuardProps {
    children: React.ReactNode;
    requiredPermissions: string[];
    fallback?: React.ReactNode;
}

// Component to conditionally render content based on permissions
const PermissionGuard: React.FC<PermissionGuardProps> = ({
    children,
    requiredPermissions,
    fallback = null,
}) => {
    const user = localStorage.getItem('user');

    if (!user) {
        return <>{fallback}</>;
    }

    try {
        const userData = JSON.parse(user);
        const userPermissions = userData.permissions || [];

        const hasRequiredPermission = requiredPermissions.some((permission) =>
            userPermissions.includes(permission),
        );

        return <>{children}</>;
    } catch (error) {
        console.error('Error in PermissionGuard:', error);
        return <>{fallback}</>;
    }
};

export default PermissionGuard;
