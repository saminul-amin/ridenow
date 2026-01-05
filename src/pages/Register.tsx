import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Car } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { toast } from 'react-hot-toast';
import { useRegisterMutation } from '../services/authApi';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(11, 'Phone must be at least 11 digits (e.g., 01XXXXXXXXX)'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  role: z.enum(['rider', 'driver']),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Register = () => {
  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterMutation();

  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'rider',
    }
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data).unwrap();
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error: any) {
      if (error.data?.errorSources) {
         error.data.errorSources.forEach((err: any) => {
            toast.error(err.message);
         });
      } else {
         toast.error(error.data?.message || 'Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Car className="h-12 w-12 text-black" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create a new account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${register('role') && (watch('role') === 'rider') ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" value="rider" className="sr-only" {...register('role')} />
                    <span className="font-medium">Rider</span>
                  </label>
               </div>
               <div>
                  <label className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${watch('role') === 'driver' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" value="driver" className="sr-only" {...register('role')} />
                    <span className="font-medium">Driver</span>
                  </label>
               </div>
            </div>

            <Input
              label="Full Name"
              type="text"
              {...register('name')}
              error={errors.name?.message}
              placeholder="Enter Your Full Name"
            />

            <Input
              label="Email address"
              type="email"
              {...register('email')}
              error={errors.email?.message}
              placeholder="Enter Your Email"
            />

            <Input
              label="Phone Number"
              type="tel"
              placeholder="01XXXXXXXXX"
              {...register('phone')}
              error={errors.phone?.message}
            />

            <Input
              label="Password"
              type="password"
              {...register('password')}
              error={errors.password?.message}
              placeholder="Enter Your Password"
            />

            <Input
              label="Confirm Password"
              type="password"
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
              placeholder="Enter Your Confirm Password"
            />

            <div>
              <Button type="submit" className="w-full" isLoading={isLoading}>
                Create Account
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
