import { useRef, useState } from 'react';

import { useVerifyPasswordLazyQuery } from '../../graphql';

interface ILogin {
    readonly onLoginSuccess: (password: string) => void;
}

export const Login = ({ onLoginSuccess }: ILogin) => {
    const [verifyPassword] = useVerifyPasswordLazyQuery();
    const passwordInputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        setError('');
        const password = passwordInputRef.current?.value ?? '';
        const { data } = await verifyPassword({ variables: { password } });
        if (data?.verifyPassword === true) {
            onLoginSuccess(password);
        } else {
            setError('Invalid password');
        }
    };

    return (
        <div className="flex h-96 items-center justify-center md:h-screen">
            <div className="w-full max-w-sm rounded-md border border-gray-200 bg-white p-8 shadow-md">
                <h2 className="mb-6 text-center text-2xl font-bold text-gray-700">Sign In</h2>

                <input
                    ref={passwordInputRef}
                    type="password"
                    className="input w-full bg-gray-50 text-gray-800 outline-0"
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
