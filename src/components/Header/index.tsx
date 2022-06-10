import { SignInButton } from '../SignInButton';
import Image from 'next/image'
import Link from 'next/link'
import styles from './styles.module.scss'
import { useRouter } from 'next/router';
import { ActiveLink } from '../ActiveLink';

export function Header() {

  const { asPath } = useRouter()

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Image className={styles.logo} src='/images/logo.svg' alt='ig.news'></Image>
        <nav>
          <ActiveLink activeClassName={styles.active} href='/' >
            <a>Home</a>
          </ActiveLink>
          <ActiveLink activeClassName={styles.active} href='/posts'>
            <a> Posts</a>
          </ActiveLink>
        </nav>

        <SignInButton />
      </div>
    </header>
  );
}