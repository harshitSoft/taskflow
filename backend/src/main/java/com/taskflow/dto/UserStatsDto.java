package com.taskflow.dto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserStatsDto {
    private Long id;
    private String name;
    private String email;
    private String role;
    private boolean active;
    private long totalTasks;
    private long completedTasks;
}
