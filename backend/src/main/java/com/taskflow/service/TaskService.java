package com.taskflow.service;

import com.taskflow.dto.TaskCreateRequest;
import com.taskflow.dto.TaskDto;
import com.taskflow.entity.Task;
import com.taskflow.entity.TaskStatus;
import com.taskflow.entity.User;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.repository.TaskRepository;
import com.taskflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<TaskDto> getTasks(Long userId, TaskStatus status) {
        List<Task> tasks;
        if (status == null) {
            tasks = taskRepository.findByUserIdOrderByCreatedAtDesc(userId);
        } else {
            tasks = taskRepository.findByUserIdAndStatusOrderByCreatedAtDesc(userId, status);
        }
        return tasks.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional
    public TaskDto createTask(Long userId, TaskCreateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
                
        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(TaskStatus.PENDING)
                .user(user)
                .build();
                
        task = taskRepository.save(task);
        return mapToDto(task);
    }

    @Transactional
    public TaskDto completeTask(Long taskId, Long userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
                
        if (!task.getUser().getId().equals(userId)) {
            throw new org.springframework.security.access.AccessDeniedException("Access denied to task");
        }
        
        task.setStatus(TaskStatus.COMPLETED);
        task.setCompletedAt(LocalDateTime.now());
        task = taskRepository.save(task);
        
        return mapToDto(task);
    }

    @Transactional
    public void deleteTask(Long taskId, Long userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
                
        if (!task.getUser().getId().equals(userId)) {
            throw new org.springframework.security.access.AccessDeniedException("Access denied to task");
        }
        
        taskRepository.delete(task);
    }

    private TaskDto mapToDto(Task task) {
        return TaskDto.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus().name())
                .createdAt(task.getCreatedAt())
                .completedAt(task.getCompletedAt())
                .build();
    }
}
