import Link from 'next/link';
import { auth } from '@/auth';
import { signOutUser } from '@/lib/actions/user.actions';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { User2Icon } from 'lucide-react';

const UserBtn = async () => {
  const session = await auth();
  console.log('session', session);
  if (!session) {
    return (
      <Button asChild>
        <Link href="/sign-in">
          <User2Icon /> Sign In
        </Link>
      </Button>
    );
  }
  return <>user</>;
};

export default UserBtn;
