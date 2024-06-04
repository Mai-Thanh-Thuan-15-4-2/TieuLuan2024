import callAPI from './callAPI.js';

class Test {
  constructor() {
    this.api = new callAPI();
  }

  async testGetAccountById() {
    try {
      const accountId = 1002;
      const accountData = await this.api.getAccountById(accountId);
      console.log('Account data:', accountData);
    } catch (error) {
      console.error('Error testing getAccountById:', error);
    }
  }
}
const tester = new Test();
tester.testGetAccountById();