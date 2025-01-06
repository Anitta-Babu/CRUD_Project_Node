import {
  createUserService,
  deleteUserService,
  getAllUserService,
  getUserIdService,
  updateUserService,
} from "../models/userModel.js";

let patients = [];

const handleResponse = (res, status, message, data = null) => {
  res.status(status).json({
    status,
    message,
    data,
  });
};

export const createUser = async (req, res, next) => {
  const { name, email } = req.body;
  try {
    const newUser = await createUserService(name, email);
    handleResponse(res, 201, "Patient created successfully", newUser);
  } catch (err) {
    next(err);
  }
};

export const getAllUser = async (req, res, next) => {
  try {
    const users = await getAllUserService();
    handleResponse(res, 200, "Patient fetched successfully", users);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await getUserIdService(req.params.id);
    if (!user) return handleResponse(res, 404, "Patients not found");
    handleResponse(res, 200, "Patient fetched successfully", user);
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  const { name, email } = req.body;
  try {
    const updatedUser = await updateUserService(req.params.id, name, email);
    if (!updatedUser) return handleResponse(res, 404, "Patient not found");
    handleResponse(res, 200, "Patient updated successfully", updatedUser);
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await deleteUserService(req.params.id);
    if (!deletedUser) return handleResponse(res, 404, "Patient not found");
    handleResponse(res, 204, "Patient deleted successfully", deletedUser);
  } catch (err) {
    next(err);
  }
};
