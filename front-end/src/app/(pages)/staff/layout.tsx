import React from 'react';
import Header from './component/Header';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className=''>
      <Header/>
      <main className='bg-light-50'>{children}</main>
    </div>
  );
};

export default Layout;
