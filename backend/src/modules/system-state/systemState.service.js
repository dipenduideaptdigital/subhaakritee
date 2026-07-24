import { StatusCodes } from "http-status-codes";
import { AppError } from "../../shared/errors/AppError.js";
import { prisma } from "../../config/db.js";
import { systemStateStore } from "../../shared/core/systemStateStore.js";
import crypto from "crypto";
import xss from "xss";

export const getSystemStateConfig = async () => {
  return systemStateStore.get();
};

export const updateSystemStateConfig = async (payload, actorId, actorName) => {
  const SETTING_KEY = "system_state_config";

  return await prisma.$transaction(async (tx) => {
    const currentSetting = await tx.setting.findUnique({
      where: { key: SETTING_KEY }
    });

    if (!currentSetting) {
      throw new AppError("System State configuration anchor missing from database.", StatusCodes.INTERNAL_SERVER_ERROR);
    }

    const currentConfig = currentSetting.value;

    if (currentConfig.version !== payload.version) {
      throw new AppError(
        "Concurrency conflict: The system state was modified by another administrator just now. Please refresh and try again.", 
        StatusCodes.CONFLICT
      );
    }

    const now = new Date();
    const isActivatingMaintenance = payload.state !== "ACTIVE" && currentConfig.state === "ACTIVE";
    const isDeactivatingMaintenance = payload.state === "ACTIVE" && currentConfig.state !== "ACTIVE";

    const newState = {
      ...currentConfig,
      ...payload,
      title: payload.title ? xss(payload.title) : currentConfig.title,
      description: payload.description ? xss(payload.description) : currentConfig.description,
      reason: xss(payload.reason),
      version: currentConfig.version + 1,
      enabledBy: payload.state !== "ACTIVE" ? actorName : null,
      enabledAt: isActivatingMaintenance ? now.toISOString() : (payload.state !== "ACTIVE" ? currentConfig.enabledAt : null),
      disabledAt: isDeactivatingMaintenance ? now.toISOString() : null,
    };

    if (payload.state !== "ACTIVE" && !newState.bypassToken) {
      newState.bypassToken = crypto.randomBytes(32).toString("hex");
    } else if (payload.state === "ACTIVE") {
      newState.bypassToken = null; 
    }

    const updatedSetting = await tx.setting.update({
      where: { key: SETTING_KEY },
      data: { value: newState }
    });

    await tx.settingRevision.create({
      data: {
        settingId: updatedSetting.id,
        value: newState,
        actorId: actorId
      }
    });

    systemStateStore.set(newState);

    return newState;
  });
};