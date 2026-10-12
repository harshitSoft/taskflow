package com.taskflow.dto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardDto {
    private long totalUsers;
    private long activeUsers;
    private long inactiveUsers;
    private long totalTasks;
    private long totalCompletedTasks;
}
