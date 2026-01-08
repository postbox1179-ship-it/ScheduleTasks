package com.learn.SchedulTasks.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.learn.SchedulTasks.entities.Task;
import com.learn.SchedulTasks.service.TaskService;

import jakarta.validation.Valid;

@Controller
@RequestMapping("/api")
public class TaskController {

	private TaskService taskService;
	private TaskController(TaskService taskService) {
		this.taskService=taskService;
	}
	
	@PostMapping("/tasks")
	@ResponseBody
	public List<Task> addTasks(@Valid @RequestBody List<Task> tasks){
		return taskService.addTask(tasks); //200 request succesfull server responded as required
	}
	
	@PutMapping("/tasks/{id}")
	@ResponseBody
	public ResponseEntity<Task> updateTask(@PathVariable int id, @Valid @RequestBody Task updatedTasks){
		Task task = taskService.updateTask(id, updatedTasks);
		if(task != null)
			return ResponseEntity.ok(task);
		return ResponseEntity.notFound().build();
	}
}
