import React from 'react';
import LoginForm from '../../../components/auth/LoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Log In — My Weather Account',
  description: 'Log in to My Weather to sync saved locations, configure severe weather alerts, and manage API keys.',
};

export default function LoginPage() {
  return (
    <div className="py-12 flex items-center justify-center">
      <LoginForm />
    </div>
  );
}
