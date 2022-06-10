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
        <div> 
          <Image width={110} height={31} className={styles.logo} src='/images/logo.svg' alt='ig.news'></Image>
        </div>
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