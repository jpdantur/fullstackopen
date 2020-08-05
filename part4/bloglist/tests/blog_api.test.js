const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("all blogs are returned", async () => {
  const response = await api.get("/api/blogs");

  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test("all blogs contain id", async () => {
  const response = await api.get("/api/blogs");
  response.body.forEach((element) => {
    expect(element.id).toBeDefined();
  });
});

test("a specific blog is within the returned blogs", async () => {
  const response = await api.get("/api/blogs");

  const titles = response.body.map((r) => r.title);

  expect(titles).toContain("React patterns");
});

test("a valid blog can be added", async () => {
  const newBlog = {
    title: "async/await simplifies making async calls",
    author: "Pepe Argento",
    url: "http://pepeargento.com",
    likes: 3,
  };

  const response = await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

  expect(response.body).toMatchObject(newBlog);
});

test("a new blog without likes property has 0 likes", async () => {
  const newBlog = {
    title: "async/await simplifies making async calls",
    author: "Pepe Argento",
    url: "http://pepeargento.com",
  };

  const response = await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  expect(response.body.likes).toBe(0);
});

test("a blog without title and url cannot be added", async () => {
  const newBlog = {
    author: "Pepe Argento",
  };

  await api.post("/api/blogs").send(newBlog).expect(400);
});

afterAll(() => {
  mongoose.connection.close();
});
