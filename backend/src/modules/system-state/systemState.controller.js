import { StatusCodes } from "http-status-codes";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { sendResponse } from "../../shared/utils/apiResponse.js";
import * as service from "./systemState.service.js";

export const getSystemStateController = asyncHandler(async (req, res) => {
  const config = await service.getSystemStateConfig();
  
  sendResponse({
    res,
    statusCode: StatusCodes.OK,
    message: "System state configuration retrieved successfully.",
    data: config
  });
});

export const updateSystemStateController = asyncHandler(async (req, res) => {
  const updatedConfig = await service.updateSystemStateConfig(
    req.body,
    req.user.id,
    req.user.name
  );

  sendResponse({
    res,
    statusCode: StatusCodes.OK,
    message: `System successfully transitioned to ${updatedConfig.state} mode.`,
    data: updatedConfig
  });
});