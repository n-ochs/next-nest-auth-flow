import SignUpForm from '@components/auth/signup.component';

import type { NextPage } from 'next';

const SignIn: NextPage = () => {
	return (
		<div className='h-screen flex items-center justify-center'>
			<SignUpForm />
		</div>
	);
};

export default SignIn;
