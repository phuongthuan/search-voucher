import React, { useState, useEffect } from 'react';
import _isEmpty from 'lodash/isEmpty'
import axios from 'axios'

import './App.css';
import 'milligram/dist/milligram.min.css'
import AddVoucher from './AddVoucher';

// const voucherData = {
//   voucherCode: 'vc1',
//   dateOfAvailment: 'qwdqwd',
//   landersMembersID: 'LD1',
//   accumulatedPurchase: 30,
//   payableToLanders: 2525
// }

// function wait(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

// async function fetchVoucher(code) {
//   await wait(2000)
//   if (code === voucherData.voucherCode) {
//     return voucherData
//   }
//   return {
//     voucherCode: code,
//     dateOfAvailment: '',
//     landersMembersID: '',
//     accumulatedPurchase: '',
//     payableToLanders: ''
//   }
// }

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
        // const result = await fetch(`http://${window.location.hostname}:3800/voucher/${search}`)
        const { data } = await axios.get(`http://192.168.1.20:3800/voucher/${search}`)

        if (data.landersMembersID) {
          setVoucher(data)
        } else {
          setError({ message: `Lander member not found for voucher: ${search.toUpperCase()}` })
          setVoucher(data)
        }

      } catch (error) {
        setError({ message: 'Something wrong, maybe server was shut down :)'})
      } finally {
        setIsLoading(false)
      }
    };

    if (search) searchVoucher()
    return () => {
      setVoucher({})
      setError({})
    }
  }, [search]);

  // const renderTable = () => voucher && voucher.landersMembersID && (
  //   <table>
  //     <thead>
  //       <tr>
  //         <th>Code</th>
  //         <th>Date Of Availment</th>
  //         <th>Landers Members ID</th>
  //         <th>Accumulated Purchase</th>
  //         <th>Payable To Landers</th>
  //         <th></th>
  //       </tr>
  //     </thead>
  //     <tbody>
  //       <tr>
  //         <td>{voucher.voucherCode}</td>
  //         <td>{voucher.dateOfAvailment}</td>
  //         <td>{voucher.landersMembersID}</td>
  //         <td>{voucher.accumulatedPurchase}</td>
  //         <td>{voucher.payableToLanders}</td>
  //         <td>
  //           <button className="button button-small">Add Code</button>
  //         </td>
  //       </tr>
  //     </tbody>
  //   </table>
  // )

  const renderDetail = () => {
    if (!_isEmpty(voucher) && voucher.landersMembersID) {
      return (
        <div className="voucher-detail">
          <p><strong>Code: </strong>{voucher.voucherCode}</p>
          <p><strong>Date Of Availment: </strong>{voucher.dateOfAvailment}</p>
          <p><strong>Landers Members ID: </strong>{voucher.landersMembersID}</p>
        </div>
      )
    }
  }

  return (
    <div className="container" style={{ marginTop: `3em` }}>
      <form onSubmit={onSubmit}>
        <fieldset>
          <input value={query} type="text" onChange={onChange} placeholder="Enter voucher code" />
          <input type="submit" className="button button-outline button-small" value="Search" />
        </fieldset>
      </form>

      {isLoading ? (<p>Loading ... </p>) : renderDetail()}
      {error && <div className="error-wrapper"><p>{error.message}</p></div>}
      {(!_isEmpty(voucher) && !voucher.landersMembersID) && <AddVoucher code={voucher.voucherCode} />}
    </div>
  );
}

export default App;
