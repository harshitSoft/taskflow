package com.taskflow.controller;

import com.taskflow.dto.TaskCreateRequest;
import com.taskflow.dto.TaskDto;
import com.taskflow.entity.TaskStatus;
import com.taskflow.security.CustomUserDetails;
import com.taskflow.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/tasks", "/tasks"})
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    public ResponseEntity<List<TaskDto>> getAllTasks(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(taskService.getTasks(userDetails.getId(), null));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<TaskDto>> getPendingTasks(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(taskService.getTasks(userDetails.getId(), TaskStatus.PENDING));
    }

    @GetMapping("/completed")
    public ResponseEntity<List<TaskDto>> getCompletedTasks(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(taskService.getTasks(userDetails.getId(), TaskStatus.COMPLETED));
    }

    @PostMapping
    public ResponseEntity<TaskDto> createTask(
            @Valid @RequestBody TaskCreateRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.status(HttpStatus.CREATED).body(taskService.createTask(userDetails.getId(), request));
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<TaskDto> completeTask(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(taskService.completeTask(id, userDetails.getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        taskService.deleteTask(id, userDetails.getId());
        return ResponseEntity.noContent().build();
    }
}
