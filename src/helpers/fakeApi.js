const voucherData = {
  voucherCode: 'vc1',
  dateOfAvailment: 'qwdqwd',
  landersMembersID: 'LD1',
  orderNumber: 'IUQHWDIUQWDSND',
  membershipType: 'P',
  branchOfAvailment: 'qwdqwdqwd'
}

export function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function fetchVoucher(code) {
  await wait(2000)
  if (code === voucherData.voucherCode) {
    return voucherData
  }
  return {
    voucherCode: code,
    dateOfAvailment: '',
    landersMembersID: '',
    orderNumber: '',
    membershipType: '',
    branchOfAvailment: ''
  }
}