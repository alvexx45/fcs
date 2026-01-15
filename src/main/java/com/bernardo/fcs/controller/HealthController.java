package com.bernardo.fcs.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class HealthController {
    
    @GetMapping("")
    public String home() {
        return "FCS API is running!";
    }
    
    @GetMapping("/health")
    public String health() {
        return "OK";
    }
}
