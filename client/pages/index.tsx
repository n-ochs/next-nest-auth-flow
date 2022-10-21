import Link from 'next/link';
import toast from 'react-hot-toast';

import APIService from '@util/api_service';

import type { NextPage } from 'next';

const Home: NextPage = () => {
	const test: () => Promise<void> = async () => {
		try {
			await APIService.get('/app');
			toast.success('Request successful!');
		} catch (error) {
			toast.error(error.response?.status === 401 ? 'You must be signed in to perform this action.' : 'Error: Please contact support.');
		}
	};

	const signOut: () => Promise<void> = async () => {
		try {
			await APIService.post('/auth/signout', null, { withCredentials: true });
			toast.success('Successfully signed out. Tokens in cookies have been cleared.', { duration: 10000 });
		} catch (error) {
			toast.error(error.response?.status === 401 ? 'You must be signed in to perform this action.' : 'Error: Please contact support.');
		}
	};

	const refreshToken: () => Promise<void> = async () => {
		try {
			await APIService.post('/auth/refresh', null, { withCredentials: true });
			toast.success('Request successful! Tokens in cookies have been refreshed.');
		} catch (error) {
			toast.error(error.response?.status === 401 ? 'You must be signed in to perform this action.' : 'Error: Please contact support.');
		}
	};

	return (
		<div className='h-screen flex items-center justify-center space-x-4'>
			<Link href='/signin'>
				<a className='btn-primary normal-case'>Sign In (Public)</a>
			</Link>
			<Link href='/signup'>
				<a className='btn-primary normal-case'>Sign Up (Public)</a>
			</Link>
			<button className='btn-primary normal-case' onClick={test}>
				Test (Protected)
			</button>
			<button className='btn-primary normal-case' onClick={signOut}>
				Signout (Protected)
			</button>
			<button className='btn-primary normal-case' onClick={refreshToken}>
				Manually Refresh Token (RT Protected)
			</button>
		</div>
	);
};

export default Home;
