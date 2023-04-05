import { readMdContent, readPostListPath } from '@/utils';
import { copy2Clipboard } from '@/utils/coyp';
import { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { ReactElement, useEffect, useMemo } from 'react';
export const getStaticProps: GetStaticProps = async (ctx) => {
  const { path } = ctx.params as any

  const data = await readMdContent(`/docs/${path.join('/')}`)
  return {
    props: {
      data
    }
  }
}

export const getStaticPaths = async () => {

  const paths = (await readPostListPath()).map(path => ({ params: { path: [path] } }))

  return {
    paths,
    fallback: true
  }
}



type PostPageProps = {
  data: postItem
}
const PostPage: NextPage<PostPageProps> = ({ data = {} as postItem }): ReactElement => {

  useEffect(() => {

    const copyBtnList = document.querySelectorAll('.copy-btn')
    copyBtnList.forEach((btn: any) => {
      btn.addEventListener('click', () => {

        const uid = btn.dataset.uid
        const value = (document.getElementById(uid) as any).value
        copy2Clipboard(value)

      })
    })

  }, [])

  return <div>
    <Head>
      <title>{data.title}</title>
    </Head>
    <div className='container-box vp-doc'>
      <div dangerouslySetInnerHTML={{
        __html: data.html
      }}>
      </div>
    </div>
  </div>;
};

export default PostPage;