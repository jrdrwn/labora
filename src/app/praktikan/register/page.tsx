import RegisterForm from '@/components/layout/praktikan/register/register-form';

export default function RegisterPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-4 md:p-10">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  );
}
