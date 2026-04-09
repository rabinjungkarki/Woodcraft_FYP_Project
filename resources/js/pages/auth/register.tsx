import AuthPage from './auth-page';
export default function Register(props: any) { return <AuthPage {...props} />; }
Register.layout = (page: React.ReactNode) => page;
