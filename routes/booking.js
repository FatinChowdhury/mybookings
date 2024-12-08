import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { mongo_conn } from "../mongodb.js";
import { gen_uuid } from "../utils.js";

const ROUTER = express.Router();

ROUTER.get("/:booking_id", async (req, res) => {
    try {
        const booking_id = req.params.booking_id;
        let conn = await mongo_conn();
        const collection = conn.collection("bookings");

        let data = await collection.findOne({
            booking_id: booking_id,
        });

        res.json(data);
    } catch (err) {
        res.status(500).send({
            error: "resource does not exist",
            msg: "unable to fetch booking",
        });
    }
});

ROUTER.post("/", async (req, res) => {
    try {
        const uuid = gen_uuid();
        const data = {
            ...req.body,
            booking_id: uuid,
        };

        let conn = await mongo_conn();
        const collection = conn.collection("bookings");
        await collection.insertOne(data);
        res.status(201).send({
            msg: "booking created successfully",
        });
    } catch (err) {
        res.status(500).send({
            error: "unable to create resource",
            msg: "unable to create new booking",
        });
    }
});

export default ROUTER;
