import { readAllMdContent, readPostListPath } from '@/utils';
import { GetStaticProps, NextPage } from 'next';
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


  return <div>{
    list.map(({ title, path }) => <div key={path}>
      <Link href={path}>{title}</Link>
    </div>)

  }</div>;
};

export default List;