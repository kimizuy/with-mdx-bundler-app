import Link from "next/link"
import { ComponentPropsWithoutRef } from "react"

type Props = ComponentPropsWithoutRef<"a">

const CustomLink = ({ href, ...props }: Props) => {
  if (!href) return <a {...props} />

  return (
    <>
      <Link href={href}>
        <a {...props} />
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
