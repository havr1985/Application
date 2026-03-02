import type { FC } from 'react';
import { useForm } from 'react-hook-form';
import {
  type RegisterFormData,
  registerSchema,
} from '../schemas/auth.schemas.ts';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthActions, useAuthLoading } from '../store/auth.selectors.ts';
import { useAuthStore } from '../store/auth.store.ts';

export const RegisterForm: FC = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuthActions();
  const isLoading = useAuthLoading();
  const error = useAuthStore((s) => s.error);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data.name, data.email, data.password);
      navigate('/');
    } catch {
      // Error is already handled in store
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4">
      <div className="card w-full max-w-md p-8">
        <h1 className="mb-2 text-2xl font-bold text-text-primary">
          Create Account
        </h1>
        <p className="mb-6 text-sm text-text-secondary">
          Fill in the details to get started
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {error && (
            <div className="rounded-md bg-danger-50 px-4 py-3 text-sm text-danger-600">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="name"
              className="text-sm font-medium text-text-primary"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              className="input-field"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-xs text-danger-500">{errors.name.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-sm font-medium text-text-primary"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="john@mail.com"
              className="input-field"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-xs text-danger-500">{errors.email.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-sm font-medium text-text-primary"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Min 6 characters"
              className="input-field"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-xs text-danger-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-text-primary"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Repeat password"
              className="input-field"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-danger-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !isValid}
            className="btn-primary mt-2 w-full"
          >
            {isLoading ? 'Creating account...' : 'Register'}
          </button>

          <p className="text-center text-sm text-text-secondary">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-accent-600 hover:text-accent-700"
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};
