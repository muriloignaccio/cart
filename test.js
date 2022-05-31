const models = require('./database/models');
const { createHmac } = require('crypto')

// models.Cart.findAll({ 
//   include: {
//     all: true,
//     nested: true
//   }
//   // include: {
//   //   model: models.CartItem, 
//   //   as: "items", 
//   //   include: {
//   //     model: models.Product,
//   //     as: "product"
//   //   }
//   // } 
// })
//   .then(users => users.map(user => user.toJSON()))
//   .then(result => console.log(JSON.stringify(result, null, 2)));


async function test() {
  const userId = '8c24aa06-83f1-4b07-b73a-4ce129e4491e';
  // const productId = '8491b32a-bba6-422c-9354-5d4d3aabd6ee';
  const productId = '261bfaf0-0da7-4418-a912-daa009008521';

  const cart = await models.Cart.findOne({ 
    where: { userId },
    include: { all: true, nested: true }
  });

  const isProductInCart = await cart.getItems({ where: { productId }}).then(items => items[0]);

  if (!isProductInCart) {
    await cart.createItem({ productId, quantity: 1 });
  } else {
    isProductInCart.quantity += 1;
    await isProductInCart.save()
  }

  const total = cart.toJSON().items.reduce((total, item) => {
    return total + item.quantity * item.product.price;
  }, 0);

  cart.total = total;

  await cart.save();
  await cart.reload();

  console.log(cart.toJSON())
}

async function destroy() {
  const userId = '8c24aa06-83f1-4b07-b73a-4ce129e4491e';
  // const productId = '8491b32a-bba6-422c-9354-5d4d3aabd6ee';
  const productId = '261bfaf0-0da7-4418-a912-daa009008521';

  const cart = await models.Cart.findOne({ 
    where: { userId },
    include: { all: true, nested: true }
  });
  
  await models.CartItem.destroy({ where: { productId } });

  console.log(cart.total)
  
  await cart.updateTotal(userId);
  await cart.reload()
  
  console.log(cart.total)
  // const total = cart.toJSON().items.reduce((total, item) => {
  //   return total + item.quantity * item.product.price;
  // }, 0);

  // cart.total = total;

  // await cart.save();
  // console.log(await cart.countItems())

  // console.log(cart.toJSON())
}

// destroy()
// test()

// async function fetchProducts() {
//   const products = await models.Product.findAll({ include: 'cartItems' });

//   console.log(JSON.stringify(products, null, 2))
// }

// fetchProducts()

