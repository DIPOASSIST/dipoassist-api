import { NextFunction, Request, Response } from 'express';
import {
  createScheduleService,
  deleteScheduleService,
  getAllSchedulesNakesService,
  getAllSchedulesPatientService,
  updateScheduleService,
} from '../../services/schedule/scheduleService';
import { sendSuccess } from '../../helper/response';

export const getAllSchedulePatient = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = await getAllSchedulesPatientService(req.user.id);

    return sendSuccess(
      res,
      200,
      'Schedules of patients fetched successfully',
      data,
    );
  } catch (error) {
    next(error);
  }
};

export const getAllScheduleNakes = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = await getAllSchedulesNakesService(req.user.id);

    return sendSuccess(
      res,
      200,
      'Schedules of nakes fetched successfully',
      data,
    );
  } catch (error) {
    next(error);
  }
};

export const createSchedule = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const medicalId = req.user.id;

    const { patient_id, title, notes, schedule_date } = req.body;

    const data = await createScheduleService({
      patient_id,
      title,
      notes,
      schedule_date,
      medical_id: medicalId,
    });

    return sendSuccess(res, 201, 'Schedule created successfully', data);
  } catch (error) {
    next(error);
  }
};

export const updateSchedule = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const scheduleId = req.params.id;
    const data = await updateScheduleService(scheduleId, req.body);
    return sendSuccess(res, 200, 'Schedule updated successfully', data);
  } catch (error) {
    next(error);
  }
};

export const deleteSchedule = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const scheduleId = req.params.id;
    await deleteScheduleService(scheduleId);
    return sendSuccess(res, 200, 'Schedule deleted successfully');
  } catch (error) {
    next(error);
  }
};
