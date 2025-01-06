import {
  createUserService,
  deleteUserService,
  getAllUserService,
  getUserIdService,
  updateUserService,
} from "../models/userModel.js";
import redisClient from "../config/redisClient.js";

const handleResponse = (res, status, message, data = null) => {
  res.status(status).json({
    status,
    message,
    data,
  });
};

export const createUser = async (req, res, next) => {
  const { name, email } = req.body;
  const cacheKey = "allUsers";

  try {
    const newUser = await createUserService(name, email);
    await redisClient.del(cacheKey);

    await redisClient.set(`user:${newUser.id}`, JSON.stringify(newUser));
    const allUsers = await getAllUserService();
    //await redisClient.set(cacheKey, JSON.stringify(allUsers), "EX", 3600);

    handleResponse(res, 201, "Patient created successfully", newUser);
  } catch (err) {
    console.error("Error creating user:", err);
    next(err);
  }
};

export const getAllUser = async (req, res, next) => {
  try {
    console.log("Checking Redis cache for all users...");
    const users = await redisClient.get("allUsers");

    if (users) {
      console.log("Cache hit: Returning users from cache.");
      return handleResponse(
        res,
        200,
        "Patients fetched from cache",
        JSON.parse(users)
      );
    } else {
      console.log("Cache miss: Fetching users from the database.");
      const usersFromDb = await getAllUserService();

      if (!usersFromDb || usersFromDb.length === 0) {
        console.log("No patients found in the database.");
        return handleResponse(res, 404, "No patients found");
      }

      try {
        await redisClient.set("allUsers", JSON.stringify(usersFromDb), {
          EX: 3600,
        });
        console.log("Users cached successfully.");
      } catch (cacheError) {
        console.error("Error caching users:", cacheError);
      }

      return handleResponse(
        res,
        200,
        "Patients fetched successfully",
        usersFromDb
      );
    }
  } catch (err) {
    console.error("Error fetching users:", err);
    next(err);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const userFromRedis = await redisClient.get(userId);

    if (!userFromRedis) {
      console.log(
        `User  not found in Redis, fetching from database: ${userId}`
      );
      const userFromDb = await getUserIdService(userId);
      console.log("User From DB:", userFromDb);

      if (!userFromDb) {
        return handleResponse(res, 404, "Patient not found");
      }

      const userObject = userFromDb.toObject
        ? userFromDb.toObject()
        : userFromDb;

      if (typeof userObject !== "object" || userObject === null) {
        throw new Error("Invalid user data format");
      }

      const redisData = JSON.stringify(userObject);
      await redisClient.set(`User:${userId}`, redisData);
      handleResponse(
        res,
        200,
        "Patient fetched successfully from database",
        userObject
      );
    } else {
      handleResponse(
        res,
        200,
        "Patient fetched successfully from Redis",
        JSON.parse(userFromRedis)
      );
    }
  } catch (err) {
    console.error("Error fetching user by ID:", err);
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  const { name, email } = req.body;
  const cacheKey = "allUsers";
  try {
    const updatedUser = await updateUserService(req.params.id, name, email);
    if (!updatedUser) return handleResponse(res, 404, "Patient not found");
    const redisData = JSON.stringify(updatedUser);
    await redisClient.del(cacheKey);
    await redisClient.set(`User:${req.params.id}`, redisData);
    handleResponse(
      res,
      200,
      "Patient updated successfully",
      JSON.parse(redisData)
    );
  } catch (err) {
    console.error("Error updating user:", err);
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const cacheKey = "allUsers";
    const deletedUser = await deleteUserService(req.params.id);
    if (!deletedUser) return handleResponse(res, 404, "Patient not found");
    await redisClient.del(`User:${req.params.id}` && cacheKey);
    handleResponse(res, 204, "Patient deleted successfully");
  } catch (err) {
    console.error("Error deleting user:", err);
    next(err);
  }
};
