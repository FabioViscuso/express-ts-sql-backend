import { Router } from "express";
import prisma from "../lib/prisma/client";
import { validate, planetSchema, PlanetSchema } from "../lib/validation";

const router = Router();

/*---------------- CRUD ENDPOINTS ----------------*/

/* Create new planet */
router.post("/", validate({ body: planetSchema }), async (req, res) => {
    /* If the req passes validation, this code will run */
    const incomingPlanetData: PlanetSchema = req.body;
    const newPlanet = await prisma.planet.create({ data: incomingPlanetData })
    res.status(201).json(newPlanet);
});

/* Read planets */
router.get("/", async (req, res) => {
    const planet = await prisma.planet.findMany();
    res.status(200).json(planet);
});

/* Read single planet by numeric ID */
router.get("/:id(\\d+)", async (req, res, next) => {
    const planetID = Number(req.params.id)
    const planet = await prisma.planet.findUnique({
        where: { id: planetID }
    });
    // if findUnique doesn't find a matching entry, it will return null
    if (!planet) {
        res.status(404)
        // pass the error to the express error handling middleware
        return next(`Cannot GET /planets/${planetID}. Element does not exist`)
    }

    res.status(200).json(planet)
});

/* Update planet */
router.put("/:id(\\d+)", validate({ body: planetSchema }), async (req, res, next) => {
    const planetID = Number(req.params.id)
    const incomingPlanetData: PlanetSchema = req.body;

    try {
        const planet = await prisma.planet.update({
            where: { id: planetID },
            data: incomingPlanetData
        });
        res.status(200).json(planet);
    } catch (err) {
        res.status(404);
        next(`Cannot PUT /planets/${planetID}. Element does not exist`);
    }
});

/* Add photo to a planet */
router.post("/:id(\\d+)/photo", async (req, res) => {
    res.send('PUT route for adding photo to a planet by id')
});

/* Delete planet(s) */
router.delete("/:id(\\d+)", async (req, res, next) => {
    const planetID = Number(req.params.id)
    try {
        await prisma.planet.delete({ where: { id: planetID } });
        res.status(204).end();
    } catch (err) {
        res.status(404);
        next(`Cannot DELETE /planets/${planetID}. Element does not exist`);
    }
});

export default router;