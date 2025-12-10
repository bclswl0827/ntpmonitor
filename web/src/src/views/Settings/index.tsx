import { useRef, useState } from 'react';

import { useVerifyPasswordLazyQuery } from '../../graphql';

const Settings = () => {
    const [verifyPassword] = useVerifyPasswordLazyQuery();
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [, setPassword] = useState('');

    const passwordInputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        setError('');
        const password = passwordInputRef.current?.value ?? '';
        const { data } = await verifyPassword({ variables: { password } });
        if (data?.verifyPassword === true) {
            setIsSignedIn(true);
            setPassword(password);
        } else {
            setError('Invalid password');
        }
    };

    return isSignedIn ? (
        <div className="ml-4 flex flex-col space-y-4 md:mt-6">
            <div className="flex flex-col space-y-2">
                <h2 className="mb-2 text-4xl font-extrabold text-gray-800">Global Settings</h2>
            </div>
        </div>
    ) : (
        <div className="flex h-screen items-center justify-center">
            <div className="w-full max-w-sm rounded-md border border-gray-200 bg-white p-8 shadow-md">
                <h2 className="mb-6 text-center text-2xl font-bold text-gray-700">Sign In</h2>

                <input
                    ref={passwordInputRef}
                    type="password"
                    className="input input-bordered w-full bg-gray-50 text-gray-800"
                    placeholder="Enter password"
                />

                {error && <div className="mt-2 font-mono text-sm text-red-500">{error}</div>}

                <button
                    onClick={handleLogin}
                    className="btn btn-md bg-base-200 hover:bg-base-300 mt-4 w-full rounded-md border font-semibold text-gray-700"
                >
                    Login
                </button>
            </div>
        </div>
    );
};

export default Settings;
