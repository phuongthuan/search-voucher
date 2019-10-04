import React, { useState } from 'react'
import axios from 'axios'

function AddVoucher({ code }) {
  const [memberCode, setMemberCode] = useState('')

  const onChange = e => setMemberCode(e.target.value)

  const onSubmit = async e => {
    e.preventDefault()

    // Sign Voucher code request
    const { data } = await axios.post(`http://192.168.1.20:3800/vouchers`, {
      voucher: code,
      membershipCode: memberCode
    })

    // Do something with data
    console.log('data', data && data)
  }

  return (
    <div style={{
      marginTop: `2rem`
    }}>
      <form onSubmit={onSubmit}>
        <fieldset>
          <label htmlFor="voucherCode">Please add Lander member ID for this voucher:</label>
          <input type="text" placeholder="Enter member ship code" value={memberCode} onChange={onChange} />
          <input type="submit" className="button button-small" value="Sign Voucher" />
        </fieldset>
      </form>
    </div>
  )
}

export default AddVoucher
