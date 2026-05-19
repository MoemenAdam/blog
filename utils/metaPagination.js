const generateMetaPagination = ({ totalDocs, page, limit, data }) => {
  return {
    limit,
    current_page: page,
    last_page: Math.ceil(totalDocs / limit),
    from: data.length ? (page - 1) * limit + 1 : null,
    to: data.length ? (page - 1) * limit + data.length : null,
    total: totalDocs,
  };
};


export default generateMetaPagination;