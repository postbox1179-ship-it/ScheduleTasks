package com.learn.SchedulTasks.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.learn.SchedulTasks.entities.Task;
import com.learn.SchedulTasks.service.TaskService;

import jakarta.validation.Valid;
import lombok.val;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:60403")
public class TaskRestController {
	
	private TaskService taskService;
	public TaskRestController(TaskService taskService) {
		this.taskService = taskService;
	}

	@GetMapping("/")
	public String getGreeting() {
		return "Hello";
	}
	
	@GetMapping("/tasks")
	public List<Task> getAllTasks() {
		return taskService.getAllTasks();
	}
	
	@GetMapping("/tasks/{id}")
	public ResponseEntity<Task> getTaskbyId(@PathVariable int id) {
		Task task = taskService.findTaskById(id);
		if(task != null) {
			return ResponseEntity.ok(task);
		}
		return ResponseEntity.notFound().build();
	}
	
//	@PostMapping("/tasks")
//	public ResponseEntity<List<Task>> addTasks(@Valid @RequestBody List<Task> tasks){
//		List<Task> savedTasks = taskService.addTask(tasks);
//		return ResponseEntity.status(HttpStatus.CREATED).body(savedTasks); //201 status code resource created successfully
//	}
	
//	@PutMapping("/task/{id}")
//	public ResponseEntity<Task> updateTask(@PathVariable int id, @Valid @RequestBody Task updateTask){
//		Task task = taskService.updateTask(id, updateTask);
//		if(task != null) {
//			return ResponseEntity.ok(task);
//		}
//		return ResponseEntity.notFound().build();
//	}
	
	@DeleteMapping("/tasks/{id}")
	public ResponseEntity<Void> deleteTask(@PathVariable int id){
		boolean deleted = taskService.deleteTask(id);
		if(deleted) {
			return ResponseEntity.noContent().build();
		}
		return ResponseEntity.notFound().build();
	}
}
