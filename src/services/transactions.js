import Blockchain from 'vanillachain-core';

import { C, ERROR } from '../common';

const { BLOCKCHAIN, KEY_TRANSACTIONS } = C;

export default ({ props, session }, res) => {
  const {
    latestTransaction,
    year = new Date().getFullYear().toString(),  // eslint-disable-line
  } = props;

  let { blocks: txs } = new Blockchain({
    ...BLOCKCHAIN, file: session.hash, key: KEY_TRANSACTIONS, readMode: true, secret: session.secret,
  });

  if (latestTransaction) {
    const index = txs.findIndex(({ hash }) => hash === latestTransaction);

    if (index < 0) return ERROR.NOT_FOUND(res);
    txs = txs.slice(index + 1, txs.length);
  }

  return res.json({
    txs: txs
      .filter(data => Object.keys(data).length > 0)
      .map(({ hash, timestamp, data = {} }) => typeof data === 'string' // eslint-disable-line
        ? ({ hash, timestamp, data: { title: data } })
        : ({ hash, timestamp: data.timestamp || timestamp, ...data })),
  });
};
