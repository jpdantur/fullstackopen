"use strict";
const _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((acc, cur) => acc + cur.likes, 0);
};

const favoriteBlog = (blogs) => {
  return blogs.reduce((acc, cur) => (acc.likes > cur.likes ? acc : cur), {});
};

const mostBlogs = (blogs) => {
  const blogCounts = _.countBy(blogs, (blog) => blog.author);
  const authorWithMostBlogs = _.maxBy(
    Object.keys(blogCounts),
    (author) => blogCounts[author]
  );
  return {
    author: authorWithMostBlogs,
    blogs: blogCounts[authorWithMostBlogs],
  };
};

const mostLikes = (blogs) => {
  const blogsByAuthor = _.groupBy(blogs, (blog) => blog.author);
  const authorWithMostLikes = _.maxBy(Object.keys(blogsByAuthor), (author) =>
    totalLikes(blogsByAuthor[author])
  );
  return {
    author: authorWithMostLikes,
    likes: totalLikes(blogsByAuthor[authorWithMostLikes]),
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
