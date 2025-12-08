import React, { Fragment } from 'react';
import LoginHeader from '../../../Components/Client/LoginHeader/LoginHeader';
import LoginForm from '../../../Components/Client/LoginForm/LoginForm';
export default function LoginPage() {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">
                <LoginHeader />
                <LoginForm />
            </div>
        </div>
    );
}
