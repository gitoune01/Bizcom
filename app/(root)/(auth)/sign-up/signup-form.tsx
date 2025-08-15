'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formUpVals } from '@/lib/constants';
import Link from 'next/link';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { signUpUser } from '@/lib/actions/user.actions';
import { useSearchParams } from 'next/navigation';

const SignUpForm = () => {
  const [data, action] = useActionState(signUpUser, {
    success: false,
    message: '',
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const SignUpButton = () => {
    const { pending } = useFormStatus();
    return (
      <Button disabled={pending} className="w-full" variant={'default'}>
        {pending ? 'SignUp In Progress...' : 'Sign Up'}
      </Button>
    );
  };

  return (
    <form action={action}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-6">
        <div className="">
          <Label htmlFor="name">Name</Label>
          <Input
            type="name"
            name="name"
            id="name"
            className="w-full"
        
            autoComplete="name"
            defaultValue={formUpVals.name}
          />
        </div>
        <div className="">
          <Label htmlFor="email">Email</Label>
          <Input
            type="text"
            name="email"
            id="email"
            className="w-full"
        
            autoComplete="email"
            defaultValue={formUpVals.email}
          />
        </div>

        <div className="">
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            name="password"
            id="password"
            className="w-full"
    
            autoComplete="password"
            defaultValue={formUpVals.password}
          />
        </div>
        <div className="">
          <Label htmlFor="password">Confirm Password</Label>
          <Input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            className="w-full"
      
            autoComplete="confirmPassword"
            defaultValue={formUpVals.confirmPassword}
          />
        </div>
        <div className="">
          <SignUpButton />
        </div>
        {data && !data.success && (
          <div className="text-red-500 text-center">{data.message}</div>
        )}

        <div className="text-sm text-center text-muted-foreground">
          Already have an account?{' '}
          <Link href="/sign-in" target="_self" className="link">
            Sign In
          </Link>
        </div>
      </div>
    </form>
  );
};

export default SignUpForm;
