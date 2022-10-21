import { NextRouter, useRouter } from 'next/router';
import React, { FormEvent, useRef, useState } from 'react';
import toast from 'react-hot-toast';

import APIService from '@util/api_service';

const SignUpForm: React.FC = () => {
	const router: NextRouter = useRouter();
	const emailInputRef: React.MutableRefObject<HTMLInputElement> = useRef(null);

	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [confirmPassword, setConfirmPassword] = useState<string>('');

	const handleSignUp: (e: FormEvent) => void = async (e: FormEvent) => {
		if (password !== confirmPassword) {
			toast.error('Passwords do not match.');
			return;
		}

		e.preventDefault();
		try {
			await APIService.post('/auth/signup', { email, password }, { headers: { 'Content-Type': 'application/json' } });
			router.push('/');
			toast.success('Successfully created account and signed in.');
		} catch (error) {
			setEmail('');
			setPassword('');
			setConfirmPassword('');
			emailInputRef.current.focus();
		}
	};

	return (
		<form className='w-80 space-y-8 rounded-xl border-1 border-solid border-gray-300 bg-white px-10 pt-4 pb-8 shadow-lg' onSubmit={handleSignUp}>
			<h2 className='text-2xl font-semibold text-gray-900'>Sign Up</h2>
			<div className='relative'>
				<input
					id='email'
					name='email'
					type='text'
					className='peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:border-primaryRed focus:outline-none'
					placeholder='Email address'
					value={email}
					ref={emailInputRef}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<label htmlFor='email' className='auth-input'>
					Email address
				</label>
			</div>
			<div className='relative'>
				<input
					id='password'
					type='password'
					name='password'
					className='peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:border-primaryRed focus:outline-none'
					placeholder='Password'
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<label htmlFor='password' className='auth-input'>
					Password
				</label>
			</div>

			<div className='relative'>
				<input
					id='confirmPassword'
					type='password'
					name='confirmPassword'
					className='peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:border-primaryRed focus:outline-none'
					placeholder='Confirm Password'
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
				/>
				<label htmlFor='confirmPassword' className='auth-input'>
					Confirm Password
				</label>
			</div>

			<button className='btn-primary w-full text-center normal-case' type='submit' disabled={password === '' || confirmPassword === '' || password !== confirmPassword}>
				Sign Up
			</button>
		</form>
	);
};

export default SignUpForm;
