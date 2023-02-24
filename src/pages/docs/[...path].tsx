import { readMdContent, readPostListPath } from '@/utils';
import { GetStaticProps, NextPage } from 'next';
import { ReactElement } from 'react';
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
  return <div>
    <h1>{data.title}</h1>
    <div dangerouslySetInnerHTML={{
      __html: data.html
    }}>

    </div>
  </div>;
};

export default PostPage;