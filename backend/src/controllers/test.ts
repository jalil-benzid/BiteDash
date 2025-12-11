import { Request, Response } from "express";

async function getTest(req: Request, res: Response) {
    try {
        res.status(200).json({
            success: true,
            message: 'The test has completed successfully'
        });
    } catch (e) {
        console.log('Error from getTest\n', e);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export { getTest };
