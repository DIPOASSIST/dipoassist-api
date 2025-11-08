import { PrismaClient } from '@prisma/client';
import { ReportType } from '../../validator/report/reportValidator';

const prisma = new PrismaClient();

export const getAllReportsService = async () => {
  try {
    const result = await prisma.report.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone_number: true,
            email: true,
          },
        },
      },
    });
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error fetching reports: ' + error.message);
    }
    throw new Error('Unknown error fetching reports');
  }
};

export const getAllReportsByUserService = async (userId: string) => {
  try {
    const result = await prisma.report.findMany({
      where: {
        user_id: userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone_number: true,
            email: true,
          },
        },
      },
    });
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error fetching phrases: ' + error.message);
    }
    throw new Error('Unknown error fetching phrases');
  }
};

export const getDetailReportService = async (reportId: string) => {
  try {
    const result = await prisma.report.findUnique({
      where: { id: reportId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone_number: true,
            email: true,
          },
        },
      },
    });
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error fetching report details: ' + error.message);
    }
    throw new Error('Unknown error fetching report details');
  }
};

export const createReportService = async (data: ReportType) => {
  try {
    const result = await prisma.report.create({
      data,
    });
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error creating report: ' + error.message);
    }
    throw new Error('Unknown error creating report');
  }
};

export const updateReportService = async (
  reportId: string,
  data: ReportType,
) => {
  try {
    const result = await prisma.report.update({
      where: { id: reportId },
      data,
    });
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error updating report: ' + error.message);
    }
    throw new Error('Unknown error updating report');
  }
};

export const deleteReportService = async (reportId: string) => {
  try {
    const result = await prisma.report.delete({
      where: { id: reportId },
    });
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error deleting report: ' + error.message);
    }
    throw new Error('Unknown error deleting report');
  }
};

export const getReportByNakesService = async (nakesId: string) => {
  try {
    const result = await prisma.report.findMany({
      where: {
        user: {
          nakes_id: nakesId,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error fetching reports by nakes ID: ' + error.message);
    }
    throw new Error('Unknown error fetching reports by nakes ID');
  }
};

export const getCountReportByNakesService = async (nakesId: string) => {
  try {
    const count = await prisma.report.count({
      where: {
        user: {
          nakes_id: nakesId,
        },
      },
    });

    return count;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error counting reports by nakes ID: ' + error.message);
    }
    throw new Error('Unknown error counting reports by nakes ID');
  }
};
