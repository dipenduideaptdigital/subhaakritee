import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { sendResponse } from "../../shared/utils/apiResponse.js";
import * as dashboardService from "./dashboard.service.js";

export const getDashboardStatsController = asyncHandler(async (req, res) => {
  const data = await dashboardService.getDashboardMetrics();
  
  const responseData = {
    unreadInquiries: data.unreadInquiries,
    newInquiriesToday: data.newInquiriesToday,
    stats: {
      inquiries: { value: data.inquiries.count, trend: data.inquiries.growth },
      projects: { value: data.projects.count, trend: data.projects.growth },
      pages: { value: data.pages.count, trend: data.pages.growth },
      blogs: { value: data.blogs.count, trend: data.blogs.growth },
    }
  };
  
  sendResponse({ res, statusCode: StatusCodes.OK, data: responseData });
});

export const getDashboardChartController = asyncHandler(async (req, res) => {
  const chartData = await dashboardService.getLeadChartTimeline(req.query.range);
  
  sendResponse({
    res,
    statusCode: StatusCodes.OK,
    message: "Lead generation timeline vector data computed safely.",
    data: chartData
  });
});

export const getDashboardActivityController = asyncHandler(async (req, res) => {
  const activityStream = await dashboardService.getSystemGlobalActivity();
  
  sendResponse({
    res,
    statusCode: StatusCodes.OK,
    message: "Global execution audit logs pipeline aggregated successfully.",
    data: activityStream
  });
});

export const exportLeadsController = asyncHandler(async (req, res) => {
  const csvData = await dashboardService.exportLeadsToCSV();
  
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", 'attachment; filename="leads_export.csv"');
  
  res.status(StatusCodes.OK).send(csvData);
});