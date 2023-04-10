import { useState } from 'react';
import sass from './ImageGallery.module.scss';
import ImageGalleryItem from 'components/ImageGalleryItem';
import Button from 'components/Button';
import Loader from 'components/Loader';
import Modal from 'components/Modal';
import PropTypes from 'prop-types';
import Error from 'components/Error';

const ImageGallery = ({ status, images, onLoadMore }) => {
  const [isModalOpen, setisModalOpen] = useState(false);
  const [modalIMG, setModalIMG] = useState('');

  const showModal = image => {
    setisModalOpen(true);
    setModalIMG(image);
  };

  const closeModal = ({ target, currentTarget }) => {
    if (target === currentTarget) setisModalOpen(false);
  };

  return (
    <>
      <ul className={sass.imageGallery}>
        {images.map(({ id, webformatURL, tags, largeImageURL }) => {
          return (
            <ImageGalleryItem
              key={id}
              image={webformatURL}
              largeImage={largeImageURL}
              tags={tags}
              showModal={showModal}
            />
          );
        })}
      </ul>
      {status === 'pending' && <Loader />}
      {status !== 'idle' && status !== 'pending' && images.length !== 0 && (
        <Button onLoadMore={onLoadMore} />
      )}
      {status === 'rejected' && <Error />}
      {isModalOpen && <Modal largeImage={modalIMG} closeModal={closeModal} />}
    </>
  );
};

ImageGallery.propTypes = {
  query: PropTypes.string.isRequired,
};

export default ImageGallery;
