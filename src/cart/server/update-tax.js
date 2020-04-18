import { create } from 'apisauce';

const getTax = (postalcode) => {
  const api = create({
    baseURL: 'https://rest.avatax.com/api/v2/taxrates',
    headers: {
      Authorization: `Basic MjAwMDE2NzI2Mjo5OUYxNzM2OEQzMEUzMTg1}`,
    },
  });

  const getTaxRate = (postalCode) => api.get(`/bypostalcode?country=US&postalCode=${postalcode}`);
  
  return {
    getTaxRate,
  };
};
export default getTax();