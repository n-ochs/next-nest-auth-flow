import axios, { AxiosInstance } from 'axios';

const APIService: AxiosInstance = axios.create({
	baseURL: 'http://localhost:8080/api',
	withCredentials: true
});

APIService.interceptors.response.use(
	(response) => {
		return response;
	},
	async (error) => {
		if (error.response?.config?.url === '/auth/refresh' && error?.response?.status === 401) {
			return Promise.reject(error);
		}
		if (error?.response?.status === 401) {
			await APIService.post('/auth/refresh', null);
			switch (error?.config?.method) {
				case 'get':
					return APIService.get(`${error?.config?.baseURL}${error?.config?.url}`);
				case 'post':
					return APIService.post(`${error?.config?.baseURL}${error?.config?.url}`, JSON.parse(error?.config?.data));
				default:
					break;
			}
		}
		return Promise.reject(error);
	}
);

export default APIService;
