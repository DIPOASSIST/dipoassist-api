import { NextFunction, Request, Response } from 'express';
import { deletePatientMedicalService } from '../../services/patient/patientService';
import { sendSuccess } from '../../helper/response';

export const deletePatientMedical = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.params.id;

    const data = await deletePatientMedicalService(userId);

    return sendSuccess(res, 200, 'Success delete patient medical', data);
  } catch (error) {
    next(error);
  }
};
