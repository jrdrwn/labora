import RegisterForm from '@/components/layout/asisten/register/register-form';

export default function LoginPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-4 md:p-10">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  );
}
