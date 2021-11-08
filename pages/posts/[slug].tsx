import fs from 'fs'
import { bundleMDX } from 'mdx-bundler'
import { getMDXComponent } from 'mdx-bundler/client'
import { GetStaticPaths, GetStaticProps } from 'next'
import Link from 'next/link'
import path from 'path'
import { useMemo } from 'react'
import CustomLink from '../../components/CustomLink'
import Layout from '../../components/Layout'
import { postFilePaths, POSTS_PATH } from '../../utils/mdxUtils'

type Props = {
  code: string
  frontmatter: { title: string; description?: string }
}

const components = {
  a: CustomLink,
}

export default function PostPage({ code, frontmatter }: Props) {
  const Component = useMemo(() => getMDXComponent(code), [code])

  return (
    <Layout>
      <header>
        <nav>
          <Link href="/">
            <a>👈 Go back home</a>
          </Link>
        </nav>
      </header>
      <div className="post-header">
        <h1>{frontmatter.title}</h1>
        {frontmatter.description && (
          <p className="description">{frontmatter.description}</p>
        )}
      </div>
      <main>
        <Component components={components} />
      </main>

      <style jsx>{`
        .post-header h1 {
          margin-bottom: 0;
        }
        .post-header {
          margin-bottom: 2rem;
        }
        .description {
          opacity: 0.6;
        }
      `}</style>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const postFilePath = path.join(POSTS_PATH, `${params?.slug}.mdx`)
  const source = fs.readFileSync(postFilePath, 'utf-8')

  const { code, frontmatter } = await bundleMDX(source)

  return {
    props: {
      code,
      frontmatter,
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = postFilePaths
    .map((path) => path.replace(/\.mdx?$/, ''))
    .map((slug) => ({ params: { slug } }))

  return {
    paths,
    fallback: false,
  }
}
