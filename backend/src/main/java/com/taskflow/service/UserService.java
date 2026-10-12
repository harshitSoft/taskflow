package com.taskflow.service;

import com.taskflow.dto.AdminDashboardDto;
import com.taskflow.dto.UserCreateRequest;
import com.taskflow.dto.UserDto;
import com.taskflow.dto.UserStatsDto;
import com.taskflow.entity.Role;
import com.taskflow.entity.User;
import com.taskflow.exception.BadRequestException;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.repository.TaskRepository;
import com.taskflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public List<UserStatsDto> getAllUsers() {
        return userRepository.findAll().stream().map(user -> {
            long totalTasks = taskRepository.countByUserId(user.getId());
            long completedTasks = taskRepository.countByUserIdAndStatus(user.getId(), com.taskflow.entity.TaskStatus.COMPLETED);
            return UserStatsDto.builder()
                    .id(user.getId())
                    .name(user.getName())
                    .email(user.getEmail())
                    .role(user.getRole().name())
                    .active(user.isActive())
                    .totalTasks(totalTasks)
                    .completedTasks(completedTasks)
                    .build();
        }).collect(Collectors.toList());
    }

    @Transactional
    public UserDto createUser(UserCreateRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already in use");
        }
        
        Role role;
        try {
            role = Role.valueOf(request.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid role");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .active(true)
                .build();
                
        user = userRepository.save(user);
        
        return UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .active(user.isActive())
                .build();
    }

    @Transactional
    public void updateUserStatus(Long id, boolean active, Long currentUserId) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
                
        if (user.getId().equals(currentUserId)) {
            throw new BadRequestException("Cannot change your own status");
        }
        
        user.setActive(active);
        userRepository.save(user);
    }
    
    @Transactional(readOnly = true)
    public AdminDashboardDto getDashboardStats() {
        long activeUsers = userRepository.countByActiveTrue();
        long inactiveUsers = userRepository.countByActiveFalse();
        long totalTasks = taskRepository.count();
        long completedTasks = taskRepository.countByStatus(com.taskflow.entity.TaskStatus.COMPLETED);
        
        return AdminDashboardDto.builder()
                .totalUsers(activeUsers + inactiveUsers)
                .activeUsers(activeUsers)
                .inactiveUsers(inactiveUsers)
                .totalTasks(totalTasks)
                .totalCompletedTasks(completedTasks)
                .build();
    }
}
