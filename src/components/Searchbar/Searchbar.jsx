import sass from './Searchbar.module.scss';
import { IoSearchOutline } from 'react-icons/io5';
import PropTypes from 'prop-types';
import { useState } from 'react';

const Searchbar = ({ onSubmit }) => {
  const [value, setValue] = useState('');

  const handleChange = ({ target: { value } }) => {
    setValue(value);
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(value);
  };

  return (
    <header className={sass.searchbar}>
      <form className={sass.searchForm} onSubmit={handleSubmit}>
        <button type="submit" className={sass.searchFormButton}>
          <IoSearchOutline size={30} />
        </button>

        <input
          className={sass.searchFormInput}
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          onChange={handleChange}
          value={value}
        />
      </form>
    </header>
  );
};

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default Searchbar;
