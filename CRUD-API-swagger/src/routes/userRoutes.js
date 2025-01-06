import express from "express";
import {
  createUser,
  deleteUser,
  getAllUser,
  getUserById,
  updateUser,
} from "../controller/userController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Patients
 *   description: API for managing patients
 */

/**
 * @swagger
 * /patient:
 *   get:
 *     summary: Retrieve a list of patients
 *     tags: [Patients]
 *     responses:
 *       200:
 *         description: A list of patients
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   created_at:
 *                     type: string
 *                     description: When the patient was created
 *                     format: date-time
 */
router.get("/patient", getAllUser);

/**
 * @swagger
 * /patient/{id}:
 *   get:
 *     summary: Retrieve a patient by ID
 *     tags: [Patients]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the patient
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A patient object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 created_at:
 *                   type: string
 *                   description: When the patient was created
 *                   format: date-time
 *       404:
 *         description: Patient not found
 */
router.get("/patient/:id", getUserById);

/**
 * @swagger
 * /patient:
 *   post:
 *     summary: Create a new patient
 *     tags: [Patients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Patient created successfully
 *       400:
 *         description: Invalid input
 */
router.post("/patient", createUser);

/**
 * @swagger
 * /patient/{id}:
 *   put:
 *     summary: Update a patient by ID
 *     tags: [Patients]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the patient
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Patient updated successfully
 *       404:
 *         description: Patient not found
 */
router.put("/patient/:id", updateUser);
/**
 * @swagger
 * /patient/{id}:
 *   delete:
 *     summary: Delete a patient by ID
 *     tags: [Patients]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the patient
 *         schema:
 *           type: integer
 *     responses:
 *
 *       404:
 *         description: Patient not found
 *       204:
 *         description: Patient deleted successfully
 */

router.delete("/patient/:id", deleteUser);

export default router;
