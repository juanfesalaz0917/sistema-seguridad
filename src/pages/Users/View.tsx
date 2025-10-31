import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb';
import type { User } from '../../models/User';
import { userService } from '../../services/userService';
import toast from 'react-hot-toast';

const UserProfile = () => {
    const { userId } = useParams<{ userId: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUserData();
    }, [userId]);

    const loadUserData = async () => {
        try {
            setLoading(true);
            const id = Number.parseInt(userId || '0');
            const userData = await userService.getUserById(id);
            setUser(userData);
        } catch (error) {
            toast.error('Error loading user profile');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                Loading...
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen">
                User not found
            </div>
        );
    }

    return (
        <>
            <Breadcrumb pageName="User Profile" />

            <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="relative z-20 h-35 md:h-65">
                    <img
                        src="/src/images/cover/abstract-gradient.jpg"
                        alt="profile cover"
                        className="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
                    />
                </div>
                <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
                    <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
                        <div className="relative drop-shadow-2">
                            <img
                                src={
                                    user.photo_url ||
                                    '/src/images/user/placeholder-user.jpg'
                                }
                                alt="profile"
                                className="rounded-full"
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
                            {user.name}
                        </h3>
                        <p className="font-medium">{user.email}</p>
                        <div className="mx-auto mt-4.5 mb-5.5 grid max-w-94 grid-cols-3 rounded-md border border-stroke py-2.5 shadow-1 dark:border-strokedark dark:bg-[#37404F]">
                            <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-strokedark xsm:flex-row">
                                <span className="font-semibold text-black dark:text-white">
                                    ID
                                </span>
                                <span className="text-sm">{user.id}</span>
                            </div>
                            <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-strokedark xsm:flex-row">
                                <span className="font-semibold text-black dark:text-white">
                                    Status
                                </span>
                                <span className="text-sm">Active</span>
                            </div>
                            <div className="flex flex-col items-center justify-center gap-1 px-4 xsm:flex-row">
                                <span className="font-semibold text-black dark:text-white">
                                    Verified
                                </span>
                                <span className="text-sm">Yes</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserProfile;
