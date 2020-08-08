"use strict";
const mongoose = require("mongoose");
const supertest = require("supertest");
const bcrypt = require("bcrypt");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");
const User = require("../models/user");

beforeEach(async () => {
  await User.deleteMany({});
  await Blog.deleteMany({});
  const user = new User({
    username: helper.initialUser.username,
    name: helper.initialUser.name,
    passwordHash: await bcrypt.hash(helper.initialUser.password, 10),
  });
  await user.save();

  const blogObjects = helper.initialBlogs.map(
    (blog) => new Blog({ ...blog, user: user._id })
  );
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
    const login = await api
      .post("/api/login")
      .send({
        username: helper.initialUser.username,
        password: helper.initialUser.password,
      })
      .expect(200)
      .expect("Content-Type", /application\/json/);
    const token = login.body.token;
    const response = await api
      .post("/api/blogs")
      .send(newBlog)
      .set({ Authorization: `Bearer ${token}` })
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

    const login = await api
      .post("/api/login")
      .send({
        username: helper.initialUser.username,
        password: helper.initialUser.password,
      })
      .expect(200)
      .expect("Content-Type", /application\/json/);
    const token = login.body.token;
    const response = await api
      .post("/api/blogs")
      .send(newBlog)
      .set({ Authorization: `Bearer ${token}` })
      .expect(201)
      .expect("Content-Type", /application\/json/);

    expect(response.body.likes).toBe(0);
  });

  test("fails with status code 400 when title and url are missing", async () => {
    const newBlog = {
      author: "Pepe Argento",
    };
    const login = await api
      .post("/api/login")
      .send({
        username: helper.initialUser.username,
        password: helper.initialUser.password,
      })
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const token = login.body.token;
    await api
      .post("/api/blogs")
      .send(newBlog)
      .set({ Authorization: `Bearer ${token}` })
      .expect(400);
  });
  test("fails with status code 401 if no token is present", async () => {
    const newBlog = {
      title: "async/await simplifies making async calls",
      author: "Pepe Argento",
      url: "http://pepeargento.com",
      likes: 3,
    };
    await api.post("/api/blogs").send(newBlog).expect(401);
  });
});

describe("deletion of a blog", () => {
  test("succeds with status code 204 if id is valid", async () => {
    const login = await api
      .post("/api/login")
      .send({
        username: helper.initialUser.username,
        password: helper.initialUser.password,
      })
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const token = login.body.token;
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set({ Authorization: `Bearer ${token}` })
      .expect(204);
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);
    const titles = blogsAtEnd.map((blog) => blog.title);
    expect(titles).not.toContain(blogToDelete.title);
  });
});

describe("update of a blog", () => {
  test("modifies the likes of a blog", async () => {
    const login = await api
      .post("/api/login")
      .send({
        username: helper.initialUser.username,
        password: helper.initialUser.password,
      })
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const token = login.body.token;
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];
    const newLikes = blogToUpdate.likes + 1;
    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({ ...blogToUpdate, likes: newLikes })
      .set({ Authorization: `Bearer ${token}` })
      .expect(200);
    expect(response.body.likes).toBe(newLikes);
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
    const updatedBlog = blogsAtEnd.find((blog) => blog.id === blogToUpdate.id);
    expect(updatedBlog.likes).toBe(newLikes);
  });
});

describe("when there is initially one user in db", () => {
  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "salainen",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test("creation fails with proper statuscode and message if username already taken", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "root",
      name: "Superuser",
      password: "salainen",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("`username` to be unique");

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test("creation fails with proper statuscode and message if password is too short", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "root",
      name: "Superuser",
      password: "sa",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain(
      "password must be at least 3 characters long"
    );

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });
  test("creation fails with proper statuscode and message if username is too short", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "ro",
      name: "Superuser",
      password: "sasasa",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain(
      "is shorter than the minimum allowed length"
    );

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
