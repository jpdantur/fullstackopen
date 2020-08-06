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
describe("when there is initially some blogs saved", () => {
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
});

describe("addition of a new blog", () => {
  test("succeds with valid data", async () => {
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

  test("defaults to 0 likes if likes property is absent", async () => {
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

  test("fails with status code 400 when title and url are missing", async () => {
    const newBlog = {
      author: "Pepe Argento",
    };

    await api.post("/api/blogs").send(newBlog).expect(400);
  });
});

describe("deletion of a blog", () => {
  test("succeds with status code 204 if id is valid", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];
    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);
    const titles = blogsAtEnd.map((blog) => blog.title);
    expect(titles).not.toContain(blogToDelete.title);
  });
});

describe("update of a blog", () => {
  test("modifies the likes of a blog", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];
    const newLikes = blogToUpdate.likes + 1;
    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({ ...blogToUpdate, likes: newLikes })
      .expect(200);
    expect(response.body.likes).toBe(newLikes);
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
    const updatedBlog = blogsAtEnd.find((blog) => blog.id === blogToUpdate.id);
    expect(updatedBlog.likes).toBe(newLikes);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
