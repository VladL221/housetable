const bitCoinToDollar = 39364;
const eurToDollar = 1.08;
const convertCurrencyToUSD = (balance) => {
  const totalUSD = { BalanceInUsd: 0, feePaidInUSD: 0, feeUnpaidInUSD: 0 };
  const convertedFeePaidToUSD = balance.map((balance) => {
    switch (balance['_id']) {
      case 'USD':
        totalUSD['BalanceInUsd'] +=
          balance['totalFeePaid'] -
          (balance['totalFeePaid'] - balance['amountToPay']);
        totalUSD['feePaidInUSD'] += balance['totalFeePaid'];
        totalUSD['feeUnpaidInUSD'] +=
          balance['totalFeePaid'] - balance['amountToPay'];
        break;
      case 'EUR':
        totalUSD['BalanceInUsd'] +=
          (balance['totalFeePaid'] -
            (balance['totalFeePaid'] - balance['amountToPay'])) *
          eurToDollar;
        totalUSD['feePaidInUSD'] += balance['totalFeePaid'] * eurToDollar;
        totalUSD['feeUnpaidInUSD'] +=
          (balance['totalFeePaid'] - balance['amountToPay']) * eurToDollar;
        break;
      case 'BTC':
        totalUSD['BalanceInUsd'] +=
          (balance['totalFeePaid'] -
            (balance['totalFeePaid'] - balance['amountToPay'])) *
          bitCoinToDollar;
        totalUSD['feePaidInUSD'] += balance['totalFeePaid'] * bitCoinToDollar;
        totalUSD['feeUnpaidInUSD'] +=
          (balance['totalFeePaid'] - balance['amountToPay']) * bitCoinToDollar;
        break;
      default:
    }
    return balance;
  });
  return totalUSD;
};

export default {
  convertCurrencyToUSD,
};
