import React, { useState, useEffect } from 'react';
import './App.css';
import 'milligram/dist/milligram.min.css'

const data = [
  {
    voucherCode: 'vc1',
    dateOfAvailment: '2019/10/02',
    landersMembersID: 'lmid1',
    accumulatedPurchase: 12.3,
    payableToLanders: 300
  },
  {
    voucherCode: 'vc2',
    dateOfAvailment: '2019/10/02',
    landersMembersID: 'lmid1',
    accumulatedPurchase: 12.3,
    payableToLanders: 300
  },
  {
    voucherCode: 'vc3',
    dateOfAvailment: '2019/10/02',
    landersMembersID: 'lmid1',
    accumulatedPurchase: 12.3,
    payableToLanders: 300
  },
  {
    voucherCode: 'vc4',
    dateOfAvailment: '2019/10/02',
    landersMembersID: 'lmid1',
    accumulatedPurchase: 12.3,
    payableToLanders: 300
  },
]

function getVouchers(code) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const result = data.filter(vCode => vCode.voucherCode === code)
      if (result.length > 0) {
        resolve(result)
      } else {
        reject({ error: 'Voucher not found'})
      }
    }, 2000);
  })
}

function App() {
  const [vouchers, setVouchers] = useState([])
  const [query, setQuery] = useState('')
  const [search, setSearch] = useState('')
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const onChange = e => setQuery(e.target.value)

  const onSubmit = e => {
    e.preventDefault()
    setSearch(query)
  }

  useEffect(() => {
    const searchVoucher = async () => {

      // Start request
      setIsLoading(true)
      setIsError(false)

      try {
        const result = await getVouchers(search)
        setVouchers(result)
      } catch (error) {
        setIsError(true)
      }
      setIsLoading(false)
    };

    if (search) searchVoucher()
    return () => {
      setVouchers([])
    }
  }, [search]);

  const renderTable = () => {
    if (vouchers.length > 0) return (
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Date Of Availment</th>
            <th>Landers Members ID</th>
            <th>Accumulated Purchase</th>
            <th>Payable To Landers</th>
          </tr>
        </thead>
        <tbody>
          {vouchers.map(v => 
            <tr key={v.voucherCode}>
              <td>{v.voucherCode}</td>
              <td>{v.dateOfAvailment}</td>
              <td>{v.landersMembersID}</td>
              <td>{v.accumulatedPurchase}</td>
              <td>{v.payableToLanders}</td>
            </tr>
          )}
        </tbody>
      </table>
    )
    return null
  }

  return (
    <div className="App">
      <form onSubmit={onSubmit}>
        <fieldset style={{ display: 'flex' }}>
          <input value={query} type="text" onChange={onChange} placeholder="Enter voucher code" />
          <button type="submit" className="button button-outline">Search</button>
        </fieldset>
      </form>
      {isLoading 
        ? (<p>Loading ... </p>)
        : renderTable()
      }
      {isError && <p>Voucher not found</p>}
    </div>
  );
}

export default App;
