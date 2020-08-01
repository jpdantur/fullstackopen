const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((acc, cur) => acc + cur.likes, 0);
};

const favoriteBlog = (blogs) => {
  return blogs.reduce((acc, cur) => (acc.likes > cur.likes ? acc : cur), {});
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
