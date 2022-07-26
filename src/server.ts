/* eslint-disable @typescript-eslint/no-namespace */
/*
    This file only exports the server code (no exec), to
    allow execution in other files (eg: tests)
*/

/* Import express and other core dependencies */
import express from "express";
import "express-async-errors";
import cors from 'cors';
/* Import routes */
import planetsRoutes from "./routes/planets";
import authRoutes from "./routes/auth";
import testPagesRoutes from "./routes/testpages"
/* Import middleware */
import { ValidationErrorMiddleware } from "./lib/validation";
import { initSessionMiddleware } from "./lib/middleware/session";
import { notFoundMiddleware, initErrorMiddleware } from "./lib/middleware/error";
import { passport } from "./lib/middleware/passport"

/* TYPES DECLARATION */
/* @TODO: move them in a separate file */
declare global {
    namespace Express {
        interface User {
            username: string;
        }
    }
}
declare module "express-session" {
    interface SessionData {
        redirectTo: string;
    }
}

/* Within app we call the top-level function exported by express module */
export const app = express();

/* GitHub auth middleware */
app.use(initSessionMiddleware(app.get("env")))
app.use(passport.initialize())
app.use(passport.session())

/* ---- PARSERS ---- */
/* parse application/x-www-form-urlencoded */
app.use(express.urlencoded({ extended: true }));
/* parse application/json */
app.use(express.json());
/* enable cors */
app.use(cors({ origin: "http:/localhost:8080", credentials: true }));
/* ---- PARSERS ---- */


/* ---- ROUTES ---- */
/* define the auth routes */
app.use("/auth", authRoutes)
/* define the entry point for our REST endpoints in planets.ts */
app.use("/planets", planetsRoutes)
/* define the test pages routes */
app.use("/", testPagesRoutes)
/* define handling for not found routes */
app.use(notFoundMiddleware)
/* ---- ROUTES ---- */

/* This middleware needs to be used after all the routes, like a "catch" */
app.use(ValidationErrorMiddleware)

/* middleware to format errors as json */
app.use(initErrorMiddleware(app.get("env")))

export default app;
