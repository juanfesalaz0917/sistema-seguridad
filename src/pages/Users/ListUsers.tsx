import React, { useEffect, useState } from 'react';
import GenericTable from '../../components/GenericTable';
import { User } from '../../models/User';
import { userService } from '../../services/userService';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Breadcrumb from '../../components/Breadcrumb';
import PermissionGuard from '../../components/Auth/PermissionGuard';
import GenericButton from '../../components/GenericButton';

const ListUsers: React.FC = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const users = await userService.getUsers();
            setUsers(users);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Error loading users');
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (item: User) => {
        const result = await Swal.fire({
            title: 'Delete User',
            text: 'Are you sure you want to delete this user?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
        });

        if (result.isConfirmed) {
            try {
                const success = await userService.deleteUser(item.id!);
                if (success) {
                    toast.success('User deleted successfully');
                    fetchData();
                }
            } catch (error) {
                console.error('Error deleting user:', error);
                toast.error('Error deleting user');
            }
        }
    };

    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
    ];

    const handleAction = (actionName: string, item: User) => {
        switch (actionName) {
            case 'view':
                navigate(`/profile/${item.id}`);
                break;
            case 'edit':
                navigate(`/user/update/${item.id}`);
                break;
            case 'delete':
                deleteUser(item);
                break;
            default:
                break;
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
            </div>
        );
    }

    return (
        <>
            <Breadcrumb pageName="Users" />

            <div className="flex flex-col gap-10">
                <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                    <div className="mb-6 flex justify-between items-center">
                        <h4 className="text-xl font-semibold text-black dark:text-white">
                            All Users
                        </h4>
                        <PermissionGuard requiredPermissions={['user:create']}>
                            <GenericButton
                                onClick={() => navigate('/user/create')}
                                variant="primary"
                            >
                                Create User
                            </GenericButton>
                        </PermissionGuard>
                    </div>

                    <GenericTable
                        data={users}
                        columns={columns.map((col) => col.key)}
                        actions={[
                            {
                                name: 'view',
                                label: 'View',
                                variant: 'secondary',
                            },
                            { name: 'edit', label: 'Edit', variant: 'primary' },
                            {
                                name: 'delete',
                                label: 'Delete',
                                variant: 'danger',
                            },
                        ]}
                        onAction={handleAction}
                    />
                </div>
            </div>
        </>
    );
};

export default ListUsers;
