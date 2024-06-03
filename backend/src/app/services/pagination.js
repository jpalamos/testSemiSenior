
const getPaginated = async (model, page, limit, options, transaction) => {
  return new Promise((resolve, reject) => {
    const offset = (((page === 0 || page) && page >= 0 ? page + 1 : 1) - 1) * (limit && limit > 0 ? limit : 10);
    model.findAndCountAll({
      ...options,
      limit,
      offset,
      raw: true,
      nest: true,
      transaction
    })
      .then((result) => {
        const { count, rows } = result;
        resolve({ count, rows });
      })
      .catch((err) => reject(err))
  })
};

module.exports = {
  getPaginated,
};