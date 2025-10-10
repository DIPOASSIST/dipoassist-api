import { Request, Response, NextFunction } from 'express';
import { getCountReportByNakesService } from '../../../services/report/reportService';
import { getCountTodaySchedulesNakesService } from '../../../services/schedule/scheduleService';
import { sendSuccess } from '../../../helper/response';
import { getCountUserByNakesService } from '../../../services/user/userService';

export const getNakesSummary = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const nakesId = req.user.id;

    const [reportCount, todayScheduleCount, userCount] = await Promise.all([
      getCountReportByNakesService(nakesId),
      getCountTodaySchedulesNakesService(nakesId),
      getCountUserByNakesService(nakesId),
    ]);

    const summary = {
      total_reports: reportCount,
      today_schedules: todayScheduleCount,
      total_users: userCount,
    };

    return sendSuccess(res, 200, 'Nakes summary fetched successfully', summary);
  } catch (error) {
    next(error);
  }
};
