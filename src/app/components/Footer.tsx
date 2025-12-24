'use client';

type FooterProps = {
    variant?: 'landing' | 'app';
};

const Footer = ({ variant = 'app' }: FooterProps) => {
    const isLanding = variant === 'landing';

    return (
        <footer className={`footer ${isLanding ? 'footer-landing' : 'footer-app'}`}>
            {isLanding && (
                <p>Write or Bye — Because sometimes you need a little pressure to create.</p>
            )}
            <p>
                Contact:{' '}
                <a
                    href="mailto:tungttse@gmail.com"
                    className="footer-link"
                >
                    tungttse@gmail.com
                </a>
                {' '}•{' '}
                <a
                    href="https://www.linkedin.com/in/tungttse/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-link"
                >
                    LinkedIn
                </a>
            </p>
        </footer>
    );
};

export default Footer;
