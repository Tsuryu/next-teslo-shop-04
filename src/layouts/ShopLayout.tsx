import { FC, PropsWithChildren } from 'react';

import Head from 'next/head';

import { Navbar, SideMenu } from '@/components/ui';

interface Props {
  title: string;
  pageDescription: string;
  imageFullUrl?: string;
}

export const ShopLayout: FC<PropsWithChildren<Props>> = ({ children, imageFullUrl, pageDescription, title }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={pageDescription} />
        <meta name="og:title" content={title} />
        <meta name="og:description" content={pageDescription} />
        {imageFullUrl && <meta name="og:image" content={imageFullUrl} />}
      </Head>
      <Navbar />
      <SideMenu />
      <main style={{ margin: '80px auto', padding: '0px 30px' }}>{children}</main>
    </>
  );
};
