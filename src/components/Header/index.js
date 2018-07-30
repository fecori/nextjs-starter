import Link from 'next/link';

// Style
import style from './style.css';

const linkStyle = {
  marginRight: 15
};

const Header = () => (
  <div className="header">
    <LazyImage loaderImage originalSrc={require('../../static/header-logo.png')} imageProps={{
      path: require('../../static/header-logo.png'),
      alt: "Logo of Data Ring!",
      ref: "logo",
      className: "logo"
    }} />
    <Link href="/">
      <a style={linkStyle}>Home</a>
    </Link>
    <Link href="/about">
      <a style={linkStyle}>About</a>
    </Link>

    <style dangerouslySetInnerHTML={{ __html: style }} />
  </div>
)

export default Header
