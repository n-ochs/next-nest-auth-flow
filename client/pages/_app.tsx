import '@styles/globals.css';

import { Toaster } from 'react-hot-toast';

import type { AppProps } from 'next/app';

const App: (props: AppProps) => JSX.Element = ({ Component, pageProps }) => {
	return (
		<>
			<Component {...pageProps} />
			<Toaster />
		</>
	);
};

export default App;
