import { readAllMdContent, readPostListPath } from '@/utils';
import { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import { ReactElement } from 'react';
export const getStaticProps: GetStaticProps = async (ctx) => {
  const list = await readAllMdContent()
  return {
    props: {
      list: list
    }
  }
}
type ListProps = {

  list: postItem[]
}
const List: NextPage<ListProps> = ({ list }): ReactElement => {


  return <>
    <Head>
      <title>博客列表</title>
    </Head>
    <div className='vp-doc container-box'>
      {
        list.map(({ title, path }) => <div key={path} className='list-link'>
          <Link href={path}>{title}</Link>
        </div>)
      }
    </div>

  </>;
};

export default List;