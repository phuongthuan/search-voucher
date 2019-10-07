import React, { useState, useEffect } from 'react'
import axios from 'axios'
import _isEmpty from 'lodash/isEmpty'
import Spinner from './Spinner'

import { useForm } from './utils/customHooks'
import { BASE_URL } from './utils/constants'
import moment from 'moment'

function AddVoucher({ code }) {
  const [error, setError] = useState(null)
  const [message, setNotifyMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async () => {

    setIsLoading(true)
    setError({})
    setNotifyMessage('')

    const { dateAvailment, branchAvailment, memberType, membershipCode } = inputs

    const currentDate = dateAvailment ? moment(dateAvailment) : moment();

    const requestUrl = `${BASE_URL}/vouchers`;

    const body = {
      voucher: code, 
      dateAvailment: currentDate.toISOString(), 
      branchAvailment: branchAvailment,
      memberType: memberType,
      membershipCode: membershipCode
    };

    try {

      const { data } = await axios.post(requestUrl, body)
      
      if (data && data.success) {
        setNotifyMessage('Signed Success!')
      }

      if (data && !data.success) {
        setError({ message: data.error || 'Bad Request' })
      }

    } catch (error) {
      setError({ message: `Something wrong, maybe server was shut down :)` })
    } finally {
      setIsLoading(false)
    }
  }

  const { inputs, handleInputChange, handleSubmit } = useForm(onSubmit);

  const { membershipCode, memberType, dateAvailment, branchAvailment } = inputs

  const initialDate = moment().format('YYYY-MM-DD');

  // Clear everything
  useEffect(() => {
    return () => {
      console.log('Ummount component')
      setError({})
      setNotifyMessage('')
    };
  }, [])

  return (
    <div style={{
      marginTop: `1.5rem`
    }}>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <label htmlFor="membershipCode">Member ID</label>
          <input type="text" name="membershipCode" onChange={handleInputChange} value={membershipCode || ''} required />

          <label htmlFor="memberType">Member Type</label>
          <select name="memberType" onChange={handleInputChange} value={memberType} required>
            <option value="">Please select...</option>
            <option value="new">New</option>
            <option value="renew">Renew</option>
          </select>

          <label htmlFor="dateAvailment">Date Availment</label>
          <input type="date" name="dateAvailment" onChange={handleInputChange} value={dateAvailment || initialDate} required />

          <label htmlFor="branchAvailment">Branch Availment</label>
          <select name="branchAvailment" onChange={handleInputChange} value={branchAvailment} required>
            <option value="">Please select...</option>
            <option value="OT">OT</option>
            <option value="BA">BA</option>
            <option value="AR">AR</option>
            <option value="AL">AL</option>
            <option value="CE">CE</option>
          </select>

          <input type="submit" className="button" value="Sign Voucher" />
        </fieldset>
      </form>

      {isLoading && <Spinner />}
      {message && <div className="success-wrapper"><p>{message}</p></div>}
      {!_isEmpty(error) && <div className="error-wrapper"><p>{error.message}</p></div>}

    </div>
  )
}

export default AddVoucher
