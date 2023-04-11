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
    setStatus('pending');
    fetchData(query, page).then(response => {
      if (!response.hits.length) {
        setStatus('rejected');
        return;
      }
      setImages(prevImages => [...prevImages, ...response.hits]);
      setStatus('resolved');
      if (response.totalHits === response.hits.length) {
        setStatus('idle');
      }
    });
  }, [page, query]);

  useEffect(() => {
    try {
      if (query) {
        getData();
      }
    } catch (error) {
      console.error(error);
    }
  }, [getData, page, query]);

  const onLoadMore = () => {
    setPage(prev => prev + 1);
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
