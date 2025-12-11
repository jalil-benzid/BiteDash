import { Response } from "express";
import { createApplyService } from "../services/apply-services";
import validateApply from "../utils/validation/validate-apply";
import { MulterRequest } from "../types/multer-request";
import { ApplyInput } from "../types/apply";

async function createApply(req: MulterRequest, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image file is required",
      });
    }

    const formData: ApplyInput = {
      ...req.body,
      path: req.file.path,
      originalName: req.file.originalname,
      size: req.file.size,
      mimeType: req.file.mimetype,
    };

    const { error, value } = validateApply(formData);
    
    if (error) {
      console.log("Validation error:", error);
      return res.status(400).json({
        success: false,
        message: error.details.map((d) => d.message),
      });
    }

    const application = await createApplyService(value);

    return res.status(201).json({
      success: true,
      data: application,
    });
  } catch (e) {
    console.log("Error in createApply controller:", e);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export { createApply };