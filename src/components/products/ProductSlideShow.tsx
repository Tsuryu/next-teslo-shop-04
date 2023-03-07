import { CSSProperties, FC } from 'react';

import 'react-slideshow-image/dist/styles.css';
import { Slide } from 'react-slideshow-image';

interface Props {
  images: string[];
}

const divStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundSize: 'cover',
  height: '100vh',
  backgroundPosition: 'center'
};

export const ProductSlideShow: FC<Props> = ({ images = [] }) => {
  return (
    <Slide>
      {images.map((image, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={index}>
          <div style={{ ...divStyle, backgroundImage: `url(${image})` }} />
        </div>
      ))}
    </Slide>
  );
};
