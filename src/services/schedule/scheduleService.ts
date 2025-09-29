import { PrismaClient } from '@prisma/client';
import { ScheduleType } from '../../validator/schedule/scheduleValidator';

const prisma = new PrismaClient();

export const getAllSchedulesPatientService = async (userId: string) => {
  try {
    const result = await prisma.schedule.findMany({
      where: {
        patient_id: userId,
      },
    });
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error fetching schedules patients: ' + error.message);
    }
    throw new Error('Unknown error fetching schedules patients');
  }
};

export const getAllSchedulesNakesService = async (userId: string) => {
  try {
    const result = await prisma.schedule.findMany({
      where: {
        medical_id: userId,
      },
    });
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error fetching schedules nakes: ' + error.message);
    }
    throw new Error('Unknown error fetching schedules nakes');
  }
};

export const createScheduleService = async (data: ScheduleType) => {
  try {
    const result = await prisma.schedule.create({
      data,
    });

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error creating schedule: ' + error.message);
    }
    throw new Error('Unknown error creating schedule');
  }
};

export const updateScheduleService = async (
  scheduleId: string,
  data: ScheduleType,
) => {
  try {
    const result = await prisma.schedule.update({
      where: {
        id: scheduleId,
      },
      data,
    });

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error updating schedule: ' + error.message);
    }
    throw new Error('Unknown error updating schedule');
  }
};

export const deleteScheduleService = async (scheduleId: string) => {
  try {
    const result = await prisma.schedule.delete({
      where: {
        id: scheduleId,
      },
    });

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error deleting schedule: ' + error.message);
    }
    throw new Error('Unknown error deleting schedule');
  }
};
