import type { Context } from "hono";
import { DashboardService } from "../services/dashboard.service.js";

export class DashboardController {
    private readonly dashboardService = new DashboardService();

    async getSummary(c: Context) {
        const summary = await this.dashboardService.getSummary();

        return c.json(
            {
                success: true,
                data: summary,
                timestamp: new Date().toISOString(),
            },
            200,
        );
    }
}
