import { useState, useEffect, useCallback } from 'react';
import Searchbar from 'components/Searchbar';
import ImageGallery from 'components/ImageGallery';
import sass from './App.module.scss';
import { fetchData } from 'helpers/fetchAPI';

const App = () => {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('idle');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);

  const getData = useCallback(() => {
    fetchData(query, 1).then(response => {
      if (!response.hits.length) {
        setStatus('rejected');
        return;
      }
      setImages(response.hits);
      setStatus('resolved');
      setPage(1);
      if (response.totalHits === response.hits.length) {
        setStatus('idle');
      }
    });
  }, [query]);

  useEffect(() => {
    try {
      if (query && page === 1) {
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

  const handleSubmit = query => {
    setImages([]);
    setPage(1);
    setQuery(query);
  };

  return (
    <div className={sass.app}>
      <Searchbar onSubmit={handleSubmit} />
      <ImageGallery
        query={query}
        images={images}
        status={status}
        onLoadMore={onLoadMore}
      />
    </div>
  );
};

export default App;
