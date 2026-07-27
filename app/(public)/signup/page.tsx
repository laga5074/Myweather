import React from 'react';
import SignupForm from '../../../components/auth/SignupForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up — Free My Weather Account',
  description: 'Create a free My Weather account to save favorite locations, configure custom unit defaults, and track live Doppler radar.',
};

export default function SignupPage() {
  return (
    <div className="py-12 flex items-center justify-center">
      <SignupForm />
    </div>
  );
}
