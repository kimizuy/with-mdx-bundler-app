import fs from 'fs'
import matter from 'gray-matter'
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
  frontMatter: { title: string; description?: string }
}

const components = {
  a: CustomLink
}

export default function PostPage({ code, frontMatter }: Props) {
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
        <h1>{frontMatter.title}</h1>
        {frontMatter.description && (
          <p className="description">{frontMatter.description}</p>
        )}
      </div>
      <main>
        <Component components={{ a: CustomLink }} />
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
  const source = fs.readFileSync(postFilePath)
  const { content, data } = matter(source)

  const { code } = await bundleMDX(content)

  return {
    props: {
      code,
      frontMatter: data
    }
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = postFilePaths
    .map((path) => path.replace(/\.mdx?$/, ''))
    .map((slug) => ({ params: { slug } }))

  return {
    paths,
    fallback: false
  }
}
