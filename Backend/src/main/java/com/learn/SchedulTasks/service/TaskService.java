package com.learn.SchedulTasks.service;

import org.springframework.stereotype.Service;

import com.learn.SchedulTasks.entities.SubTask;
import com.learn.SchedulTasks.entities.Task;
import com.learn.SchedulTasks.repository.TaskRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    private TaskRepository taskRepository;
    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<Task> addTask(List<Task> tasks) {

        // Ensure each subtask has a reference to its parent task
        for (Task task : tasks) {
            if (task.getSt() != null) {
                for (SubTask sub : task.getSt()) {
                    sub.setTask(task);
                }
            }
        }
        return taskRepository.saveAll(tasks);
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Task updateTask(int id, Task updatedTask) {
        Optional<Task> optionalTask = taskRepository.findById(id);
        if (optionalTask.isPresent()) {
            Task task = optionalTask.get();
            task.setTask(updatedTask.getTask());
            task.setDueDate(updatedTask.getDueDate());
            task.setStatus(updatedTask.getStatus());
            // Replace subtasks safely
            if (task.getSt() == null) {
                task.setSt(new ArrayList<>());
            } else {
                task.getSt().clear();
            }

            if (updatedTask.getSt() != null) {
                for (SubTask sub : updatedTask.getSt()) {
                    sub.setTask(task);
                    task.getSt().add(sub);
                }
            }

            return taskRepository.save(task);
        }
        return null;
    }

    public Task findTaskById(int id) {
        Optional<Task> optionalTask = taskRepository.findById(id);
        return optionalTask.orElse(null);
    }

    public boolean deleteTask(int id) {
        if (taskRepository.existsById(id)) {
            taskRepository.deleteById(id);
            return true;
        }
        return false;
    }
}