const generateSignature = (establishData, accessKey) => {
  let query = '';
  if (establishData.accessId) query += `accessId=${establishData.accessId}`;
  if (establishData.merchantId) query += `&merchantId=${establishData.merchantId}`;
  if (establishData.description) query += `&description=${establishData.description}`;
  if (establishData.currency) query += `&currency=${establishData.currency}`;
  if (establishData.amount) query += `&amount=${establishData.amount}`;
  if (establishData.displayAmount) query += `&displayAmount=${establishData.displayAmount}`;
  if (establishData.minimumBalance) query += `&minimumBalance=${establishData.minimumBalance}`;
  if (establishData.merchantReference) query += `&merchantReference=${establishData.merchantReference}`;
  if (establishData.paymentType) query += `&paymentType=${establishData.paymentType}`;
  if (establishData.timeZone) query += `&timeZone=${establishData.timeZone}`;
  if (establishData.transactionType) query += `&transactionType=${establishData.transactionType}`
  if (establishData.eventId) query += `&eventId=${establishData.eventId}`
  if (establishData.eventType) query += `&eventType=${establishData.eventType}`
  if (establishData.objectId) query += `&objectId=${establishData.objectId}`
  if (establishData.objectType) query += `&objectType=${establishData.objectType}`
  if (establishData.message) query += `&message=${establishData.message}`
  if (establishData.createdAt) query += `&createdAt=${establishData.createdAt}`
  if (establishData.fiCode) query += `&fiCode=${establishData.fiCode}`
  if (establishData.status) query += `&status=${establishData.status}`
  if (establishData.statusMessage) query += `&statusMessage=${establishData.statusMessage}`
  // if (establishData.splitToken) query += `&splitToken=${establishData.splitToken}`
	
	

  if (establishData.paymentType === 'Recurring' && establishData.recurrence) {
    if (establishData.recurrence.startDate) query += `&recurrence.startDate=${establishData.recurrence.startDate}`;
    if (establishData.recurrence.endDate) query += `&recurrence.endDate=${establishData.recurrence.endDate}`;
    if (establishData.recurrence.frequency) query += `&recurrence.frequency=${establishData.recurrence.frequency}`;
    if (establishData.recurrence.frequencyUnit) query += `&recurrence.frequencyUnit=${establishData.recurrence.frequencyUnit}`;
    if (establishData.recurrence.frequencyUnitType) query += `&recurrence.frequencyUnitType=${establishData.recurrence.frequencyUnitType}`;
    if (establishData.recurrence.recurringAmount) query += `&recurrence.recurringAmount=${establishData.recurrence.recurringAmount}`;
    if (establishData.recurrence.automaticCapture) query += `&recurrence.automaticCapture=${establishData.recurrence.automaticCapture}`;
  }

  if (establishData.verification) {
    if (establishData.verification.status) query += `&verification.status=${establishData.verification.status}`;
    if (establishData.verification.verifyCustomer) query += `&verification.verifyCustomer=${establishData.verification.verifyCustomer}`;
  }

  if (establishData.customer) {
    if (establishData.customer.customerId) query += `&customer.customerId=${establishData.customer.customerId}`;
    if (establishData.customer.externalId) query += `&customer.externalId=${establishData.customer.externalId}`;
    if (establishData.customer.name) query += `&customer.name=${establishData.customer.name}`;
    if (establishData.customer.vip !== undefined) query += `&customer.vip=${establishData.customer.vip}`;
    if (establishData.customer.taxId) query += `&customer.taxId=${establishData.customer.taxId}`;
    if (establishData.customer.driverLicense) {
      if (establishData.customer.driverLicense.number) query += `&customer.driverLicense.number=${establishData.customer.driverLicense.number}`;
      if (establishData.customer.driverLicense.state) query += `&customer.driverLicense.state=${establishData.customer.driverLicense.state}`;
    }
    if (establishData.customer.address) {
      if (establishData.customer.address.address1) query += `&customer.address.address1=${establishData.customer.address.address1}`;
      if (establishData.customer.address.address2) query += `&customer.address.address2=${establishData.customer.address.address2}`;
      if (establishData.customer.address.city) query += `&customer.address.city=${establishData.customer.address.city}`;
      if (establishData.customer.address.state) query += `&customer.address.state=${establishData.customer.address.state}`;
      if (establishData.customer.address.zip) query += `&customer.address.zip=${establishData.customer.address.zip}`;
      if (establishData.customer.address.country) query += `&customer.address.country=${establishData.customer.address.country}`;
    }
    if (establishData.customer.phone) query += `&customer.phone=${establishData.customer.phone}`;
    if (establishData.customer.email) query += `&customer.email=${establishData.customer.email}`;
    if (establishData.customer.balance) query += `&customer.balance=${establishData.customer.balance}`;
    if (establishData.customer.currency) query += `&customer.currency=${establishData.customer.currency}`;
    if (establishData.customer.enrollDate) query += `&customer.enrollDate=${establishData.customer.enrollDate}`;
  }

  if (establishData.account) {
    if (establishData.account.nameOnAccount) query += `&account.nameOnAccount=${establishData.account.nameOnAccount}`;
    if (establishData.account.name) query += `&account.name=${establishData.account.name}`;
    if (establishData.account.type) query += `&account.type=${establishData.account.type}`;
    if (establishData.account.profile) query += `&account.profile=${establishData.account.profile}`;
    if (establishData.account.accountNumber) query += `&account.accountNumber=${establishData.account.accountNumber}`;
    if (establishData.account.routingNumber) query += `&account.routingNumber=${establishData.account.routingNumber}`;
  }

  if (establishData.transactionId) query += `&transactionId=${establishData.transactionId}`;

  console.log(query)

  const requestSignature = createHmac('sha1', accessKey).update(query).digest('base64');
  return requestSignature;
}
const establishData = {
	"merchantId": "1021456787",
	"merchantReference": "5123f63a-ce64-4913-bf5b-617fb8f8cd86-AUTHORIZATION",
	"paymentType": "2",
	"transactionType": "1",
	"eventId": "1023808932",
	"eventType": "Authorize",
	"objectId": "1023474447",
	"objectType": "Transaction",
	"message": "",
	"timeZone": "Etc/UTC",
	"createdAt": "1652969878145",
	"fiCode": "200005503",
	"status": "2",
	"statusMessage": "Authorized",
	"splitToken": "CKXluuWNMBABGHAgACo4GT1qpCD6MNJNDgZTL/sEq78+/oCGNYgqkysqBAzkyVNjYp4h57rhV3fC4NVxJE86DFJH6m1MICo="
}

// generateSignature(establishData, 'QUaWTPmGQT9CFtS5zUa4');

const isValidSignature = (request, header, apiKey) => {
  const query = decodeURIComponent(request);
  console.log(query)
  // decodeURIComponent doesn't properly decode '+' to ' '.
  const test = createHmac('sha1', apiKey).update(query).digest('base64');
  console.log(test)
  const auth = Buffer.from(header, 'base64').toString('utf8').split(':');
  console.log(auth)
  return test === auth[1];
}

const request = 'merchantId=1021456787&merchantReference=5123f63a-ce64-4913-bf5b-617fb8f8cd86-AUTHORIZATION&paymentType=2&transactionType=1&eventId=1023808932&eventType=Authorize&objectId=1023474447&objectType=Transaction&message=&timeZone=Etc/UTC&createdAt=1652969878145&fiCode=200005503&status=2&statusMessage=Authorized';

const header = 'VlhWRm42S0t3S1lkdERkSlNUMkw6UVVhV1RQbUdRVDlDRnRTNXpVYTQ=';

const apiKey = 'QUaWTPmGQT9CFtS5zUa4';

// console.log(isValidSignature(request, header, apiKey))

const faker = require('@faker-js/faker').default;

console.log(faker.image.food())