package com.benchflux.model;

public class TestResponse {
    private String body;  // Response body
    private int statusCode;  // HTTP status code

    public TestResponse(String body, int statusCode) {
        this.body = body;
        this.statusCode = statusCode;
    }

    // Getters and setters

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public int getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(int statusCode) {
        this.statusCode = statusCode;
    }
}
