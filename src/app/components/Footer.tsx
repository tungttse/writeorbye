'use client';

type FooterProps = {
  variant?: 'landing' | 'app';
};

const Footer = ({ variant = 'app' }: FooterProps) => {
  const isLanding = variant === 'landing';

  return (
    <footer className={`text-center text-gray-500 dark:text-gray-400 space-y-2 ${isLanding ? 'mt-24 text-sm' : 'py-3 text-xs'}`}>
      {isLanding && (
        <p>Write or Bye — Because sometimes you need a little pressure to create.</p>
      )}
      <p>
        Contact:{' '}
        <a 
          href="mailto:tungttse@gmail.com" 
          className="text-blue-500 hover:text-blue-400 underline"
        >
          tungttse@gmail.com
        </a>
      </p>
    </footer>
  );
};

export default Footer;
