import Link from 'next/link'
import { VFC } from 'react'

const CustomLink: VFC<any> = ({ as, href, ...otherProps }) => {
  return (
    <>
      <Link as={as} href={href}>
        <a {...otherProps} />
      </Link>
      <style jsx>{`
        a {
          color: tomato;
        }
      `}</style>
    </>
  )
}

export default CustomLink
