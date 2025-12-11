import { useState } from 'react';

import { Dashboard } from './dashboard';
import { Login } from './login';

const Settings = () => {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [password, setPassword] = useState('');

    return !isSignedIn ? (
        <Login
            onLoginSuccess={(password) => {
                setPassword(password);
                setIsSignedIn(true);
            }}
        />
    ) : (
        <Dashboard password={password} />
    );
};

export default Settings;
