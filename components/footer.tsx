import { APP_NAME } from '@/lib/constants';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t">
      <p>
        Copyright &copy; {currentYear} {APP_NAME} All rights reserved
      </p>
    </footer>
  );
};

export default Footer;
