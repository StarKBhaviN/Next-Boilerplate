import SignUpForm from "@/components/forms/SignUpForm";

export const metadata = {
  title: "Sign Up - Create Your Account",
  description: "Create a new account to get started",
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-3xl font-extrabold text-gray-900 mb-2">
            Welcome!
          </h1>
          <p className="text-center text-gray-600">
            Create your account to get started
          </p>
        </div>
        <SignUpForm />
      </div>
    </div>
  );
}
