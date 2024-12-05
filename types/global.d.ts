import * as express from 'express';

declare global {
    namespace Express {
        interface Request {
            loggedInUser?: string;  // or whatever type your loggedInUser should be
        }
    }
}
