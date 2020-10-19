import Link from 'next/link';


const Header = ({ currentUser }) => {
    const links = [
        !currentUser && { label: 'Sign In', href: '/auth/signin' },
        !currentUser && { label: 'Sign Up', href: '/auth/signup' },
        currentUser && {label: 'Sell Tickets', href: '/tickets/new'},
        currentUser && {label: 'My Orders', href: '/orders'},
        currentUser && { label: 'Sign Out', href: '/auth/signout' },
    ]
        .filter(link => link)
        .map(({ label, href }) => (
            <li key={href} className="mr-3">
                <Link href={href}>
                    <a className="nav-link">{label}</a>
                </Link>
            </li>
        ));

    return (
        <nav className="navbar navbar-light bg-light">
            <Link href='/'>
                <a className="navbar-brand">AirTix</a>
            </Link>

            <div className="d-flex justify-content-end">
                <ul className="nav d-flex aligh-items-center">
                    {links}
                </ul>
            </div>
        </nav>
    );
}

export default Header;