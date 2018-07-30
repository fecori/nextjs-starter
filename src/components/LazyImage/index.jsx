import LazyLoad from 'react-image-lazy-load'
import helpers from '../../../helpers';

class LazyImage extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      src:this.props.imageProps.path,
      placeholder:this.props.imageProps.path,
      alt: this.props.imageProps.alt,
      ref: this.props.imageProps.ref,
      className: this.props.imageProps.className
    };
  }

  componentWillMount(){
    if (process.env.NODE_ENV == 'production')
      this.setState({
        src:this.props.imageProps.path.src.src,
        placeholder:this.props.imageProps.path.src.preview
      });
  }

  render () {
    return (
      <LazyLoad loaderImage height={this.props.height} originalSrc={this.state.src} imageProps={{
        src: this.state.placeholder,
        alt: this.state.alt,
        ref: this.state.ref,
        className: this.state.className
      }} />
    );
  }
}

export default LazyImage
