import { prisma } from "../../config/db.js";
import { logger } from "../../config/logger.js";

class SystemStateStore {
  constructor() {
    this.state = null;
    this.defaultState = {
      state: "ACTIVE", // ACTIVE, MAINTENANCE, READ_ONLY, EMERGENCY, COMING_SOON
      title: "We'll be back soon!",
      description: "Our system is currently undergoing scheduled maintenance to improve your experience.",
      estimatedCompletion: null,
      supportEmail: "support@subhaakritee.com",
      supportPhone: "+91 9831-637-409",
      showSocialLinks: true,
      allowSearchEngine: true,
      enabledBy: null,
      enabledAt: null,
      reason: "Initial deployment",
      version: 1,
      bypassToken: null 
    };
  }

  // Called once during server boot
  async initialize() {
    try {
      const record = await prisma.setting.findUnique({
        where: { key: "system_state_config" },
      });

      if (record && record.value) {
        this.state = { ...this.defaultState, ...record.value };
      } else {
        this.state = { ...this.defaultState };
        await prisma.setting.create({
          data: { key: "system_state_config", value: this.state },
        });
      }
      logger.info(`System State Engine initialized successfully in '${this.state.state}' mode.`);
    } catch (error) {
      logger.error("CRITICAL: Failed to initialize System State Engine.", error);
      this.state = { ...this.defaultState };
    }
  }

  get() {
    return this.state;
  }

  set(newState) {
    this.state = { ...this.state, ...newState };
  }
}

export const systemStateStore = new SystemStateStore();