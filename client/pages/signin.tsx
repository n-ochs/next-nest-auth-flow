import SignInForm from '@components/auth/signin.component';

import type { NextPage } from 'next';

const SignIn: NextPage = () => {
	return (
		<div className='h-screen flex items-center justify-center'>
			<SignInForm />
		</div>
	);
};

export default SignIn;
