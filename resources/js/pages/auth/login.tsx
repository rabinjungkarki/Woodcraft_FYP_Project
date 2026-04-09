import AuthPage from './auth-page';
export default function Login(props: any) { return <AuthPage {...props} />; }
Login.layout = (page: React.ReactNode) => page;
