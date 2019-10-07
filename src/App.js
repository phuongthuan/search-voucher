import React, { useState, useEffect } from 'react';
import _isEmpty from 'lodash/isEmpty'
import axios from 'axios'
import moment from 'moment'

import 'milligram/dist/milligram.min.css'
import './App.css';
import AddVoucher from './AddVoucher';
import Spinner from './Spinner';
import { BASE_URL } from './utils/constants';

// eslint-disable-next-line
import { fetchVoucher } from './helpers/fakeApi';

function App() {
  const [voucher, setVoucher] = useState({})
  const [query, setQuery] = useState('')
  const [search, setSearch] = useState('')
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const onChange = e => setQuery(e.target.value)

  const onSubmit = e => {
    e.preventDefault()
    setSearch(query)
  }

  useEffect(() => {
    const searchVoucher = async () => {

      setIsLoading(true)
      setError(null)

      try {

        // const data = await fetchVoucher(search)

        const requestUrl = `${BASE_URL}/voucher/${search}`
        const { data } = await axios.get(requestUrl)

        if (data.voucherCode && data.newOrRenewedMemberId) {
          setVoucher(data)
        } else if (data.voucherCode && !data.newOrRenewedMemberId) {
          setError({ message: `Voucher not used, please enter member ID linked to this voucher.` })
          setVoucher(data)
        } else {
          setError({ message: `Voucher Code Invalid` })
        }

      } catch (error) {
        setError({ message: 'Something wrong, maybe server was shut down :).'})
      } finally {
        setIsLoading(false)
      }
    };

    if (search) searchVoucher()

    return () => {
      setVoucher({})
      setError({})
      setSearch('')
    }
  }, [search]);

  const renderDetail = () => {
    if (!_isEmpty(voucher) && voucher.newOrRenewedMemberId) {
      const { voucherCode, landersMembersID, newOrRenewedMemberId, orderNumber, membershipType, branchOfAvailment, dateOfAvailment } = voucher
      const formatDate = moment(dateOfAvailment).format('YYYY-MM-DD')
      return (
        <div className="voucher-detail">
          <p><strong>Code: </strong>{voucherCode}</p>
          <p><strong>Members ID: </strong>{landersMembersID}</p>
          <p><strong>Order ID: </strong>{orderNumber}</p>
          <p><strong>New or Renew Member ID: </strong>{newOrRenewedMemberId}</p>
          <p><strong>Member Type: </strong>{membershipType}</p>
          <p><strong>Date Availment: </strong>{formatDate}</p>
          <p><strong>Branch Availment: </strong>{branchOfAvailment}</p>
        </div>
      )
    }
  }

  return (
    <div style={{ maxWidth: `900px`, margin: `0 auto`, paddingTop: `2rem` }}>
      <form onSubmit={onSubmit}>
        <fieldset>
          <input value={query} type="text" onChange={onChange} placeholder="Enter voucher code" required />
          <input type="submit" className="button button-primary" value="Search" />
        </fieldset>
      </form>

      {isLoading ? <Spinner /> : renderDetail()}
      {!_isEmpty(error) && <div className="error-wrapper"><p>{error.message}</p></div>}
      {!_isEmpty(voucher) && !voucher.newOrRenewedMemberId && voucher.voucherCode && <AddVoucher code={voucher.voucherCode} />}
    </div>
  );
}

export default App;
