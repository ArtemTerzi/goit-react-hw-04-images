import { useCallback, useEffect, useRef, useState } from 'react';
import sass from './ImageGallery.module.scss';
import ImageGalleryItem from 'components/ImageGalleryItem';
import { fetchData } from 'helpers/fetchAPI';
import Button from 'components/Button';
import Loader from 'components/Loader';
import Modal from 'components/Modal';
import PropTypes from 'prop-types';
import Error from 'components/Error';

const ImageGallery = ({ query }) => {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('idle');
  const [isModalOpen, setisModalOpen] = useState(false);
  const [modalIMG, setModalIMG] = useState('');
  const isFisrtRender = useRef(true);
  const prevQuery = useRef('');

  const getData = useCallback(() => {
    fetchData(query, 1).then(response => {
      if (!response.hits.length) {
        setStatus('rejected');
        prevQuery.current = query;
        return;
      }
      setImages(response.hits);
      setStatus('resolved');
      setPage(1);
      if (response.totalHits === response.hits.length) {
        setStatus('idle');
      }
      prevQuery.current = query;
    });
  }, [query]);

  useEffect(() => {
    if (isFisrtRender.current) {
      isFisrtRender.current = false;
      return;
    }

    try {
      if (prevQuery.current !== query && page !== 1) {
        getData();
      }

      if (query.length >= 1 && page === 1 && prevQuery.current !== query) {
        getData();
      }
    } catch (error) {
      console.error(error);
    }
  }, [getData, page, query]);

  const onLoadMore = () => {
    setStatus('pending');
    setPage(prev => prev + 1);

    fetchData(query, page + 1).then(response => {
      setImages(prev => [...prev, ...response.hits]);
      setStatus('resolved');
    });
  };

  const showModal = e => {
    setisModalOpen(true);
    return images;
    // largeItemFinder(e);
  };

  const closeModal = ({ target, currentTarget }) => {
    if (target === currentTarget) setisModalOpen(false);
  };

  const largeItemFinder = ({ target }) => {
    const seachItem = images.find(el => el.webformatURL === target.src);
    const largeImage = seachItem.largeImageURL;
    setModalIMG(largeImage);
  };

  return (
    <>
      <ul className={sass.imageGallery}>
        {images.map(({ id, webformatURL, tags }) => {
          return (
            <ImageGalleryItem
              key={id}
              image={webformatURL}
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
