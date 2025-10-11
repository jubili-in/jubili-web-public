import { useRouter } from 'next/navigation';
import CustomButton from '../ui/CustomButton';

export default function AuthPopup() {
    const router = useRouter();

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 animate-fadeIn">
                <h2 className="text-2xl font-semibold mb-4">Login Required</h2>
                <p className="text-gray-600 mb-6">
                    Please log in to access this page and view your profile information.
                </p>
                
                <CustomButton
                    onClick={() => router.push('/login')}
                    loading={false}
                    label="Go to Login "
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"  viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12H3m0 0l4-4m-4 4l4 4m13-8v10a2 2 0 01-2 2h-5" /></svg>}
                    iconPosition="right"
                />
            </div>
        </div>
    );
}
