import { useState, useEffect } from 'react'
import axios from 'axios'

export const useForm = (callback) => {
  const [inputs, setInputs] = useState({})

  const handleSubmit = e => {
    if (e) {
      e.preventDefault();
    }
    callback();
  }

  const handleInputChange = e => {
    e.persist();
    setInputs(inputs => ({...inputs, [e.target.name]: e.target.value}));
  }

  return {
    handleSubmit,
    handleInputChange,
    inputs
  };
};

export const useSearchVoucher = () => {
  const [data, setData] = useState({})
  const [url, setUrl] = useState('')
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setError({});
      setIsLoading(true);

      try {
        const { data } = await axios(url);
        setData(data);
      } catch (error) {
        setError({ message: 'Something wrong, maybe server was shut down :)' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

  }, [url]);

  return [{ data, isLoading, error }, setUrl]
}

