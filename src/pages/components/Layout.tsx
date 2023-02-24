/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { FC, ReactElement, ReactNode } from 'react';

type LayoutProps = {
  children: ReactNode
}
const Layout: FC<LayoutProps> = ({ children }): ReactElement => {
  return <div style={{
    paddingTop: 100
  }}>
    <header className='layout-head'>
      <Link className='logo' href={'/'} replace>
        <img src="https://s2.loli.net/2022/12/13/vVFejXUpPTcCIsM.png" alt="vVFejXUpPTcCIsM" />
        kuangw blog
      </Link>
      <div>
        <a href="">github</a>
      </div>
    </header>
    {children}
    <footer>

    </footer>
  </div>;
};

export default Layout;