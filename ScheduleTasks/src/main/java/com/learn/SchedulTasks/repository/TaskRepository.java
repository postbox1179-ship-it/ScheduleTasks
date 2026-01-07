package com.learn.SchedulTasks.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.learn.SchedulTasks.entities.Task;

@Repository
public interface TaskRepository extends JpaRepository<Task, Integer>{

}
